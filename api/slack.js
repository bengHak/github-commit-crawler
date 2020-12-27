const { WebClient } = require('@slack/web-api');
const CONFIG = require('../config/config');

const web = new WebClient(CONFIG.slack_api_token);

const readCommitHistory = async () => {
  const res = web.conversations.history({ channel: CONFIG.slack_channel_id });
  const history = await res.then((res) => {
    let messages = res.messages
      .map((e) => {
        if (e['attachments'] === undefined) return null;
        return {
          ts: e['ts'],
          detail: e['attachments'][0],
        };
      })
      // Exclude simple messages (ex. someone joined)
      .filter((e) => e !== null)
      // Exclude pr, creating repo
      .filter(
        (e) =>
          e['detail']['author_name'] !== undefined &&
          e['detail']['text'] !== undefined
      )
      .map((e) => {
        const commit_text = e['detail']['text'];
        let commit_link = commit_text.substring(
          commit_text.indexOf('<') + 1,
          commit_text.indexOf('|')
        );
        const offset = new Date().getTimezoneOffset();
        const ts = new Date(e['ts'] * 1000 - offset * 60 * 1000);
        return {
          author_name: e['detail']['author_name'],
          text: commit_link,
          timestamp: ts,
        };
      });
    //   console.log(messages);
    //   console.log(messages[0]['timestamp'] < messages[1]['timestamp']);
    //   console.log(messages[0]['timestamp'] > messages[1]['timestamp']);
    //   console.log(messages[0]['timestamp'] === messages[0]['timestamp']);
    // console.log(messages);
    return messages;
  });
  console.log(history);
  return history;
};

const getUnsavedCommit = (lastSavedCommitTime) => {};

module.exports = {
  readCommitHistory,
};

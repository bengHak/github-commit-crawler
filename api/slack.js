const Slack = require('slack-node');
const schedule = require('node-schedule');
const CONFIG = require('../config/config');

let slack = new Slack(CONFIG.slack_api_token)

// TODO: get last commit
// TODO: 

const readCommitHistory = () => slack.api(
    'conversations.history',
    {
        channel: 'C01HZ228YF3',
        limit: 1000,
    },
    (e, res) => {
        let messages = res.messages
            .map(e => {
                if (e['attachments'] === undefined)
                    return null;
                return {
                    ts: e['ts'],
                    detail: e['attachments'][0]
                }
            })
            // Exclude simple messages (ex. someone joined)
            .filter(e => e !== null)
            // Exclude pr, creating repo
            .filter(e => e['detail']['author_name'] !== undefined && e['detail']['text'] !== undefined)
            .map(e => {
                const commit_text = e['detail']['text'];
                let commit_link = commit_text.substring(
                    commit_text.indexOf('<') + 1,
                    commit_text.indexOf('|')
                )
                const offset = new Date().getTimezoneOffset();
                const ts = new Date((e['ts'] * 1000) - (offset * 60 * 1000));
                return {
                    author_name: e['detail']['author_name'],
                    text: commit_link,
                    timestamp: ts
                };
            });
        console.log(messages);
    }
)

module.exports.readCommitHistory = readCommitHistory;


// schedule.scheduleJob('9 5 * * *', function () {
//     console.log('출근!');
// });
// schedule.scheduleJob('10 * * * * *', function () {
//     console.log('퇴근!');
// });
const { getLastSavedCommitTime, saveCommit } = require('./api/db');
const { sendTodayResult, sendYesterdayResult } = require('./api/kakaowork');
const { getUnsavedCommit } = require('./api/slack');

switch (process.argv[2]) {
  case 'today':
    sendTodayResult();
    break;
  case 'yesterday':
    sendYesterdayResult();
    break;
  case 'save':
    (async () => {
      const lastTime = await getLastSavedCommitTime().then((res) => res);
      let unSavedCommit = await getUnsavedCommit(lastTime);
      unSavedCommit = unSavedCommit.reverse();
      unSavedCommit.map(async (e) => {
        await saveCommit({
          username: e['author_name'],
          commitLink: e['commit_link'],
          timestamp: e['timestamp'],
        });
      });
      console.log(new Date());
    })();
}

const schedule = require('node-schedule');
const { getLastSavedCommitTime, saveCommit } = require('./api/db');
const { getUnsavedCommit } = require('./api/slack');

// schedule.scheduleJob('00 * * * * *', function () {
//   getLastSavedCommitTime().then((res) => {
//     const offset = new Date().getTimezoneOffset();
//     const ts = new Date(res - offset * 60 * 1000);
//     console.log(ts);
//   });
// });

// DB에 저장되지 않은 커밋 저장
schedule.scheduleJob('10 * * * * *', async function () {
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
});

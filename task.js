const schedule = require('node-schedule');
const {
  getLastSavedCommitTime,
  saveCommit,
  getTodayComitter,
} = require('./api/db');
const { sendYesterdayResult, sendTodayResult } = require('./api/kakaowork');
const { getUnsavedCommit } = require('./api/slack');

// 오후 10시에 현황 보내기
schedule.scheduleJob('0 22 * * * *', () => sendTodayResult());

// 오전 10시에 어제 결과 보내기
schedule.scheduleJob('0 10 * * *', () => sendYesterdayResult());

// DB에 저장되지 않은 커밋 저장
schedule.scheduleJob('*/30 * * * *', async function () {
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
});

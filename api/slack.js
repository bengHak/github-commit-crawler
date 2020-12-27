const Slack = require('slack-node');
const schedule = require('node-schedule');

const CONFIG = require('../config/config');

let slack = new Slack(CONFIG.slack_api_token)

const readCommitHistory = () => slack.api(
    'conversations.history',
    {
        channel: 'C01HZ228YF3',
        limit: 1000,
    },
    (e, res) => {
        console.log(res.messages[0]['attachments'][0]['text']);
        // console.log(res[0]['bot_profile']);
    }
)

module.exports.readCommitHistory = readCommitHistory;


// schedule.scheduleJob('9 5 * * *', function () {
//     console.log('출근!');
// });
// schedule.scheduleJob('10 * * * * *', function () {
//     console.log('퇴근!');
// });
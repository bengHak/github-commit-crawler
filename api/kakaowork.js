const { getCommitters } = require('./db');
const CONFIG = require('../config/config');
const axios = require('axios');

// const sendCheeringDM = () => {};

const getKoreaDateString = (date) => {
  return date
    .toLocaleString('ko-KR')
    .split('.')
    .map((e) => e.trim())
    .slice(0, 3)
    .join('-');
};

const sendMyBalance = () => {};

const sendAllPass = async () => {
  sendMessage({
    title: '🎉 ALL PASS',
    blocks: [
      {
        type: 'header',
        text: '🎉 ALL COMMIT❗️ 🎉',
        style: 'yellow',
      },
      {
        type: 'text',
        text: '⭐️ 모두들 고생했어요 ⭐️',
        markdown: true,
      },
    ],
  });
};

const sendYesterdayResult = async () => {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  const dateString = getKoreaDateString(d);
  let res = await getCommitters(dateString);
  let totalNumber = res['commit'].length + res['notCommit'].length;
  let achieve = Math.floor((res['commit'].length / totalNumber) * 100);

  if (achieve === 100) {
    return sendMessage({
      title: '🎉 어제는 ALL PASS 🎉',
      blocks: [
        {
          type: 'header',
          text: '🎉 어제는 ALL PASS 🎉',
          style: 'yellow',
        },
        {
          type: 'text',
          text: `⭐️*고생했어요~*⭐️`,
          markdown: true,
        },
        {
          type: 'divider',
        },
        {
          type: 'text',
          text: `⚡️ 오늘도 ALL PASS 가즈아~`,
          markdown: true,
        },
      ],
    });
  }

  sendMessage({
    title: '📣 어제 다들 열심히 커밋했어요~',
    blocks: [
      {
        type: 'header',
        text: '🌿 어제의 정원사들',
        style: 'yellow',
      },
      {
        type: 'text',
        text: `*🧑🏻‍💻 고생했어요~*\n👉 ${res['commit']}`,
        markdown: true,
      },
      {
        type: 'text',
        text:
          res['notCommit'].length > 0
            ? `*💢 어제 뭐함,,?*\n👉 ${res['notCommit']}`
            : '',
        markdown: true,
      },
      {
        type: 'divider',
      },
      {
        type: 'text',
        text: `⭐️ *어제 참석율: ${achieve}%*\n오늘도 커밋 가즈아~⚡️`,
        markdown: true,
      },
    ],
  });
};

const sendTodayResult = async () => {
  let res = await getCommitters(getKoreaDateString(new Date()));
  let totalNumber = res['commit'].length + res['notCommit'].length;
  let achieve = Math.floor((res['commit'].length / totalNumber) * 100);
  if (achieve === 100) {
    return sendAllPass();
  }

  sendMessage({
    title: '📣 커미터들 현황 알려드려요',
    blocks: [
      {
        type: 'header',
        text: '🌿 남은 시간 힘내봐요!',
        style: 'blue',
      },
      {
        type: 'text',
        text: `*🔥 곧 정원사가 될 사람들*\n👉 ${res['notCommit']}`,
        markdown: true,
      },
      {
        type: 'text',
        text: `*🧑🏻‍💻 오늘의 정원사들*\n👉 ${res['commit']}`,
        markdown: true,
      },
      {
        type: 'divider',
      },
      {
        type: 'text',
        text: `⭐️ 현재 참석율: ${achieve}%`,
        markdown: true,
      },
    ],
  });
};

const sendUserListMessage = () => {
  const members = CONFIG.member_list;
  const githubUsernames = CONFIG.member_list_github;

  let text = '';
  for (let i = 0; i < members.length; i++) {
    text += `[${members[i]}](https://github.com/${githubUsernames[i]}/) `;
  }

  sendMessage({
    title: '❗현재 참가 인원을 알립니다❗',
    blocks: [
      { type: 'header', text: '현재 참가 인원', style: 'blue' },
      {
        type: 'text',
        text: text,
        markdown: true,
      },
    ],
  });
};

const sendMessage = ({ title, blocks }) => {
  const data = JSON.stringify({
    conversation_id: CONFIG.kakaowork_conversation_id,
    text: title,
    blocks: blocks,
  });

  const config = {
    method: 'post',
    url: 'https://api.kakaowork.com/v1/messages.send',
    headers: {
      Authorization: 'Bearer ' + CONFIG.kakaowork_api,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

sendUserListMessage();

module.exports = {
  sendAllPass,
  sendTodayResult,
  sendYesterdayResult,
};

const { Pool } = require('pg');
const { member_list_github, member_list } = require('../config/config');
const { getKoreaDateString } = require('../lib/libs');
const CONFIG = require('../config/config');

const pool = new Pool({
  user: CONFIG.db_user,
  host: CONFIG.db_host,
  database: CONFIG.db_name,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
});

const getCommits = async () => {
  let query = await pool.query('SELECT * FROM COMMIT_LOG');
  return query['rows'];
};

const getLastSavedCommitTime = async () => {
  let query = await pool.query(
    'SELECT * FROM COMMIT_LOG ORDER BY CREATED_ON DESC LIMIT 1'
  );
  if (query['rows'].length === 0) return new Date('1996-03-18');
  return query['rows'][0]['created_on'];
};

const getCommitters = async (dateString) => {
  let query = await pool.query(
    `SELECT * FROM COMMIT_LOG WHERE created_on between '${dateString}' and '${dateString} 23:59:59'`
  );

  let commit = [];
  let notCommit = CONFIG.member_list;
  const username_list = CONFIG.member_list_github;
  let listWithGithub = [];

  username_list.map((e, id) => {
    listWithGithub.push({
      name: notCommit[id],
      username: e,
      isCommit: false,
    });
  });

  query['rows'].map((e) => {
    const idx = username_list.indexOf(e['github_username']);
    if (commit.includes(notCommit[idx])) return;
    commit.push(notCommit[idx]);

    listWithGithub = listWithGithub.map((element) => {
      if (element.username === e['github_username']) {
        return {
          ...element,
          isCommit: true,
        };
      }
      return element;
    });
  });

  notCommit = notCommit.filter((e) => !commit.includes(e));

  console.log({
    commit,
    notCommit,
  });

  return {
    commit,
    notCommit,
    listWithGithub,
  };
};

const getAllCommits = async (startDate, endDate) => {
  let query = await pool.query(
    `SELECT * FROM COMMIT_LOG WHERE created_on between '${startDate}' and '${endDate} 23:59:59'`
  );

  let attendances = {};
  let start = new Date(startDate);
  let end = new Date(endDate);
  const diff = (end - start) / (3600 * 1000 * 24);

  let date = {};

  for (let i = 0; i <= diff; i++) {
    const dateString = getKoreaDateString(new Date(start));
    date[dateString] = false;
    start.setDate(start.getDate() + 1);
  }

  member_list_github.map((e, idx) => {
    attendances[e] = {
      github_username: e,
      username: member_list[idx],
      commits: { ...date },
    };
  });

  console.log(query.rows);
  query['rows'].map((e) => {
    const created_on = getKoreaDateString(e['created_on']);
    attendances[e['github_username']]['commits'][created_on] = true;
  });

  return attendances;
};

const saveCommit = async ({ username, commitLink, timestamp }) => {
  pool.query(
    'INSERT INTO COMMIT_LOG (github_username, commit_link, created_on) VALUES ($1, $2, $3)',
    [username, commitLink, timestamp],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log(results);
    }
  );
};

module.exports = {
  getCommits,
  getLastSavedCommitTime,
  getCommitters,
  getAllCommits,
  saveCommit,
};

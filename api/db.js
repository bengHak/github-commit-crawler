const { Pool } = require('pg');
const { member_list_github } = require('../config/config');
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

const getYesterdayCommitter = async () => {
  let query = await pool.query(
    'SELECT * FROM COMMIT_LOG WHERE DATE(created_on) = current_date-1'
  );

  let commit = [];
  let notCommit = CONFIG.member_list;
  const username_list = CONFIG.member_list_github;

  query['rows'].map((e) => {
    const idx = username_list.indexOf(e['github_username']);
    if (commit.includes(notCommit[idx])) return;
    commit.push(notCommit[idx]);
  });

  notCommit = notCommit.filter((e) => !commit.includes(e));

  return {
    commit,
    notCommit,
  };
};

const getTodayCommitter = async () => {
  let query = await pool.query(
    'SELECT * FROM COMMIT_LOG WHERE DATE(created_on) = current_date'
  );

  let commit = [];
  let notCommit = CONFIG.member_list;
  const username_list = CONFIG.member_list_github;

  query['rows'].map((e) => {
    const idx = username_list.indexOf(e['github_username']);
    if (commit.includes(notCommit[idx])) return;
    commit.push(notCommit[idx]);
  });

  notCommit = notCommit.filter((e) => !commit.includes(e));

  return {
    commit,
    notCommit,
  };
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
  getYesterdayCommitter,
  getTodayCommitter,
  saveCommit,
};

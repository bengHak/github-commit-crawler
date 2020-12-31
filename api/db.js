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
    listWithGithub.map((e) => {
      if (e.username === e['github_username']) {
        return {
          ...e,
          isCommit: true,
        };
      }
      return e;
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
  saveCommit,
};

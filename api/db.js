const { Client } = require('pg');

const client = new Client({
    user: 'DB 사용자 명',
    host: 'DB 주소',
    database: 'DB명',
    password: '비밀번호',
    port: 5432,
});
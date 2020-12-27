const { readCommitHistory } = require('./api/slack');
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('App listening on port 3000');
})

readCommitHistory();
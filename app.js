const express = require('express');
const v1 = require('./routes/v1');

const app = express();

app.use('/v1', v1);

app.use('/', function (req, res) {
  res.statusCode = 200; //send the appropriate status code
  res.json({ status: 'success', message: 'Slack, Kakaowork bot', data: {} });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});

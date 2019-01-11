const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/authenticate');

mongoose.connect(process.env.PICKY_DB_URL || 'mongodb://localhost/test', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => console.log(err));

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: [process.env.COOKIE_SESSION_KEYS]
}));

app.get('/', (req, res) => {
  res.send('Welcome to picky!');
});

app.use((req, res, next) => {
  if (req.app.get('env') === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  }
  next();
});

// Sets up authorization routes
auth(app);
require('./routes/friends')(app);
app.use('/users', users);
require('./routes/game-sessions')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  if (req.method === 'OPTIONS') { // FIXME: checks options to allow CORS policy requests.
    err.status = 200;
  }
  err.status = err.status ? err.status : 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error
  res.status(err.status || 500);
  res.send(JSON.stringify({ message: err.message }));
  res.end();
});

module.exports = app;

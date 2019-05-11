const express = require('express');
const path = require('path');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/authenticate');
const { errWrap } = require('./config/basic');
// const cors = require('cors');

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
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT
app.set('trust proxy');
app.use(cookieSession({
  name: 'user',
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: [process.env.COOKIE_SESSION_KEYS],
  httpOnly: false,
  secure: false,
  secureProxy: false
}));

app.get('/', (req, res) => {
  res.send('Welcome to picky! v0.0.2');
});

app.use((req, res, next) => {
  /* req.app.get('env') === 'development' */
  console.log(req.headers.origin);
  if (req.app.get('env')) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'content-type'); // Add headers (sent from CORS request) here
    // TODO: switch to use the cors npm package
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Sets up authorization routes
auth(app);
require('./routes/friends')(app);
app.use('/users', users);
require('./routes/game-sessions')(app);
require('./routes/questions')(app);

// catch 404 and forward to error handler
app.use(errWrap((req, res, next) => {
  let err = new Error('Endpoint Not Found');
  err.status = err.status ? err.status : 404;
  throw err;
}));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error
  console.log('Error: ', err.message);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

module.exports = app;

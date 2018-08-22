var express = require('express')
const session = require('express-session') // Session persistence
const SessionStore = require('connect-redis')(session) // Session store
const rClient = require('./config/externals').redis
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var assert = require('assert')
const bcrypt = require('bcrypt')
// var _ = require('underscore')
var passport = require('passport')
var LocalStrategy = require('passport-local')
const { User } = require('./models')
var index = require('./routes/index')
var users = require('./routes/users')
var questions = require('./routes/questions')

var app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SessionStore({
    client: rClient
  })
}))

// PASSPORT

passport.serializeUser((user, done) => {
  console.log('serializing user.... ')
  done(null, { username: user.username }) // Sends the username to the passport obj inside the session store
})
passport.deserializeUser((user, done) => {
  console.log('Deserialization of: ' + user.username)
  User.findOne({ username: user.username }, (err, user) => { // Puts the user in the req.user area.
    done(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'passwordHash' // Look for the "passwordHash" coming from the client login request.
},
(username, passwordHash, done) => {
  console.log('Checking normal login....')
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err)
    assert.notStrictEqual(username, undefined, 'username undefined')
    assert.notStrictEqual(passwordHash, undefined, 'password undefined')
    if (!user) return done(null, false, { message: 'cannot find user' })
    bcrypt.compare(passwordHash, user.passwordHash, (err, result) => {
      if (err) return done(err)
      if (result === true) {
        return done(null, {
          message: 'success',
          username: user.username
        })
      }
      return done(null, false, { message: 'wrong password' })
    })
  })
}
))
app.use(passport.initialize())
app.use(passport.session())
// PASSPORT

// DEPRECATED - login sessions
// app.use(errWrap(async (req, res, next) => {
//   // NOTE: For session Authorization, need username and sessionID in QUERY! ?username=...&sessionID=...
//   var isAuthablePath = false
//   for (var i = 0; i < authablePaths.length; i++) {
//     if (req.path.toLowerCase().indexOf(authablePaths[i].toLowerCase()) > -1) {
//       isAuthablePath = true; break
//     }
//   }
//   if (isAuthablePath) {
//     await a.checkSessionID(req.query.username, req.query.sessionID)
//   }
//   next()
// }))

app.use('/', index)
app.use('/users', users)
app.use('/questions', questions)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error
  res.status(err.status || 500)
  res.end(err.toString())
})

module.exports = app

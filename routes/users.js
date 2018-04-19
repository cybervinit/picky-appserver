var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
// var mongoose = require('../config/externals.js').mongoose;
const { User } = require('../models')
const { errWrap, errHandler } = require('../config/basic.js')
const a = require('../helpers/authenticate.js')
var assert = require('assert')

/* GET users listing. */
router.get('/', errWrap(async (req, res, next) => {
  res.end('GET /users')
}))

// TODO: figure out twilio!
/**
 * @api {post} /users/registerUser Registers a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} username The username of the new user
 * @apiParam {String} phone The phone number of the new user
 * @apiParam {String} passwordHash The passwordHash of the new user
 */
router.post('/registerUser', errWrap(async (req, res, next) => {
  const { username, phone, passwordHash } = req.body
  assert.notStrictEqual(username, undefined, 'username not provided')
  assert.notStrictEqual(phone, undefined, 'phone not provided')
  const preexistent = await User.findOne({ username: username })
  assert.strictEqual(preexistent, null, 'username already exists')
  const finalPasswordHash = await bcrypt.hash(passwordHash, 4) // Salt rounds 4
  console.log(finalPasswordHash)
  await User.create({ username: username, phone: phone, passwordHash: finalPasswordHash }, errHandler)
  res.end('successful')
}))

/**
 * @api {post} /users/login Login a user
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} username The username of the login attempting user
 * @apiParam {String} passwordHash The hashed password of the user
 *
 * @apiSuccess {String} loginAttemptResult The result status of the login attempt
 * @apiSuccess {String} sessionID The sessionID to auth other user actions later
 */
router.post('/login', errWrap(async (req, res, next) => {
  const { username, passwordHash } = req.body
  const user = await User.findOne({ username: username })
  if (user) {
    const sessId = await a.setSessionID(username) // Also returns the session ID
    bcrypt.compare(passwordHash, user.passwordHash, (err, result) => {
      if (err) return res.end(JSON.stringify({ loginAttemptResult: 'fail' }))
      if (result === true) {
        return res.end(JSON.stringify({
          loginAttemptResult: 'success',
          sessionID: sessId
        }))
      }
      return res.end(JSON.stringify({
        loginAttemptResult: 'fail'
      }))
    })
  }
}))

/**
 * @api {get} /getByUsername/:username Get user information
 */
router.get('/getByUsername/:username', errWrap(async (req, res, next) => {
  var username = req.params.username
  var user = await User.findOne({ 'username': username })
  assert.notStrictEqual(user, null, 'user not found')
  var sendable = { 'user': {
    'username': user.username,
    '_id': user._id,
    'phone': user.phone,
    'followRequests': user.followRequests,
    'followers': user.followers,
    'following': user.following
  }}

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(sendable))
}))

// NOTE: reqSender is the person who wants to follow the reqReceiver
router.post('/sendFollowRequest/:reqSender/:reqReceiver', errWrap(async (req, res, next) => {
  const sender = await User.findOne({ username: req.params.reqSender })
  const receiver = await User.findOne({ username: req.params.reqReceiver })
  assert.notStrictEqual(sender, null, 'sender username is bads')
  assert.notStrictEqual(receiver, null, 'receiver username is bad')
  assert.notStrictEqual(sender, receiver, "can't send yourself a request")
  await User.update({ username: req.params.reqReceiver }, { $push: { followRequests: req.params.reqSender } })
  res.end('done.')
}))

module.exports = router

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../schemas/user');
const { errWrap, errHandler, end, reqLog, isValidUsername, isPhoneValid } = require('../config/basic.js');
const assert = require('assert');
const { MSG_SUCCESS } = require('../config/constants');
const authHelper = require('../helpers/authenticate');

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
  reqLog(req);
  const { username, phone, passwordHash } = req.body;
  assert(isValidUsername(username), 'username invalid');
  assert(isPhoneValid(phone), 'phone number invalid');
  const finalPasswordHash = await bcrypt.hash(passwordHash, 4); // Salt rounds 4
  await User.create({ username: username, phone: phone, passwordHash: finalPasswordHash }, errHandler);
  res.redirect(307, '/users/login');
}));

/**
 * @api {get} /users/isUsernameValid Checks if the username is unique and valid
 * @apiName IsUsernameUnique
 * @apiGroup User
 *
 * @apiParam {String} newUsername The username of the new user
 */
router.get('/isUsernameValid', errWrap(async (req, res, next) => {
  const { newUsername } = req.query;
  assert(isValidUsername(newUsername), 'username must be between 3-20 characters');
  const preexistent = await User.findOne({ username: newUsername });
  assert.strictEqual(preexistent, null, 'username already exists');
  res.send(MSG_SUCCESS);
  res.end();
}));

/**
 * @api {post} /users/updateUsername updates the username to a new username
 * @apiName UpdateUsername
 * @apiGroup User
 *
 * @apiParam {String} newUsername The new username
 */
router.post('/updateUsername', errWrap(async (req, res, next) => {
  // TODO: set isNewAccount to FALSE
  const { newUsername } = req.body;
  assert(isValidUsername(newUsername), 'username must be between 3-20 characters');
  const preexistent = await User.findOne({ username: newUsername });
  assert.strictEqual(preexistent, null, 'username already exists');
  const user = await User.findOneAndUpdate({
    username: req.user.username
  }, {
    $set: {
      username: newUsername,
      isNewAccount: false
    }
  }, { new: true });
  req.user.username = user.username;
  req.user.isNewAccount = false;
  res.send(MSG_SUCCESS);
  res.end();
}));

/**
 * @api {get} /getByUsername/:username Get user information
 * @apiName GetByUsername
 * @apiGroup User
 *
 * @apiParam {String} username username of the person
 *
 * @apiSuccess {String} username
 * @apiSuccess {String} _id Mongo's ObjectId
 * @apiSuccess {String} phone phone number
 * @apiSuccess {Number}
 */
router.get('/getByUsername/:username', errWrap(async (req, res, next) => {
  reqLog(req);
  const { username } = req.params;
  assert.notStrictEqual(username, undefined, 'username undefined');
  const user = await User.findOne({ 'username': username });
  if (user && user.profileVisible) {
    const sendable = { 'user': {
      'username': user.username,
      'name': user.name,
      '_id': user._id,
      'followersAmount': user.followers.length,
      'followingAmount': user.following.length
    },
    message: 'success' };
    res.end(JSON.stringify(sendable));
  }
  end(res, { message: 'user not found' });
}));

/**
 * @api {get} /users/usernameAvailable/:username Gets if the username is available
 * @apiName UsernameAvailable
 * @apiGroup User
 *
 * @apiParam {String} username
 * @apiSuccess {Boolean} isAvailable true if the username is available, else false
 */
router.get('/usernameAvailable/:username', errWrap(async (req, res, next) => {
  reqLog(req);
  const { username } = req.params;
  const user = await User.find({ username: username }).limit(1);
  const resp = { isAvailable: (user.length === 0) };
  return end(res, resp);
}));

/**
 * @api {get} /users/getPersonalInfo Gets sensitive info
 * @apiName GetPersonalInfo
 * @apiGroup User
 */
router.get('/getPersonalInfo', authHelper.isUserAuthenticated, errWrap(async (req, res, next) => {
  reqLog(req);
  const { username } = req.session.passport.user;
  assert.notStrictEqual(username, undefined, 'username undefined');
  const user = await User.findOne({ 'username': username }, { followRequests: 1 });
  assert.notStrictEqual(user, null, 'user not found');
  const sendable = { 'user': {
    'followRequestAmount': user.followRequests.length,
    'phone': user.phone
  }};
  res.end(JSON.stringify(sendable));
}));

/**
 * @api {post} /users/sendFollowRequest/:reqSender/:reqReceiver send a follow request
 * @apiName SendFollowRequest
 * @apiGroup User
 *
 * @apiParam {String} reqSender The username of the person sending the follow request
 * @apiParam {String} reqReceiver The username of the person receiving request
 */
router.post('/sendFollowRequest/:reqSender/:reqReceiver', authHelper.isUserAuthenticated, errWrap(async (req, res, next) => { // TODO: auth
  reqLog(req);
  const { reqSender, reqReceiver } = req.params;
  assert.strictEqual(reqSender, req.query.username, 'usernames don\'t match');
  const sender = await User.findOne({ username: reqSender });
  const receiver = await User.findOne({ username: reqReceiver }, { followRequests: { $elemMatch: { $in: [reqSender] } } });
  assert.notStrictEqual(sender, null, 'sender username is bads');
  assert.notStrictEqual(receiver, null, 'receiver username is bad or already received the request');
  assert.notStrictEqual(sender, receiver, "can't send yourself a request");
  assert.strictEqual(0, receiver.followRequests.length, 'already requested');
  await User.update({ username: req.params.reqReceiver }, { $push: { followRequests: req.params.reqSender } });
  end(res, MSG_SUCCESS);
}));

module.exports = router;

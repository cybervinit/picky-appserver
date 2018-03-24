var express = require('express');
var router = express.Router();
var mongoose = require('../config/database.js').mongoose;
const { User } = require('../models');
const { errWrap, errHandler } = require('../config/basic.js');
var assert = require('assert');

/* GET users listing. */
router.get('/', errWrap(async (req, res, next) => {
	const { User } = models;
	res.end("GET /users");
}));

router.post('/registerUser', errWrap(async (req, res, next) => {	
	assert.notStrictEqual(req.body.username, undefined, "username not provided");
	assert.notStrictEqual(req.body.phone, undefined, "phone not provided");
	const newUser = await User.create({ username: req.body.username, phone: req.body.phone }, errHandler);
	res.end("successful");
}));

router.get('/getByUsername/:username', errWrap(async (req, res, next) => {
	var username = req.params.username;
	var user = await User.findOne({ 'username': username });
	assert.notStrictEqual(user, null, "user not found");
	var sendable = { 'user': {
		'username': user.username,
		'_id': user._id,
		'phone': user.phone,
		'followRequests': user.followRequests,
		'followers': user.followers,
		'following': user.following
	}};

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(sendable));
}));

// NOTE: reqSender is the person who wants to follow the reqReceiver
router.get('/sendFollowRequest/:reqSender/:reqReceiver', errWrap(async (req, res, next) => {
	const sender = await User.findOne({ username: req.params.reqSender });
	const receiver = await User.findOne({ username: req.params.reqReceiver });
	assert.notStrictEqual(sender, null, "sender username is bad");
	assert.notStrictEqual(receiver, null, "receiver username is bad");
	assert.notStrictEqual(sender, receiver, "asdasd");
	await User.findOneAndUpdate({ 'username': req.params.receiver}, { $push: { followRequests: req.params.sender }});
	res.end("done.");
}));
	

module.exports = router;


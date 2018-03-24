var express = require('express');
var router = express.Router();
var mongoose = require('../config/database.js').mongoose;
var models = require('../models');
var basic = require('../config/basic.js');
var errWrap = basic.errWrap;
var assert = require('assert');

/* GET users listing. */
router.get('/', function(req, res, next) {
	const { User } = models;
	const { errHandler } = basic;
	// res.end("Reached USERS endpoint.");
	res.end("GET /users");
});

router.post('/registerUser', async (req, res, next) => {
	const { User } = models;
	const { errHandler } = basic;
	await User.create({ username: "cybervinit", phone: "4161231234" }, errHandler);
	res.end('CREATE User');
});

router.get('/getByUsername/:username', errWrap(async (req, res, next) => {
	const { User } = models;
	var username = req.params.username;
	var user = await User.findOne({ 'username': username });
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
router.post('/sendFollowRequest/:reqSender/:reqReceiver', async (req, res, next) => {
	const { User } = models;
	var sender = req.params.reqSender;
	var receiver = req.params.reqReceiver;
	assert.notStrictEqual(sender, receiver);
	await User.findOneAndUpdate({ 'username': receiver}, { $push: { followRequests: sender }});
	res.end("done.");
});
	

module.exports = router;


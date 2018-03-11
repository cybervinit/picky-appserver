var express = require('express');
var router = express.Router();
var mongoose = require('../config/database.js').mongoose;
var models = require('../models');
var basic = require('../config/basic.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	const { User } = models;
	const { errHandler } = basic;
	res.end("Creating... done. :)");
	// User.create({ username: "vinso", phone: "4161231234" }, errHandler);
});

module.exports = router;


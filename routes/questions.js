var express = require('express');
var router = express.Router();

var mongoose = require('../config/database.js').mongoose;
var models = require('../models');
var basic = require('../config/basic.js');


router.get('/', (req, res, next) => {
	const { routeCheck } = basic;
	const { QuestionBucket } = models;
	routeCheck(res, "questions");
});

module.exports = router;

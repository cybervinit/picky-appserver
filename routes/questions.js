var express = require('express');
var router = express.Router();

const { Question, QuestionOption } = require('../models');
var ObjectId = require('mongodb').ObjectID;
const { errWrap, errHandler } = require('../config/basic.js');
var basic = require('../config/basic.js');


router.get('/', (req, res, next) => {
	const { routeCheck } = basic;
	routeCheck(res, "questions");
});

/**
 * Body: question: { username: String, options: [], title: String, visibility: Number }
 */
router.post('/createQuestion', errWrap( async (req, res, next) => {
	var optList = [];
	for (opt in req.body.question.options) { 
		optList.push({ title: req.body.question.options[opt], pickers: [], index: Number(opt)});
	}
	const newQuestion = { username: req.body.username, title: req.body.question.title, options: optList, visibility: req.body.question.visibility };
	await Question.create(newQuestion);
	res.end("successful.");
}));

/**
 * Body: picker: String, optionId: String
 */
router.post('/castVote', errWrap(async (req, res, next) => {
	const asker = req.body.qAskerUsername;
	const qId = new ObjectId(req.body.qId);
	const option = req.body.optionIndex;
	// TODO: assert correct value
	// TODO: add session check 
	// TODO: cast the vote
	await QuestionOption.create({
		picker: req.body.picker,
		optionId: ObjectId(req.body.optionId)
	});
	res.end('successful.');
}));


module.exports = router;

var express = require('express')
var router = express.Router()

const { Question, QuestionOption } = require('../models')
var ObjectId = require('mongodb').ObjectID
const { errWrap } = require('../config/basic.js')
var basic = require('../config/basic.js')

/**
 * @api {get} /questions Questions endpoint
 * @apiName Questions
 * @apiGroup Question
 */
router.get('/', (req, res, next) => {
  const { routeCheck } = basic
  routeCheck(res, 'questions')
})

/**
 * @api {post} /questions/createPublicQuestion Create a new public question
 * @apiName CreatePublicQuestion
 * @apiGroup Question
 *
 * @apiParam {String} username The username of the user who is creating the question
 * @apiParam {String} options The multiple choice options for the question
 * @apiParam {String} title The question title
 * @apiParam {Number} visibility The visibility of the question (anonymous, only asked can see the votes, anyone can see the votes)
 */
router.post('/createPublicQuestion', errWrap(async (req, res, next) => {
  var optList = []
  for (let opt in req.body.question.options) {
    optList.push({ title: req.body.question.options[opt], pickers: [], index: Number(opt) })
  }
  const newQuestion = { username: req.body.username, title: req.body.question.title, options: optList, visibility: req.body.question.visibility }
  await Question.create(newQuestion)
  res.end('successful.')
}))

/**
 * @api {post} /questions/castVote A user can cast a vote on a given question
 * @apiName CastVote
 * @apiGroup Question
 *
 * @apiParam {String} picker The username of the person casting the vote
 * @apiParam {String} optionId The option chosen by the picker (Mongo's ObjectId)
 */
router.post('/castVote', errWrap(async (req, res, next) => {
/* TODO
const asker = req.body.qAskerUsername;
const qId = new ObjectId(req.body.qId);
const option = req.body.optionIndex;
*/
  // TODO: assert correct value
  // TODO: add session check
  // TODO: cast the vote
  await QuestionOption.create({
    picker: req.body.picker,
    optionId: ObjectId(req.body.optionId)
  })
  res.end('successful.')
}))

module.exports = router

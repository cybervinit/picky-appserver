const {
  errWrap,
  err
} = require('../config/basic');
const db = require('../helpers/dbHelper');
const {
  MSG_SUCCESS
} = require('../helpers/constants');

module.exports = app => {
  app.get('/questions/random', errWrap(async (req, res, next) => {
    // TODO: get a random question

  }));

  app.post('/questions', errWrap(async (req, res, next) => {
    const {
      pass,
      question
    } = req.body;
    if (pass !== 'vinso1') throw err('Unauthenticated attempt to add question', 404);
    const {
      questionText,
      questionOptions
    } = question;
    await db.addQuestion(questionText, questionOptions);
    res.send(MSG_SUCCESS);
  }));
};

const { errWrap } = require('../config/basic');
const { MSG_SUCCESS } = require('../config/constants');
const db = require('../helpers/db-helpers/quiz-db-helper');

module.exports = app => {
  app.get('/quiz', errWrap(async (req, res, next) => {
    return res.send(MSG_SUCCESS);
  }));

  app.post('/quiz', errWrap(async (req, res, next) => {
    const { name } = req.body;
    const newQuiz = await db.createQuizTemplate(name);
    return res.send({ newQuiz, ...MSG_SUCCESS });
  }));

  app.post('/quiz/add-question', errWrap(async (req, res, next) => {
    const { quizTemplateRef, question } = req.body;
    const newQuizQuestion = await db.addQuizQuestion(quizTemplateRef, question);
    return res.send({ newQuizQuestion, ...MSG_SUCCESS });
  }));
};

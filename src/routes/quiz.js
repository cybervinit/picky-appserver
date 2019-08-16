const { errWrap } = require('../config/basic');
const { MSG_SUCCESS } = require('../config/constants');
const db = require('../helpers/db-helpers/quiz-db-helper');

module.exports = app => {
  app.get('/quiz', errWrap(async (req, res, next) => {
    return res.send(MSG_SUCCESS);
  }));

  app.post('/quiz/create', errWrap(async (req, res, next) => {
    const { user, quizTemplateId } = req.body;
    if (!user || !quizTemplateId) return res.send({ message: 'proper request body required' });
    const quiz = await db.createNewQuiz(user, quizTemplateId);
    return res.send({ ...quiz, ...MSG_SUCCESS });
  }));

  app.post('/quiz/answer-matrix', errWrap(async (req, res, next) => {
    const { quizId, answerMatrix } = req.body;
    console.log(quizId);
    const quiz = await db.updateAnswerMatrix(quizId, answerMatrix);
    return res.send({ ...quiz, ...MSG_SUCCESS });
  }));

  app.get('/quiz/questions/:quizTemplateId', errWrap(async (req, res, next) => {
    const { quizTemplateId } = req.params;
    const questions = await db.getQuizQuestionsByTemplateId(quizTemplateId);
    return res.send({ questions, ...MSG_SUCCESS });
  }));

  app.post('/quiz/answer/quiz-owner', errWrap(async (req, res, next) => {
    const { quizId, answerArr } = req.body;
    const updatedQuiz = await db.updateQuizWithQuizOwnerAnswer(quizId, answerArr);
    return res.send({ ...updatedQuiz, ...MSG_SUCCESS });
  }));

  app.post('/quiz/create/quiz-attempt', errWrap(async (req, res, next) => {
    const quizAttempt = await db.createQuizAttempt();
    return res.send({ ...quizAttempt, ...MSG_SUCCESS });
  }));

  app.post('/quiz/answer/attempt', errWrap(async (req, res, next) => {
    const { quizAttemptId, answerIndex } = req.body;
    const updatedQuizAttempt = await db.updateQuizAttemptWithAnswer(quizAttemptId, answerIndex);
    return res.send({ ...updatedQuizAttempt, ...MSG_SUCCESS });
  }));

  app.post('/quiz/template', errWrap(async (req, res, next) => {
    const { name } = req.body;
    const newQuiz = await db.createQuizTemplate(name);
    return res.send({ ...newQuiz, ...MSG_SUCCESS });
  }));

  app.post('/quiz/template/add-question', errWrap(async (req, res, next) => {
    const { quizTemplateId, question } = req.body;
    const newQuizQuestion = await db.addQuizQuestionToTemplate(quizTemplateId, question);
    return res.send({ ...newQuizQuestion, ...MSG_SUCCESS });
  }));

  app.get('/quiz/templates', errWrap(async (req, res, next) => {
    const templates = await db.getAllQuizTemplates();
    return res.send({ templates, ...MSG_SUCCESS });
  }));
};

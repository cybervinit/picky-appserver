const {
  errWrap,
  getPasswordHash,
  isPasswordValid
} = require('../config/basic');
const { MSG_SUCCESS } = require('../config/constants');
const db = require('../helpers/db-helpers/quiz-db-helper');
const { authenticate } = require('../config/authenticate');

module.exports = app => {
  app.get('/quiz', errWrap(async (req, res, next) => {
    return res.send(MSG_SUCCESS);
  }));

  app.post('/quiz/create', errWrap(async (req, res, next) => {
    const { userFirstName, userPasswordHash1, quizTemplateId } = req.body;
    if (!userFirstName || !quizTemplateId || !userPasswordHash1) return res.send({ message: 'proper request body required' });
    const userPasswordHash2 = await getPasswordHash(userPasswordHash1);
    const quiz = await db.createNewQuiz(userFirstName, userPasswordHash2, quizTemplateId);
    return res.send({ ...quiz, ...MSG_SUCCESS });
  }));

  app.get('/quiz/quizzes/:quizId', errWrap(async (req, res, next) => {
    const { quizId } = req.params;
    const quiz = await db.getQuizByQuizId(quizId);
    return res.send({ ...quiz, ...MSG_SUCCESS });
  }));

  app.post('/quiz/answer-matrix', errWrap(async (req, res, next) => {
    const { quizId, answerMatrix } = req.body;
    const quiz = await db.updateAnswerMatrix(quizId, answerMatrix);
    return res.send({ ...quiz, ...MSG_SUCCESS });
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

  app.get('/quiz/templates/:quizTemplateId', errWrap(async (req, res, next) => {
    const { quizTemplateId } = req.params;
    const quizTemplate = await db.getQuizTemplateByTemplateId(quizTemplateId);
    return res.send({ ...quizTemplate, ...MSG_SUCCESS });
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
    const { quizId } = req.body;
    const quizAttempt = await db.createQuizAttempt(quizId);
    return res.send({ ...quizAttempt, ...MSG_SUCCESS });
  }));

  app.post('/quiz/attempt/update-answers', errWrap(async (req, res, next) => {
    const { quizAttemptId, answerArray, score } = req.body;

    const updatedQuizAttempt = await db.updateQuizAttemptWithAnswer(quizAttemptId, answerArray, score);
    return res.send({ ...updatedQuizAttempt, ...MSG_SUCCESS });
  }));

  app.get('/quiz/attempt/rank-by-attempt-id/:quizId/:quizAttemptId', errWrap(async (req, res, next) => {
    const { quizId, quizAttemptId } = req.params;
    const rank = await db.getRankOfAttempt(quizId, quizAttemptId);
    return res.send({ rank, ...MSG_SUCCESS });
  }));

  app.post('/quiz/attempt/message', errWrap(async (req, res, next) => {
    const { message, quizAttemptId } = req.body;
    const updatedQuizAttempt = await db.postMessageToQuizOwner(message, quizAttemptId);

    return res.send({ ...updatedQuizAttempt, ...MSG_SUCCESS });
  }));

  app.post('/quiz/authenticate', errWrap(async (req, res, next) => {
    const { userPasswordHash1, quizId } = req.body;
    const quiz = await db.getQuizByQuizId(quizId);
    const isPasswordCorrect = await isPasswordValid(userPasswordHash1, quiz.userPasswordHash2);
    if (isPasswordCorrect || req.session.quiz) {
      req.session.quiz = { userFirstName: quiz.userFirstName };
      return res.send(MSG_SUCCESS);
    } else {
      req.session.quiz = null;
      return res.send({ message: 'unable to authenticate, wrong password.' });
    }
  }));

  app.post('/quiz/logout', errWrap(async (req, res, next) => {
    req.session.quiz = null;
    return res.send(MSG_SUCCESS);
  }));

  app.get('/quiz/owner/results/:quizId', authenticate, errWrap(async (req, res, next) => {
    const { quizId } = req.params;
    const results = await db.getAggregateResults(quizId);
    return res.send({ results, ...MSG_SUCCESS });
  }));
};

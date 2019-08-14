const { getRandomString } = require('../../config/basic');
const { QuizTemplate, QuizQuestion, Quiz, QuizAttempt } = require('../../schemas');

const createQuizTemplate = async (name) => {
  const quizTemplateId = getRandomString();
  const newQuiz = await QuizTemplate.create({ name, quizTemplateId });
  return newQuiz.toObject();
};

const addQuizQuestionToTemplate = async (quizTemplateRef, question) => {
  const { questionText, options } = question;
  const newQuestion = await QuizQuestion.create({
    quizTemplateRef, questionText, options
  });
  return newQuestion.toObject();
};

const createNewQuiz = async (user, quizTemplateId) => {
  const quizId = getRandomString();
  const newQuiz = await Quiz.create({ user, quizId, quizTemplateId });
  return newQuiz.toObject();
};

const getQuizQuestionsByTemplateId = async (quizTemplateRef) => {
  const questions = await QuizQuestion.find({ quizTemplateRef }).sort({ _id: 1 });
  return questions;
};

const updateQuizWithQuizOwnerAnswer = async (quizId, answerArr) => {
  const updatedQuiz = await Quiz.findOneAndUpdate({
    quizId
  }, { $push: { orderedAnswers: answerArr } }, { new: true });
  return updatedQuiz.toObject();
};

const createQuizAttempt = async (quizId) => {
  const quizAttemptId = getRandomString();
  const newQuizAttempt = await QuizAttempt.create({
    quizAttemptId, quizId
  });
  return newQuizAttempt.toObject();
};

const updateQuizAttemptWithAnswer = async (quizAttemptId, answerIndex) => {
  const updatedQuizAttempt = await QuizAttempt.findOneAndUpdate({
    quizAttemptId
  }, { $push: { answerArray: answerIndex } }, { new: true });
  return updatedQuizAttempt.toObject();
};

module.exports = {
  createQuizTemplate,
  addQuizQuestionToTemplate,
  createNewQuiz,
  getQuizQuestionsByTemplateId,
  updateQuizWithQuizOwnerAnswer,
  createQuizAttempt,
  updateQuizAttemptWithAnswer
};

const { getRandomString } = require('../../config/basic');
const { QuizTemplate, QuizQuestion, Quiz, QuizAttempt } = require('../../schemas');

const createQuizTemplate = async (name) => {
  const quizTemplateId = getRandomString();
  const newQuiz = await QuizTemplate.create({ name, quizTemplateId, totalPoints: 0 });
  return newQuiz.toObject();
};

const addQuizQuestionToTemplate = async (quizTemplateId, question) => {
  const { questionText, options } = question;
  const newQuestion = await QuizQuestion.create({
    quizTemplateId, questionText, options
  });
  await QuizTemplate.findOneAndUpdate({ quizTemplateId }, {
    $inc: { totalPoints: options.length }
  });
  return newQuestion.toObject();
};

const createNewQuiz = async (user, quizTemplateId) => {
  const quizId = getRandomString();
  const newQuiz = await Quiz.create({ user, quizId, quizTemplateId });
  return newQuiz.toObject();
};

const getQuizQuestionsByTemplateId = async (quizTemplateId) => {
  const questions = await QuizQuestion.find({ quizTemplateId }).sort({ _id: 1 });
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

const getAllQuizTemplates = () => QuizTemplate.find();

const updateAnswerMatrix = async (quizId, answerMatrix) => {
  const updatedQuiz = await Quiz.findOneAndUpdate({ quizId }, {
    answerMatrix
  }, {
    new: true
  });
  return updatedQuiz.toObject();
};

module.exports = {
  createQuizTemplate,
  addQuizQuestionToTemplate,
  createNewQuiz,
  getQuizQuestionsByTemplateId,
  updateQuizWithQuizOwnerAnswer,
  createQuizAttempt,
  updateQuizAttemptWithAnswer,
  getAllQuizTemplates,
  updateAnswerMatrix
};

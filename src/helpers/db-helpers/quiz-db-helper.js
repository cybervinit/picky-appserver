const { getRandomString } = require('../../config/basic');
const { QuizTemplate, QuizQuestion } = require('../../schemas');

const createQuizTemplate = async (name) => {
  const quizTemplateId = getRandomString();
  const newQuiz = await QuizTemplate.create({ name, quizTemplateId });
  return newQuiz.toObject();
};

const addQuizQuestion = async (quizTemplateRef, question) => {
  const { questionText, options } = question;
  const newQuestion = await QuizQuestion.create({
    quizTemplateRef, questionText, options
  });
  return newQuestion.toObject();
};

module.exports = {
  createQuizTemplate,
  addQuizQuestion
};

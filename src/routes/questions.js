const dbHelper = require('../helpers/dbHelper');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.get('/questions', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const userInfo = await dbHelper.getUser(id);
    const questions = await dbHelper.getQuestions();
    const formattedQuestions = [];

    userInfo.friends.forEach((friend) => {
      questions.forEach((element) => {
        formattedQuestions.push({
          ...element,
          aboutUser: friend.friendUsername,
          aboutUserId: friend.friendId
        });
      });
    });

    res.send({questions: formattedQuestions, message: 'Generated Questions'});
  });

  app.put('/questionAnswered', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const {questionId} = req.body;
    const questionAnsweredResult = await dbHelper.addQuestionAnswered(id, questionId);
    res.status(200).send(questionAnsweredResult);
  });
};

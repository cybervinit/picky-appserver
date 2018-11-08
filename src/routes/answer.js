const dbHelper = require('../helpers/dbHelper');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.get('/answer', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const randomAnswer = await dbHelper.getAnswer(id);
    res.status(200).send(randomAnswer);
  });

  app.post('/answer', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const {questionId, option, friendId} = req.body;
    const answerResult = await dbHelper.answerQuestion(id, questionId, option, friendId);
    res.status(200).send(answerResult);
  });

  app.get('/answers', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const unseenAnswers = await dbHelper.getAnswers(id);
    res.status(200).send(unseenAnswers);
  });
};

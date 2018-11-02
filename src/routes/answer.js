const dbHelper = require('../helpers/dbHelper');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.post('/answer', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const {questionId, option, friendId} = req.body;
    const answerResult = await dbHelper.answerQuestion(id, questionId, option, friendId);
    res.status(200).send(answerResult);
  });

  app.put('/moveAnswerToSeen', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    // possibly better way to track with unique id
    const {index} = req.body;
    const moveAnswerToSeenResult = await dbHelper.moveAnswerToSeen(id, index);
    res.status(200).send(moveAnswerToSeenResult);
  });

  app.get('/answers', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const unseenAnswers = await dbHelper.getAnswers(id);
    res.status(200).send(unseenAnswers);
  });
};

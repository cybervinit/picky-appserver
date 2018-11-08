const dbHelper = require('../helpers/dbHelper');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.post('/question', authHelper.isUserAuthorized, async (req, res) => {
    const {question} = req.body;
    console.log(req.body);
    await dbHelper.addQuestion(question);
    res.send({message: 'Added question'});
  });
  app.get('/question', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const userInfo = await dbHelper.getUser(id);
    const questions = await dbHelper.getQuestions();
    const maxIteration = questions.length;
    let count = 0;
    let foundQuestion = false;

    while (!foundQuestion && count < maxIteration) {
      const randomFriendIndex = Math.floor(Math.random() * userInfo.friends.length);
      const friendUsername = userInfo.friends[randomFriendIndex].friendUsername;
      const friendInfo = await dbHelper.getUserWithUsername(friendUsername);

      const randomQuestionIndex = Math.floor(Math.random() * questions.length);
      const question = questions[randomQuestionIndex];

      const isQuestionAnswered =
        !(userInfo.questionsAnswered.find((element) =>
          element.question === question.question && element.username === friendInfo.username));
      foundQuestion = isQuestionAnswered;
      ++count;

      if (foundQuestion) {
        res.send({
          _id: question._id,
          question: question.question,
          options: question.options,
          user: friendInfo.username
        });
      }
    }

    if (!foundQuestion) {
      res.send({message: 'Could not provide a question.'});
    }
  });

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

};

const { GameSession, User, Question } = require('../schemas');

const addUser = async (userInfo) => {
  await User.count({...userInfo}, (err, count) => {
    if (err || count === 0) {
      const newUser = new User({
        ...userInfo,
        friends: []
      });
      newUser.save((err) => {
        if (err) console.log(err);
      });
    }
  });
  return User.findOne({...userInfo});
};

const getUser = async (userId) => {
  const user = await User.findOne({_id: userId});
  return {
    firstName: user.firstName,
    lastName: user.lastName
  };
};

const getUserWithUsername = async (username) => {
  const user = await User.findONe({username});
  return user;
};

const getFriends = async (userId) => {
  const user = await User.findOne({_id: userId});
  return user.friends;
};

const getFriendsWithPage = async (userId, page) => {
  const perPage = 9;
  const friends = await User
    .findOne({_id: userId})
    .select('friends')
    .skip((perPage * page) - perPage)
    .limit(perPage);
  return friends;
};

const addFriend = async (userId, friendId) => {
  const user = await User.findOne({_id: userId});
  if (!user.friends.find(element => element === friendId)) {
    User.update({_id: userId}, {friends: [...user.friends, {friendId}]}, (err, raw) => {
      if (err) console.log(err);
    });
  }
};

const deleteFriend = async (userId, friendId) => {
  const user = await User.findOne({_id: userId});
  if (user.friends.find(element => element.friendId === friendId)) {
    User.update({_id: userId}, {friends: user.friends.filter((element) => element.friendId !== friendId)}, (err, raw) => {
      if (err) console.log(err);
    });
  }
};

const getGameSession = async (gameSessionName) => {
  const session = await GameSession.findOne({ name: gameSessionName })
    .populate('questions.question');
  return session;
};

const addGameSession = async (gameSessionName) => {
  const dup = await getGameSession(gameSessionName);
  if (dup) {
    return dup;
  }
  const gameSession = await GameSession.create({
    name: gameSessionName,
    isGameSessionFree: true,
    questions: []
  });
  return gameSession;
};

const addUserToGameSession = async (username, gameSessionName) => {
  const gameSession = await GameSession.findOneAndUpdate({
    name: gameSessionName
  }, {
    $push: { users: username }
  }, {
    new: true
  });
  return gameSession;
};

const lockGameSessionAndStartCountdown = async (gameSessionName) => {
  const gameSession = await GameSession.findOneAndUpdate({
    name: gameSessionName
  }, {
    isGameSessionFree: false,
    startCountdownTime: (new Date()).getTime()
  }, {
    new: true
  });
  return gameSession;
};

const addQuestion = async (question, dateAdded) => {
  const {
    questionText,
    options
  } = question;
  const q = await Question.create({
    questionText,
    options,
    dateAdded
  });
  return q;
};

const getQuestionCount = async () => {
  const qCount = await Question.count();
  return qCount;
};

const getRandomQuestion = async () => {
  const qCount = await getQuestionCount();
  const randomIndex = Math.floor(Math.random() * qCount);
  const question = await Question.findOne().skip(randomIndex);
  return question;
};

const getQuestionsFrom = async (dateAdded) => {
  const questions = await Question.find({ dateAdded });
  return questions;
};

const addQuestionToGameSession = async (answerer, question, gsName) => {
  const gs = await GameSession.findOneAndUpdate({ name: gsName },
    {
      $push: {
        questions: {
          answerer: answerer,
          question: question._id,
          answer: 0
        }
      }
    },
    {
      new: true
    }
  ).populate('questions.question');
  return gs;
};

const answerQuestion = async (answerer, gsName, answerIndex) => {
  const gs = await GameSession.findOneAndUpdate(
    { name: gsName, 'questions.answerer': answerer },
    {
      $set: { 'questions.$.answer': answerIndex,
        'questions.$.isAnswered': true
      }
    }
  );
  return gs;
};

const removeMyPreviousQuestion = async (username, gsName) => {
  await GameSession.update({ name: gsName },
    { $pull:
      {
        questions: {
          answerer: { $ne: username },
          isAnswered: true
        }
      }
    }
  );
};

const removeSeenQuestions = async (gameSessionName) => {
  await GameSession.update({ name: gameSessionName },
    { $pull:
      {
        questions: {
          isSeen: true
        }
      }
    }
  );
};

const setAnswerSeen = async (gameSessionId, qId) => {
  await GameSession.findOneAndUpdate(
    { _id: gameSessionId, 'questions._id': qId },
    {
      $set: { 'questions.$.isSeen': true }
    }
  );
};

module.exports = {
  addUser,
  addFriend,
  deleteFriend,
  getFriends,
  getFriendsWithPage,
  getUser,
  getUserWithUsername,
  getGameSession,
  addGameSession,
  addUserToGameSession,
  lockGameSessionAndStartCountdown,
  addQuestion,
  getRandomQuestion,
  addQuestionToGameSession,
  answerQuestion,
  removeMyPreviousQuestion,
  removeSeenQuestions,
  setAnswerSeen,
  getQuestionsFrom
};

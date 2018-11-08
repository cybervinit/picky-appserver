const User = require('../schemas/user');
const Question = require('../schemas/question');
const constants = require('../helpers/constants');

const addUser = async (userInfo) => {
  await User.count({...userInfo}, (err, count) => {
    if (count === 0) {
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
  return user;
};

const getUserWithUsername = async (username) => {
  const user = await User.findOne({username});
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

const getQuestions = async () => {
  const questions = await Question.find({});
  return questions;
};

const getQuestion = async (questionId) => {
  const question = await Question.findOne({_id: questionId});
  return question;
};

const answerQuestion = async (userId, questionId, option, friendId) => {
  const question = await getQuestion(questionId);
  const user = await getUser(userId);
  const friend = await getUser(friendId);
  if (user.questionsAnswered.find((element) => element._id.toString() === questionId.toString())) {
    return {message: 'Question has already been answered'};
  }
  user.questionsAnswered.push(questionId);
  user.questionCount++;
  friend.unseenAnswers.push({question: question.question, option: question.options[option]});
  user.save();
  friend.save();
  return {
    questionCount: user.questionCount,
    answerStatus: user.questionCount % constants.QUESTIONS_BEFORE_ANSWER === 0
  };
};

const getAnswers = async (userId) => {
  const user = await getUser(userId);
  return user.unseenAnswers;
};

const getAnswer = async (userId) => {
  const user = await getUser(userId);
  if (user.unseenAnswers.length === 0) {
    return {message: 'No unseen answers available'};
  }
  const unseenAnswerIndex = Math.floor(Math.random() * user.unseenAnswers.length);
  user.seenAnswers.push(user.unseenAnswers[unseenAnswerIndex]);
  user.unseenAnswers.splice(unseenAnswerIndex, 1);
  user.save();
  return user.unseenAnswers[unseenAnswerIndex];
};

const moveAnswerToSeen = async (userId, index) => {
  const user = await getUser(userId);
  const seenAnswer = user.unseenAnswers[index];
  user.seenAnswers.push(seenAnswer);
  user.unseenAnswers.splice(index, 1);
  return {message: 'Moved answer to seen answer.'};
};

const addQuestionAnswered = async (userId, questionId) => {
  const user = await getUser(userId);
  user.questionsAnswered.push(questionId);
  user.save();
  return {message: 'Added to question answered list'};
};

const addQuestion = async (questionObj) => {
  const question = new Question(questionObj);
  await question.save();
};

module.exports = {
  addUser,
  addFriend,
  deleteFriend,
  getFriends,
  getFriendsWithPage,
  getUser,
  getUserWithUsername,
  getQuestions,
  getQuestion,
  addQuestion,
  answerQuestion,
  getAnswers,
  getAnswer,
  moveAnswerToSeen,
  addQuestionAnswered
};

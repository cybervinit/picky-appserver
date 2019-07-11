const { Room, QuestionRoom } = require('../../schemas');
const { getRandomQuestion } = require('../dbHelper');
const R = require('ramda');

const createRoom = async (urlId, users) => {
  const room = await Room.create({
    urlId,
    users
  });
  return room;
};

const getRoomByUrlId = async (urlId) => {
  const room = await Room.findOne({ urlId });
  return room;
};

const addQuestionToRoom = async (urlId) => {
  const users = (await getRoomByUrlId(urlId)).users;
  const question = await getRandomQuestion();
  const qr = {
    questionRef: question._id,
    urlId,
    users: users.map(u => {
      return { username: u, isSeen: false, answerIndex: -1 };
    })
  };
  const questionRoom = await QuestionRoom.create(qr);
  return questionRoom;
};

const getUnansweredQuestion = async (urlId, username) => {
  const q = await R.pipeP(
    (urlId) => QuestionRoom.findOne({ urlId,
      users: {
        $elemMatch: {
          username, answerIndex: { $eq: -1 }
        }}}).populate('questionRef'),
    async (q) => {
      if (!q) {
        await addQuestionToRoom(urlId);
        return QuestionRoom.findOne({ urlId,
          users: {
            $elemMatch: {
              username, answerIndex: { $eq: -1 }
            }}}).populate('questionRef');
      }
      return q;
    }
  )(urlId);
  return q;
};

const getUnseenCount = async (urlId, username) => {
  const count = await QuestionRoom.count({
    urlId,
    users: { $all: [{
      $elemMatch: {
        username: { $ne: username },
        answerIndex: { $ne: -1 }}
    },
    {
      $elemMatch: { username, isSeen: false }
    }]}
  });
  return count;
};

const answerQuestion = async (qid, user, answerIndex) => {
  const questionRoom = await QuestionRoom.findOneAndUpdate({
    _id: qid, 'users.username': user
  }, {
    $set: { 'users.$.answerIndex': answerIndex }
  });
  return questionRoom;
};

const getUnseenAnsweredQuestion = async (urlId, username) => {
  const quesRoom = await QuestionRoom.findOne({
    urlId,
    users: { $all: [
      {
        $elemMatch: { username, isSeen: false }
      },
      {
        $elemMatch: {
          username: { $ne: username }, answerIndex: { $ne: -1 }
        }
      }
    ]}
  }).populate('questionRef');
  console.log(quesRoom);
  return quesRoom;
};

const setAnswerSeen = async (_id, username) => {
  const quesRoom = await QuestionRoom.findOneAndUpdate({
    _id,
    'users.username': username
  },
  {
    'users.$.isSeen': true
  });
  return quesRoom;
};

module.exports = {
  createRoom,
  getRoomByUrlId,
  addQuestionToRoom,
  getUnansweredQuestion,
  getUnseenCount,
  answerQuestion,
  getUnseenAnsweredQuestion,
  setAnswerSeen
};

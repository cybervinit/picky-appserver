const { Room, QuestionRoom } = require('../../schemas');
const { getRandomQuestion } = require("../dbHelper");
const R = require('ramda');


const createRoom = async (urlId, usernames) => {
  const users = usernames.map(username => {
    return { username, tipsSeen: [false, false, false]}
  });
  const room = await Room.create({
    urlId,
    users
  });
  return room;
};

const getRoomByUrlId = async (urlId) => {
  const room = (await Room.findOne({ urlId })).toObject();
  const unseenCounts = await Promise.all(room.users.map(user => getUnseenCount(urlId, user.username)));
  const updatedUsers = room.users.map((user, i) => {
    return {
      ...user,
      unseenCount: unseenCounts[i]
    }
  });
  return { ...room, users: updatedUsers };
};

const addQuestionToRoom = async (urlId) => {
  const users = (await getRoomByUrlId(urlId)).users;
  const question = await getRandomQuestion();
  const qr = {
    questionRef: question._id,
    urlId,
    users: users.map(u => {
      return { username: u.username, isSeen: false, answerIndex: -1 }
    })
  };
  const questionRoom = await QuestionRoom.create(qr);
  return questionRoom;
};

const getUnansweredQuestion = async (urlId, username) => {
  const q = await R.pipeP(
    (urlId) => QuestionRoom.findOne({ urlId, users: {
      $elemMatch: { username, answerIndex: { $eq: -1 }}
    }}).populate('questionRef'),
    async (q) => {
      if (!q) {
        const q2 = await addQuestionToRoom(urlId);
        return QuestionRoom.findOne({ urlId, users: {
          $elemMatch: { username, answerIndex: { $eq: -1 }}
        }}).populate('questionRef');
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
    { $elemMatch: { username, isSeen: false }}
  ]}
  });
  return count;
};

const answerQuestion = async (qid, user, answerIndex) => {
  const questionRoom = await QuestionRoom.findOneAndUpdate({
    _id: qid, "users.username": user
  }, {
    $set: { "users.$.answerIndex": answerIndex }
  });
  return questionRoom;
};

const getUnseenAnsweredQuestion = async (urlId, username) => {
  const quesRoom = await QuestionRoom.findOne({
    urlId, users: { $all: [
      { $elemMatch: { username, isSeen: false }},
      { $elemMatch: { username: { $ne: username }, answerIndex: { $ne: -1 }}}
    ]}
  }).populate("questionRef");
  console.log(quesRoom);
  return quesRoom;
}

const setAnswerSeen = async (_id, username) => {
  const quesRoom = await QuestionRoom.findOneAndUpdate({
    _id,
    "users.username": username
  },
  {
    "users.$.isSeen": true
  });
}

const setTipSeen = async (urlId, username, tipIndex) => {
  const room = await Room.findOneAndUpdate({
    urlId, "users.username": username
  }, {
    ["users.$.tipsSeen."+tipIndex]: true
  }, {
    new: true
  })
  return room;
};

module.exports = {
  createRoom,
  getRoomByUrlId,
  addQuestionToRoom,
  getUnansweredQuestion,
  getUnseenCount,
  answerQuestion,
  getUnseenAnsweredQuestion,
  setAnswerSeen,
  setTipSeen
};

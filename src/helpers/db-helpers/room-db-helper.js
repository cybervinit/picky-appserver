const { Room, QuestionRoom } = require('../../schemas');
const { getQuestionsFrom } = require('../dbHelper');
const R = require('ramda');

const createRoom = async (urlId, usernames) => {
  const users = usernames.map(username => {
    return {
      username, tipsSeen: [false, false, false]
    };
  });
  const room = await Room.create({
    urlId,
    users
  });
  return room;
};

const getRoomByUrlId = async (urlId, currentDate) => {
  const room = (await Room.findOne({ urlId })).toObject();
  const unseenCounts = await Promise.all(room.users.map(user => getUnseenCount(urlId, user.username)));
  const unansweredQuestionAmount = await Promise.all(room.users.map(user => getUnansweredQuestionAmount(urlId, user.username, currentDate)));
  const updatedUsers = room.users.map((user, i) => {
    return {
      ...user,
      unseenCount: unseenCounts[i],
      unansweredQuestionAmount: unansweredQuestionAmount[i]
    };
  });
  console.log(unansweredQuestionAmount);
  return { ...room, users: updatedUsers };
};

const udpateRoomDate = async (urlId, currentDate) => {
  const updatedRoom = await Room.updateOne({ urlId }, { $set: { currentDate } });
  return updatedRoom;
}

const addQuestionsToRoom = async (urlId, dateAdded) => {
  const users = (await getRoomByUrlId(urlId)).users;
  // const question = await getRandomQuestion(); // TODO: delete
  const todaysQuestionRooms = await R.pipeP(
    getQuestionsFrom,
    R.map(q => {
      return {
        questionRef: q._id,
        urlId,
        users: users.map(u => {
          return { username: u.username, isSeen: false, answerIndex: -1 };
        }),
        dateAdded
      };
    })
  )(dateAdded);
  const questionRooms = await QuestionRoom.insertMany(todaysQuestionRooms);
  
  /** DEPRECATED */
  // const qr = {
  //   questionRef: question._id,
  //   urlId,
  //   users: users.map(u => {
  //     return { username: u.username, isSeen: false, answerIndex: -1 };
  //   })
  // };
  // const questionRoom = await QuestionRoom.create(qr);
  /** ^^ */
  return questionRooms;
};

const getUnansweredQuestionAmount = async (urlId, username, dateAdded) => {
  const unansweredQuestionAmount = await QuestionRoom.count({
    urlId,
    dateAdded,
    users: {
      $elemMatch: {
        username, answerIndex: { $eq: -1 }
      }
    }
  });
  return unansweredQuestionAmount;
}

const getUnansweredQuestion = async (urlId, username, dateAdded) => {
  // TODO: cleanup function
  console.log("Findind Unanswered question at ", {
    urlId, username, dateAdded
  });
  const q = await R.pipeP(
    (urlId) => QuestionRoom.findOne({ urlId, dateAdded,
      users: {
        $elemMatch: {
          username, answerIndex: { $eq: -1 }
        }}}).populate('questionRef'),
    async (q) => {
      if (!q) {
        console.log("SHOULDN'T RUN...");
        // await addQuestionsToRoom(urlId, dateAdded);
        return QuestionRoom.findOne({ urlId, dateAdded,
          users: {
            $elemMatch: {
              username, answerIndex: { $eq: -1 }
            }}}).populate('questionRef');
      }
      console.log("Nominal run...");
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

const setTipSeen = async (urlId, username, tipIndex) => {
  const room = await Room.findOneAndUpdate({
    urlId, 'users.username': username
  }, {
    ['users.$.tipsSeen.' + tipIndex]: true
  }, {
    new: true
  });
  return room;
};

module.exports = {
  createRoom,
  getRoomByUrlId,
  udpateRoomDate,
  addQuestionsToRoom,
  getUnansweredQuestionAmount,
  getUnansweredQuestion,
  getUnseenCount,
  answerQuestion,
  getUnseenAnsweredQuestion,
  setAnswerSeen,
  setTipSeen
};

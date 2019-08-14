const { errWrap } = require('../config/basic');
const db = require('../helpers/db-helpers/room-db-helper');
const {
  MSG_SUCCESS
} = require('../config/constants');
const {
  updateRandomQuestionsDate,
  getQuestionAmountAtDate
} = require('../helpers/dbHelper');

module.exports = app => {
  app.get('/', errWrap(async (req, res, next) => {
    res.send(MSG_SUCCESS);
  }));

  app.post('/rooms/create', errWrap(async (req, res, next) => {
    // TODO: create a room
    const {
      urlId,
      users
    } = req.body;
    const newRoom = await db.createRoom(urlId, users);
    res.send({
      ...newRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  app.get('/rooms/:urlId/:currentDate', errWrap(async (req, res, next) => {
    const { urlId, currentDate } = req.params;
    const room = await db.getRoomByUrlId(urlId, currentDate);
    res.send({
      ...room,
      ...MSG_SUCCESS
    });
  }));

  app.get('/rooms/:urlId/:user/unseencount', errWrap(async (req, res, next) => {
    const {
      urlId,
      user
    } = req.params;
    const unseenCount = await db.getUnseenCount(urlId, user);
    res.send({
      unseenCount,
      ...MSG_SUCCESS
    });
  }));

  /**
   * TODO: remove because probably unused
   */
  app.post('/rooms/:urlId/add-question', errWrap(async (req, res, next) => {
    const { urlId } = req.params;
    const quesRoom = await db.addQuestionToRoom(urlId);
    res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  /**
   * Updates the room currentDate and adds QuestionRooms of dateAdded to room
   */
  app.post('/rooms/:urlId/:dateAdded/update-date', errWrap(async (req, res, next) => {
    const { urlId, dateAdded } = req.params;
    const { currentDate } = await db.getRoomByUrlId(urlId, dateAdded);
    if (!currentDate || currentDate !== dateAdded) {
      await db.udpateRoomDate(urlId, dateAdded);
      await db.addQuestionsToRoom(urlId, dateAdded);
    }
    res.send(MSG_SUCCESS);
  }));

  app.post('/rooms/add-questions-at-date', errWrap(async (req, res, next) => {
    const { todaysDate } = req.body;
    if (!todaysDate) { return res.send({ message: 'must include todaysDate in request body' }); }
    const qAmount = await getQuestionAmountAtDate(todaysDate);
    if (qAmount >= 10) {
      return res.send({ message: 'Already have ' + 10 + ' questions loaded for ' + todaysDate });
    }
    const questions = await updateRandomQuestionsDate(10 - qAmount, todaysDate);
    return res.send({ questions, ...MSG_SUCCESS });
  }));

  app.get('/rooms/:urlId/:user/:dateAdded/question', errWrap(async (req, res, next) => {
    const { urlId, user, dateAdded } = req.params;
    const unansweredQuestionAmount = await db.getUnansweredQuestionAmount(urlId, user, dateAdded);
    if (!unansweredQuestionAmount) {
      return res.send({ message: 'all questions for ' + dateAdded + ' answered.' });
    }
    const quesRoom = await db.getUnansweredQuestion(urlId, user, dateAdded);
    res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  app.get('/rooms/:urlId/:user/:dateAdded/questions/unanswered-amount', errWrap(async (req, res, next) => {
    const { urlId, user, dateAdded } = req.params;
    const unansweredQuestionAmount = await db.getUnansweredQuestionAmount(urlId, user, dateAdded);
    res.send({ unansweredQuestionAmount, ...MSG_SUCCESS });
  }));

  app.post('/rooms/question/:qid', errWrap(async (req, res, next) => {
    const { qid } = req.params;
    const { username, answerIndex } = req.body;
    const quesRoom = await db.answerQuestion(qid, username, answerIndex);
    res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  app.get('/rooms/:urlId/:user/answer', errWrap(async (req, res, next) => {
    const { urlId, user } = req.params;
    const quesRoom = await db.getUnseenAnsweredQuestion(urlId, user);
    await db.setAnswerSeen(quesRoom._id, user);
    return res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  app.post('/rooms/:urlId/:username/tip-seen', errWrap(async (req, res, next) => {
    const { urlId, username } = req.params;
    const { tipIndex } = req.body;
    const room = await db.setTipSeen(urlId, username, tipIndex);
    return res.send({
      ...room.toObject(),
      ...MSG_SUCCESS
    });
  }));
};

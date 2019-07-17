const { errWrap } = require('../config/basic');
const db = require('../helpers/db-helpers/room-db-helper');
const {
  MSG_SUCCESS
} = require('../config/constants');

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

  app.get('/rooms/:urlId', errWrap(async (req, res, next) => {
    const { urlId } = req.params;
    const room = await db.getRoomByUrlId(urlId);
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

  app.post('/rooms/:urlId/add-question', errWrap(async (req, res, next) => {
    const { urlId } = req.params;
    const quesRoom = await db.addQuestionToRoom(urlId);
    res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
  }));

  app.get('/rooms/:urlId/:user/question', errWrap(async (req, res, next) => {
    const { urlId, user } = req.params;
    const quesRoom = await db.getUnansweredQuestion(urlId, user);
    res.send({
      ...quesRoom.toObject(),
      ...MSG_SUCCESS
    });
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

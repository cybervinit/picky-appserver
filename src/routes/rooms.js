const {
  errWrap,
  err
} = require('../config/basic');
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
};

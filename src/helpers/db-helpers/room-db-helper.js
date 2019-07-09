const { Room } = require('../../schemas');


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

module.exports = {
  createRoom,
  getRoomByUrlId
};

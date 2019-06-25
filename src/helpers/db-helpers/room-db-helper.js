const { Room } = require('../../schemas');


const createRoom = async (urlId, users) => {
  const room = await Room.create({
    urlId,
    users
  });
  return room;
};

module.exports = {
  createRoom
};


const addUserToGameSession = (username, cookie) => { cookie.game_session.users.push(username); };
const updateGameSession = (gs, cookie) => {
  cookie.game_session = cookie.game_session ? cookie.game_session : {};
  cookie.game_session = Object.assign({}, gs._doc);
};
const setCurrUser = (username, cookie) => {
  cookie.user = {};
  cookie.user.username = username;
};

const getGameSessionName = (cookie) => cookie.game_session.name;

module.exports = {
  setCurrUser,
  addUserToGameSession,
  updateGameSession,
  getGameSessionName
};

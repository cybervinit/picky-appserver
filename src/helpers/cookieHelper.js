
const addUserToGameSession = (username, cookie) => { cookie.game_session.all_users.push(username); };
const updateGameSession = (gs, cookie) => {
  cookie.game_session = cookie.game_session ? cookie.game_session : {};
  cookie.game_session.all_users = gs.users;
  cookie.game_session.name = gs.name;
  cookie.game_session.isGameSessionFree = gs.isGameSessionFree;
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

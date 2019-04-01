
const addUserToGameSession = (username, cookie) => { cookie.game_session.all_users.push(username); };
const initGameSession = (gs, cookie) => {
  cookie.game_session = {};
  cookie.game_session.all_users = gs.users;
  cookie.game_session.name = gs.name;
  cookie.game_session.isGameSessionFree = gs.isGameSessionFree;
};
const setCurrUser = (username, cookie) => {
  cookie.user = {};
  cookie.user.username = username;
};

module.exports = {
  setCurrUser,
  addUserToGameSession,
  initGameSession
};

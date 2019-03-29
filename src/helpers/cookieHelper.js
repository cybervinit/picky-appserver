
const addUserToGameSession = (username, cookie) => { cookie.game_session.all_users.push(username); };
const initGameSession = (gs, cookie) => {
  cookie.game_session = {};
  cookie.game_session.all_users = gs.users;
  cookie.game_session.name = gs.name;
  cookie.game_session.isGameSessionFree = gs.isGameSessionFree;
};
const updateCurrUserUsername = (username, cookie) => { cookie.user.username = username; };

module.exports = {
  updateCurrUserUsername,
  addUserToGameSession,
  initGameSession
};

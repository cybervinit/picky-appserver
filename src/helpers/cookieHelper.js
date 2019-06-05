
const addUserToGameSession = (username, cookie) => { cookie.game_session.users.push(username); };
const updateGameSession = (gs, cookie) => {
  cookie.game_session = cookie.game_session ? cookie.game_session : {};
  cookie.game_session = Object.assign({}, gs.toObject());
};
const setCurrUser = (username, cookie) => {
  cookie.user = {};
  cookie.user.username = username;
};

const getGameSessionName = (cookie) => cookie.game_session.name;

/** @unused */
const getAnswerIndex = (cookie) => cookie.game_session.questions.filter(
  (el) => el.answerer === getCurrUser(cookie).username
)[0].answer;

const getCurrUser = (cookie) => cookie.user;

const getBuddyUsername = (cookie) => cookie.game_session.users.filter(
  (u) => u !== getCurrUser(cookie).username
)[0];

module.exports = {
  setCurrUser,
  addUserToGameSession,
  updateGameSession,
  getGameSessionName,
  getCurrUser,
  getAnswerIndex,
  getBuddyUsername
};

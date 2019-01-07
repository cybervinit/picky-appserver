const { errWrap } = require('../config/basic');
const {
  getGameSession,
  addGameSession,
  addUserToGameSession
} = require('../helpers/dbHelper');

module.exports = app => {
  app.get('/game-sessions/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const gameSession = await getGameSession(gameSessionName);
    res.send({
      isGameSessionFree: !gameSession,
      gameSession: gameSession ? {
        name: gameSession.name
      } : null
    });
    res.end();
  }));

  app.post('/game-sessions/:gameSessionName/add-user', errWrap(async (req, res, next) => {
    const { username } = req.body;
    const { gameSessionName } = req.params;
    const gameSession = await addUserToGameSession(gameSessionName, username);
    res.send({
      gameSession: {
        name: gameSession.name,
        users: gameSession.users
      }
    });
    res.end();
  }));

  app.post('/game-sessions/make/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const existingGameSession = await getGameSession(gameSessionName);
    if (existingGameSession) {
      res.send({ isGameSessionFree: !!existingGameSession });
      return res.end();
    }
    const gameSession = await addGameSession();
    res.send({
      isGameSessionFree: !!gameSession,
      gameSession: {
        name: gameSession.name
      }});
    res.end();
  }));
};

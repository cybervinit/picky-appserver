const { errWrap } = require('../config/basic');
const { getGameSession, addGameSession } = require('../helpers/dbHelper');

module.exports = app => {
  app.get('/game-sessions/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const gameSession = await getGameSession(gameSessionName);
    console.log('Game Session: ', gameSession);
    res.send({
      isGameSessionFree: !gameSession,
      gameSession: gameSession ? {
        name: gameSession.name
      } : null
    });
    res.end();
  }));

  app.post('/game-sessions/make/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params.gameSessionName;
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

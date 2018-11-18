const { errWrap } = require('../config/basic');
const { getGameSession } = require('../helpers/dbHelper');

module.exports = app => {
  app.get('/game-sessions/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const gameSession = await getGameSession(gameSessionName);
    console.log('Game Session: ', gameSession);
    res.send({
      gameSessionExists: !!gameSession,
      gameSession: {
        name: gameSession.name
      }
    });
    res.end();
  }));
};

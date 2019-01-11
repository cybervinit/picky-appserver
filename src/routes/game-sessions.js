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
      payload: {
        isGameSessionFree: gameSession ? gameSession.isGameSessionFree : true,
        name: gameSessionName,
        users: gameSession ? gameSession.name : null
      },
      message: 'success'
    });
    res.end();
  }));

  app.post('/game-sessions/:gameSessionName/add-user', errWrap(async (req, res, next) => {
    const { username } = req.body;
    const { gameSessionName } = req.params;
    const gameSession = await addUserToGameSession(gameSessionName, username);
    res.send({
      payload: {
        isGameSessionFree: gameSession.isGameSessionFree,
        name: gameSession.name,
        users: gameSession.users
      },
      message: 'success'
    });
    res.end();
  }));

  app.post('/game-sessions/make/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const existingGameSession = await getGameSession(gameSessionName);
    if (existingGameSession) {
      res.send({
        payload: {
          isGameSessionFree: !!existingGameSession,
          gameSession: {
            name: existingGameSession.name
          }},
        message: 'success'
      });
      res.end();
      return;
    }
    const gameSession = await addGameSession(gameSessionName);
    res.send({
      payload: {
        isGameSessionFree: !!gameSession,
        gameSession: {
          name: gameSession.name
        }},
      message: 'success'
    });
    res.end();
  }));
};

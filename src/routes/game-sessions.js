const R = require('ramda');
const {
  errWrap,
  err
} = require('../config/basic');
const {
  getGameSession,
  addGameSession,
  addUserToGameSession,
  lockGameSession
} = require('../helpers/dbHelper');
const c = require('../helpers/cookieHelper');

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
  }));

  app.post('/game-sessions/:gameSessionName/add-user', errWrap(async (req, res, next) => {
    const { username } = req.body;
    const { gameSessionName } = req.params;
    await R.pipeP(
      getGameSession,
      (gs) => {
        if (gs.isGameSessionFree) {
          c.setCurrUser(username, req.session);
          c.addUserToGameSession(username, req.session);
          return addUserToGameSession(username, gs.name);
        }
        return gs;
      },
      (gs) => (gs.users.length >= 2 && gs.isGameSessionFree) // lock if game session full
        ? lockGameSession(gs.name) : gs
    )(gameSessionName);
    res.send({ message: 'success' });
  }));

  app.post('/game-sessions/make/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    const existingGameSession = await R.pipeP(getGameSession)(gameSessionName);
    if (existingGameSession) {
      c.initGameSession(existingGameSession, req.session);
      if (!existingGameSession.isGameSessionFree) throw err('game session busy', 200);
      res.send({ message: 'success' });
      return;
    }
    const gameSession = await addGameSession(gameSessionName);
    c.initGameSession(gameSession, req.session);
    res.send({
      payload: {
        isGameSessionFree: !!gameSession,
        gameSession: {
          name: gameSession.name
        }},
      message: 'success'
    });
  }));
};

const R = require('ramda');
const assert = require('assert');
const {
  MSG_SUCCESS
} = require('../config/constants');
const {
  errWrap,
  err
} = require('../config/basic');
const {
  getGameSession,
  addGameSession,
  addUserToGameSession,
  lockGameSessionAndStartCountdown
} = require('../helpers/dbHelper');
const c = require('../helpers/cookieHelper');

module.exports = app => {
  app.get('/game-sessions/:gameSessionName', errWrap(async (req, res, next) => { // TODO: change to only use cookie game session and not by path params
    const gameSession = await getGameSession(c.getGameSessionName(req.session));
    assert.ok(gameSession, "GameSession doesn't exist");
    c.updateGameSession(gameSession, req.session);
    res.send(req.session);
  }));

  app.post('/game-sessions/:gameSessionName/add-user', errWrap(async (req, res, next) => {
    const { username } = req.body;
    const { gameSessionName } = req.params;
    await R.pipeP(
      getGameSession,
      (gs) => {
        if (gs.isGameSessionFree) {
          c.setCurrUser(username, req.session);
          return addUserToGameSession(username, gs.name);
        }
        return gs;
      },
      (gs) => (gs.users.length >= 2 && gs.isGameSessionFree) // lock if game session full
        ? lockGameSessionAndStartCountdown(gs.name) : gs,
      (gs) => c.updateGameSession(gs, req.session)
    )(gameSessionName);
    res.send(req.session);
  }));

  app.post('/game-sessions/make/:gameSessionName', errWrap(async (req, res, next) => {
    const { gameSessionName } = req.params;
    res.setHeader('Set-Cookie', 'VINIT IT CAME');
    const existingGameSession = await R.pipeP(getGameSession)(gameSessionName);
    if (existingGameSession) {
      c.updateGameSession(existingGameSession, req.session);
      if (!existingGameSession.isGameSessionFree) throw err('game session busy', 200);
      res.send(req.session);
      return;
    }
    const gameSession = await addGameSession(gameSessionName);
    c.updateGameSession(gameSession, req.session);
    res.send(req.session);
  }));

  /** @temporary */
  app.get('/random', errWrap(async (req, res, next) => {
    res.send(MSG_SUCCESS);
  }));

  /** @temporary */
  app.get('/buddy_answer', errWrap(async (req, res, next) => {
    res.send({ buddyAnswer: 'YOU ROCK BRO', ...MSG_SUCCESS });
  }));

  /** @temporary */
  app.get('/gimme_question', errWrap(async (req, res, next) => {
    res.send({ question: 'WHAT IS HIS FAVOURITE BAND?' });
  }));

  /** @temporary */
  app.post('/random', errWrap(async (req, res, next) => {
    res.send(MSG_SUCCESS);
  }));
};

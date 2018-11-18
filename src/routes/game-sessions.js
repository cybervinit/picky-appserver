const express = require('express');
const router = express.Router();
const { errWrap } = require('../config/basic');
const { getGameSession } = require('../models');



router.get('/:sessionName', errWrap(async (req, res, next) => {
  const { sessionName } = req.params;
  const gameSession = await getGameSession(sessionName);
  console.log("Game Session: ", gameSession);
  res.send({
    gameSessionExists: gameSession ? true : false,
    gameSession: {
      name: gameSession.name
    }
  });
  res.end();
}));
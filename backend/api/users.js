const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require('./utils');

usersRouter.get('/me', requireUser, async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error)
    }
  })


  module.exports = usersRouter;
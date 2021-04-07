const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser, requireAdmin } = require('./utils');
const { createUser,
  getUserByUsername, 
getUser }  = require('../db');

// Send back the logged-in user's data if a valid token is supplied in the header.

usersRouter.get('/me', requireUser, async (req, res, next) => {
  const user = await getUser()
    try {
      res.send(req.user);
    } catch (error) {
      next(error)
    }
  })

  usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both, otherwise it won't work
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }
  try {
    const user = await getUser({username, password});
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({ user, message: "you're logged in!", token });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  });



  usersRouter.post('/register', async (req, res, next) => {
    try {
      const {firstName, lastName, email, username, password } = req.body;
      const queriedUser = await getUserByUsername(username);
      if (queriedUser) {
        res.status(401);
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      } else if (password.length < 8) {
        res.status(401);
        next({
          name: 'PasswordLengthError',
          message: 'Password Too Short. At least 8 characters long.'
        });
      } else {
        const user = await createUser({
          firstName,
          lastName, 
          email, 
          username,
          password
        });
        if (!user) {
          next({
            name: 'UserCreationError',
            message: 'There was a problem registering you. Please try again.',
          });
// should we check for previously used email? Not needed. Users Table only accepts unique emails.  

        } else {
          const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
          res.send({ user, message: "you're signed up!", token });
        }
      }
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = usersRouter;
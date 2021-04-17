const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { requireUser } = require("./utils");

const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getOrderById,
  getCartByUser,
  getOrdersByUser,
  updateUser
} = require("../db");

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both, otherwise it won't work
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });
    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({ user, message: "you're logged in!", token });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      res.status(401);
      throw Error(`A user by that username already exists.`);
    } else if (password.length < 8) {
      res.status(401);
      throw Error(`Password must be at least 8 characters long.`);
    } else {
      const user = await createUser({
        firstName,
        lastName,
        email,
        username,
        password,
      });
      if (!user) {
        next({
          name: "UserCreationError",
          message: "There was a problem registering you. Please try again.",
        });
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          JWT_SECRET,
          { expiresIn: "1w" }
        );
        res.send({
          message: "You've succesfully registered!",
          user: user,
          token: token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

// Send back the logged-in user's data if a valid token is supplied in the header.

usersRouter.get("/me", requireUser, async (req, res, next) => {

  const { id } = req.user;
  console.log('user backend Id', id)
  try {
    const user = await getUserById(id);
    const cart = await getCartByUser(id);
    const orders = await getOrdersByUser(id);

    if (!cart){
      user.cart = [];
    } else {
      user.cart = cart;
    }
      if(!orders) {
        user.orders = [];
    } else {
      user.orders = orders;
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId/orders", requireUser, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId)
    console.log('user backend', user )
    if (user){
      let orders = await getOrdersByUser(userId);
      if (!orders) {
        orders = []
      }
      res.send(orders);
    }


  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;

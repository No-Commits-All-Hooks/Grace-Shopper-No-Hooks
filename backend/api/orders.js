const express = require("express");
const ordersRouter = express.Router();
const { getAllOrders, getCartByUser, createOrder, getOrdersByUser } = require("../db");
const { requireUser } = require('./utils');

-
  //Return a list of orders, include the products with them

  //admin only - create middlewear. need auth. token specific for admins
  ordersRouter.get("/", async (req, res, next) => {
    try {
      const orders = await getAllOrders();
      res.send(orders);
    } catch (error) {
      next(error);
    }
  }
  )


//Return the current user's order with status='created' (synonymous to a 'cart'). Use database adapter getCartByUser

ordersRouter.get("/cart", requireUser, async (req, res, next) => {
    const { id : userId } = req.user;

  try {
      const cart= await getCartByUser(userId);
      res.send(cart)
  } catch (error) {
    next(error);
  }
});


//Create a new order. Should initially be status = created.
ordersRouter.post("/", async (req, res, next) => {

    // checking if theres a user logged in, if so set userId

  const { id: userId } = req.user ? req.user.id : null;
  const { status } = req.body;

  try {
    const order = await createOrder({ status, userId });

    if (order) {
      res.send(order);
    } else {
      next({
        name: "failedToCreate",
        message: "Error placing new order",
      });
    }
  } catch (error) {
    next(error);
  }
});

    // Get a list of orders for a particular user.

ordersRouter.get ("/users/:userId/orders", requireUser, async (req, res, next) =>{

    const { id } = req.user;
    const { userId } = req.params;
try{
    const usersOrders = await getOrdersByUser(userId)
    if (usersOrders) {
        res.send(usersOrders);
      } else {
        next({
          name: "FailedToGet",
          message: "No orders available for this user",
        });
      }
    } catch (error) {
      next(error);
    }
})


module.exports = ordersRouter;

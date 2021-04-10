const express = require("express");
const ordersRouter = express.Router();
const {
  getAllOrders,
  getCartByUser,
  createOrder,
  getOrdersByUser,
} = require("../db");
const { requireUser, requireAdmin } = require("./utils");

-(
  //Return a list of orders, include the products with them
  //admin only - create middlewear. need auth. token specific for admins
  ordersRouter.get("/",requireAdmin, async (req, res, next) => {
    try {
      const orders = await getAllOrders();
      res.send(orders);
    } catch (error) {
      next(error);
    }
  })
);

//Return the current user's order with status='created' (synonymous to a 'cart'). Use database adapter getCartByUser

ordersRouter.get("/cart", requireUser, async (req, res, next) => {
  const { id: userId } = req.user;

  console.logz("REQ.USER:", req.user);

  try {
    const cart = await getCartByUser(userId);
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

//Create a new order. Should initially be status = created.
ordersRouter.post("/", requireUser, async (req, res, next) => {

  const { id: userId } = req.user;
  const { status } = req.body;

  if (!userId || !status) {
    throw Error(`Missing information.`);
  }

  try {
    const order = await createOrder({ status, userId });

    if (!order) {
        next({
            name: "failedToCreate",
            message: "Error placing new order",
          });
    } else {
        res.send(order);
    }
  } catch (error) {
    next(error);
  }
});

// Get a list of orders for a particular user.

ordersRouter.get("/users/:userId/orders", requireUser, async (req, res, next) => {
    const { userId } = req.params;
    console.log('userID', userId)
    try {
      const usersOrders = await getOrdersByUser(userId);

            if (!usersOrders){
                throw Error('There are no orders for this user')
            }
            res.send(usersOrders);
        
    } catch (error) {
      next(error);
    }
  }
);

module.exports = ordersRouter;

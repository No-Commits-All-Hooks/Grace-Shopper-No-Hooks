const express = require("express");
const ordersRouter = express.Router();
const {
  getAllOrders,
  getCartByUser,
  createOrder,
  getOrdersByUser,
  updateOrder,
  cancelOrder,
  getOrderById,
} = require("../db");
const { requireUser, requireAdmin } = require("./utils");

-(
  //Return a list of orders, include the products with them
  //admin only - create middlewear. need auth. token specific for admins
  ordersRouter.get("/", requireAdmin, async (req, res, next) => {
    try {
      const orders = await getAllOrders();
      res.send(orders);
    } catch ({ name, message }) {
        next({ name, message });
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
  } catch ({ name, message }) {
    next({ name, message });
  }
  
});

//Create a new order. Should initially be status = created.
ordersRouter.post("/", requireUser, async (req, res, next) => {
  const { id: userId } = req.user;
  const { status } = req.body;

  if (!userId || !status) {
    throw Error(`Missing information`);
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Get a list of orders for a particular user.

ordersRouter.get("/users/:userId/orders",requireUser,async (req, res, next) => {
    const { userId } = req.params;

    try {
      const usersOrders = await getOrdersByUser(userId);

      if (!usersOrders) {
        next ({
        name: "FailedOrders",
        message: "No orders available for this user",
      });
      }
      res.send(usersOrders);
    } catch ({ name, message }) {
        next({ name, message });
      }
  }
);

//Update an order, notably change status

ordersRouter.patch("/:orderId", requireUser, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const findOrder = await getOrderById(orderId);
    if (!findOrder) {
      next({
        name: "OrderNotFound",
        message: `No order exists with id ${orderId}`,
      });
    } else {
      const { status, userId } = req.body;
      const updatedOrder = await updateOrder({ id: orderId, status, userId });

      if (updatedOrder) {
        res.send(updatedOrder);
      } else {
        next({
          name: "FailedToUpdate",
          message: "There was an error updating your order",
        });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Update the order's status to cancelled

ordersRouter.delete("/:orderId", requireUser, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const findOrder = await getOrderById(orderId);

    if (!findOrder) {
      next({
        name: "OrderNotFound",
        message: `No order exists with id ${orderId}`,
      });
    } else {
      if (req.user.id !== findOrder.userId) {
        next({
          name: "WrongUserError",
          message: "You must be the owner of this order to cancel",
        });
      }
      const cancelledOrder = await cancelOrder(orderId);
      res.send({ success: true, ...cancelledOrder });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = ordersRouter;

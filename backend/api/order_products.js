const express = require("express");
const orderProductsRouter = express.Router();

const {
  getOrderProductById,
  addProductToOrder,
  updateOrderProduct,
  destroyOrderProduct,
  getOrderById,
} = require("../db");

const { requireUser } = require("./utils");

// Add a single product to an order (using order_products). Prevent duplication on ("orderId", "productId") pair. If product already exists on order, increment quantity and update price.

orderProductsRouter.post("/:orderId/products",requireUser,async (req, res, next) => {
    const { orderId } = req.params;
    const { productId, price, quantity } = req.body;
    try {
      const addedOrderProduct = await addProductToOrder({
        orderId,
        productId,
        price,
        quantity,
      });
      if (addedOrderProduct) {
        res.send(addedOrderProduct);
      } else {
        next({
          name: "FailedToAdd",
          message: "There was an error adding product to order",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

//  Update the quantity or price on the order product

orderProductsRouter.patch("/:orderProductId",requireUser,async (req, res, next) => {
    const { orderProductId } = req.params;
    const { price, quantity } = req.body;

    try {
      const orderProduct = await getOrderProductById(orderProductId);
      if (!orderProduct) {
        next({
          name: "NotFound",
          message: `No order_product found with ID of ${orderProductId}`,
        });
      }
      const order = await getOrderById(orderProduct.orderId);
      if (order.userId !== req.user.id) {
        next({
          name: "Unauthorized",
          message: "You cannot edit this order!",
        });
      }
      const updatedOrderProduct = await updateOrderProduct({
        id,
        price,
        quantity,
      });
      res.send(updatedOrderProduct);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

//  Remove a product from a order, use hard delete
orderProductsRouter.delete("/:orderProductId", async (req, res, next) => {
  const { orderProductId } = req.params;

  try {
    const orderProduct = await getOrderProductById(orderProductId);
    if (!orderProduct) {
      next({
        name: "NotFound",
        message: `No order_product found with ID of ${orderProductId}`,
      });
    }
    const order = await getOrderById(orderProduct.orderId);
    if (order.userId !== req.user.id) {
      next({
        name: "Unauthorized",
        message: "You cannot edit this order!",
      });
    }
    const deletedOrderProduct = await destroyOrderProduct(orderProductId);
    res.send({ success: true, ...deletedOrderProduct });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = orderProductsRouter;

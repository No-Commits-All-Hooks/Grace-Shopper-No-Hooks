const express = require("express");
const orderProductsRouter = express.Router();

const {
  getOrderProductById,
  updateOrderProduct,
  destroyOrderProduct,
  getOrderById,
} = require("../db");

const { requireUser } = require("./utils");

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
orderProductsRouter.delete("/:orderProductId", requireUser,async (req, res, next) => {
  const { orderProductId } = req.params;

  try {
    const data = await destroyOrderProduct(orderProductId);
    res.send({ success: true, data });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = orderProductsRouter;

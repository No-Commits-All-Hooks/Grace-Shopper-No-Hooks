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
    let { orderProductId } = req.params;
    const { price, quantity } = req.body;
    orderProductId = parseInt(orderProductId)

console.log('requ parms product id ', req.params)
    try {
      const orderProduct = await getOrderProductById(orderProductId);

      console.log('orderProduct', orderProduct)
      // if (!orderProduct) {
      //   next({
      //     name: "NotFound",
      //     message: `No order_product found with ID of ${orderProductId}`,
      //   });
      // }
      const updatedOrderProduct = await updateOrderProduct({
        orderProductId,
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
    res.send(data);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = orderProductsRouter;

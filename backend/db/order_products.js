const client = require("./client.js");
const { getOrderById } = require("./orders.js");


// return the order_products

async function getOrderProductById(id) {
  try {
    const {rows: [orderProduct]} = await client.query(
      `
            SELECT *
            FROM order_products
            WHERE id=$1;
        `,
      [id]
    );

    return orderProduct;
  } catch (error) {
    throw error;
  }
}


//if the productId is NOT on the order yet, create a new order_products. update the order_products quantity (add passed-in quantity to the current order_products quantity). update the order_products price return the order_products

async function addProductToOrder({ orderId, productId, price, quantity }) {
  try {
    const orders= await getOrderProductByOrder(orderId);
    const findOrderProduct = orders.find((order) => order.productId === productId)
    // console.log('ORDER_PRODUCT CHECKING FOR ORDER',findOrderProduct )

    if(!findOrderProduct) {
        const {rows: [orderProduct]} = await client.query(`
            INSERT INTO order_products("orderId", "productId", price, quantity)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [orderId, productId, price, quantity]);

        return orderProduct; 
    } else {

        const {rows: [orderProduct]} = await client.query(`
            UPDATE order_products
            SET price= $3, quantity = quantity + $4
            WHERE "orderId"=$1 AND "productId"= $2
            RETURNING *;
        `, [orderId, productId, price, quantity]);

        return orderProduct;
    }
  } catch (error) {
    throw error;
  }
}

async function updateOrderProduct({ id, price, quantity }) {
  const fields = {};

  if (price) {
    fields.price = price;
  }
  if (quantity) {
    fields.quantity = quantity;
  }

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  
    if (setString.length === 0) {
    return;
  }
  try {
    const {rows: [orderProduct]} = await client.query(`
            UPDATE order_products
            SET ${setString}
            WHERE id= ${id}
            RETURNING *;
        `,Object.values(fields));

    return orderProduct;
  } catch (error) {
    throw error;
  }
}

async function destroyOrderProduct(id) {
  try {
    const {
      rows: [deletedOrderProduct],
    } = await client.query(`
            DELETE FROM order_products
            WHERE id=$1
            RETURNING *;
        `,[id]);

    return deletedOrderProduct;
  } catch (error) {
    throw error;
  }
}

async function getOrderProductByOrder(orderId) {
  if (!orderId) {
    throw Error(`No order with id of ${orderId}`);
  };
  
  try {
      const {rows: orderProduct} = await client.query(`
          SELECT *
          FROM order_products
          WHERE "orderId"=$1;
      `, [orderId]);

      if (!orderProduct) {
        throw Error(`No are no products with this order`);
      };

      return orderProduct;
  } catch (error) {
    throw error;
  };
};

module.exports = {
  getOrderProductById,
  addProductToOrder,
  updateOrderProduct,
  destroyOrderProduct,
  getOrderProductByOrder
};

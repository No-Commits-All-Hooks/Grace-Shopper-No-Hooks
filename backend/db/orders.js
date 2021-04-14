const client = require("./client.js");
const { attachProductsToOrders } = require("./products.js");

async function getOrderById(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            SELECT *
            FROM orders
            WHERE id=$1;
        `,
      [id]
    );

    return order;
  } catch (error) {
    throw error;
  }
}

// select and return an array of orders, include their products
async function getAllOrders() {
  try {
    const { rows: orders } = await client.query(`
        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" ;
        `);

    return attachProductsToOrders(orders);
  } catch (error) {
    throw error;
  }
}

// select and return an array of orders made by user, include their products

async function getOrdersByUser({ id }) {
  try {
    const { rows: orders } = await client.query(
      `

        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" 
        WHERE "userId"=$1;
        `,
      [id]
    );

    return attachProductsToOrders(orders);
  } catch (error) {
    throw error;
  }
}

// select and return an array of orders which have a specific productId in their order_products join, include their products

async function getOrdersByProduct({ id }) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT orders.*, users.username AS "creatorName"
        FROM orders 
        JOIN users ON users.id = orders."userId" 
        JOIN order_products ON order_products."orderId" = orders.id
        WHERE order_products."productId" = $1;
        `,
      [id]
    );

    return attachProductsToOrders(orders);
  } catch (error) {
    throw error;
  }
}

async function getCartByUser({ id }) {
  try {
    const {
      rows: [orders],
    } = await client.query(
      `
        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" 
        WHERE "userId"= $1;
        `,
      [id]
    );

    const { rows: products } = await client.query(`
        SELECT *
        FROM products
        JOIN order_products ON order_products."productId" = products.id;
        `);

    const productsToAdd = products.filter(
      (product) => product.orderId === orders.id
    );
    orders.products = productsToAdd;

    return orders;
  } catch (error) {
    throw error;
  }
}

async function createOrder({ status, userId }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            INSERT INTO orders(status, "userId")
            VALUES($1, $2)
            RETURNING *;
        `,
      [status, userId]
    );
    return order;
  } catch (error) {
    throw error;
  }
}

// Find the order with id equal to the passed in id. Don't update the order id, but do update the status and/or userId, as necessary. Return the updated order
async function updateOrder({ id, status, userId }) {
  const order = getOrderById(id);

  try {
    if (!order) {
      throw Error("No order with this id");
    }
    const {
      rows: [updatedOrder],
    } = await client.query(
      `
        UPDATE orders
        SET status = $2, "userId"= $3
        WHERE id = $1 
        RETURNING *;
        `,
      [id, status, userId]
    );

    return updatedOrder;
  } catch (error) {
    throw error;
  }
}

//Find the order with id equal to the passed in id. Only update the status to completed. Return the updated order
async function completeOrder({ id }) {
  const order = getOrderById(id);
  try {
    if (!order) {
      throw Error("No order with this id");
    }

    const {
      rows: [completedOrder],
    } = await client.query(
      `
            UPDATE orders
            SET status = 'completed'
            WHERE id = $1
            RETURNING *;
            `,
      [id]
    );

    return completedOrder;
  } catch (error) {
    throw error;
  }
}

// Update the order's status to cancelled
async function cancelOrder(id) {
  const order = getOrderById(id);

  try {
    if (!order) {
      throw Error("No order with this id");
    }
    const {
      rows: [cancelledOrder],
    } = await client.query(
      `
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = $1
        RETURNING *;
        `,
      [id]
    );

    return cancelledOrder;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getOrderById,
  getAllOrders,
  getOrdersByUser,
  getOrdersByProduct,
  getCartByUser,
  createOrder,
  updateOrder,
  completeOrder,
  cancelOrder,
};

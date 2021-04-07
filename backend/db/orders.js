const client = require('./client.js');

async function getOrderById(id) {
    try {
        const {rows: [order]} = await client.query(`
            SELECT *
            FROM orders
            WHERE id=$1;
        `, [id]);

        return order;
    } catch(error) {
        throw error;
    }
}


// select and return an array of orders, include their products
async function getAllOrders() {
    try {
        const {rows: orders} = await client.query(`
            SELECT *
            FROM orders;
        `);

        console.log(orders);
        return orders;
    } catch(error) {
        throw error;
    }
}

// select and return an array of orders made by user, include their products

async function getOrdersByUser({ id }) {
    try {
        const {rows: orders} = await client.query(`

            SELECT *
            FROM orders
            WHERE "userId"=${id};
        `)

        console.log(orders);
        return orders;
    } catch(error) {
        throw error;
    }
}

async function getOrdersByProduct({ id }) {
    try {
        const {rows: orders} = await client.query(`
            SELECT orders.id, orders.status, orders."userId", orders."datePlaced", order_products."productId"
            FROM orders
            LEFT JOIN orders ON order_products."productId" = orders.$1;
        `, [id])

        return orders;
    } catch(error) {
        throw error;
    }
}

async function getCartByUser(user) {
    try {
        const {rows: [cart]} = await client.query(`
            SELECT *
            FROM orders
            WHERE id=$1, status = 'created';
        `,[user.id])

        return cart;
    } catch(error) {
        throw error;
    }
}

async function createOrder({ status, userId }) {
    try {
        const {rows: [order]} = await client.query(`
            INSERT INTO orders(status, "userId")
            VALUES($1, $2)
            RETURNING *;
        `, [status, userId])

        return order;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getOrderById,
    getAllOrders,
    getOrdersByUser,
    getOrdersByProduct,
    getCartByUser,
    createOrder
}
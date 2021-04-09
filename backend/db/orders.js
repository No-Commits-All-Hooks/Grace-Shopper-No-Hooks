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
        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" ;
        `);
        //include products
        const { rows: products } = await client.query(`
        SELECT *
        FROM products
        JOIN order_products ON order_products."productId" = products.id
        `);
        for (const order of orders) {
            const productsToAdd = products.filter(
              (product) => product.orderId === orders.id
            );
            order.products = productsToAdd;
          }
        return orders;
        
    } catch(error) {
        throw error;
    }
}


// select and return an array of orders made by user, include their products

async function getOrdersByUser({ id }) {
    try {
        const {rows: orders} = await client.query(`

        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" 
        WHERE "userId"=$1;
        `, [id])
        const { rows: products } = await client.query(`
        SELECT *
        FROM products
        JOIN order_products ON order_products."productId" = products.id
        `);
        for (const order of orders) {
            const productsToAdd = products.filter(
              (product) => product.orderId === orders.id
            );
            order.products = productsToAdd;
          }
        return orders;
    } catch(error) {
        throw error;
    }
}

// select and return an array of orders which have a specific productId in their order_products join, include their products

async function getOrdersByProduct({ id }) {
    try {
        const {rows: orders} = await client.query(`
        SELECT orders.*
        FROM orders 
        JOIN order_products ON order_products."orderId" = orders.id
        WHERE "orderId"= $1 and status= 'created'
        `,[id])
        const { rows: products } = await client.query(`
        SELECT *
        FROM products
        JOIN order_products ON order_products."productId" = products.id
        `);

        for (const order of orders) {
            const productsToAdd = products.filter(
              (product) => product.orderId === orders.id
            );
            order.products = productsToAdd;
          }
        return orders;
    } catch(error) {
        throw error;
    }
}

async function getCartByUser({id}) {
    try {
        const {rows: [orders]} = await client.query(`
        SELECT orders.*, username AS "creatorName"
        FROM orders
        JOIN users ON users.id = orders."userId" 
        WHERE "userId"= $1
        `,[id])
        
        const { rows: products } = await client.query(`
        SELECT *
        FROM products
        JOIN order_products ON order_products."productId" = products.id
        `);
      
            const productsToAdd = products.filter(
              (product) => product.orderId === orders.id
            );
            orders.products = productsToAdd;
           


        return orders;
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
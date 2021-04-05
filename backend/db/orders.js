const client = require('./client.js');

async function getOrderById(id) {
    try {
        const {rows: [order]} = await client.query(`
            SELECT *
            FROM orders
            WHERE id=$1;
        `, [id]);

        console.log(order);
        return order;
    } catch(error) {
        throw error;
    }
}

async function getAllOrders() {
    try {
        const {rows: orders} = await client.query(`
            SELECT *
            FROM orders
        `);

        return orders;
    } catch(error) {
        throw error;
    }
}

async function getOrdersByUser() {
    
}

module.exports = {
    getOrderById,
    getAllOrders
}
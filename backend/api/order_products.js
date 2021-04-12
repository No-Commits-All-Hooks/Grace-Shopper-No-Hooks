const express = require('express');
const orderProductsRouter = express.Router();

const {
    getOrderProductById,
    addProductToOrder,
    updateOrderProduct,
    destroyOrderProduct
} = require('../db');
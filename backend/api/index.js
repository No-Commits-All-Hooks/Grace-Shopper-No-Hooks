const express = require('express');
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


// api/products
const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

// api/users
const usersRouter = require('./users')
apiRouter.use('/users', usersRouter);

// api/orders
const ordersRouter = require('./orders')
apiRouter.use('/orders', ordersRouter)


module.exports = apiRouter;

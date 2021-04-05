const express = require('express');
const apiRouter = express.Router();


// api/products
const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

// api/users
const usersRouter = require('./users')
apiRouter.use('/users', usersRouter);


module.exports = apiRouter;

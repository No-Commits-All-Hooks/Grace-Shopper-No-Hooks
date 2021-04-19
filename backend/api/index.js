const express = require('express');
const apiRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { getUserById, getCartByUser } = require('../db');


// GET /api/health
apiRouter.get('/health', async (req, res, next) => {
  try {
    const uptime = process.uptime();
    const {rows: [dbConnection]} = await client.query('SELECT NOW();');
    const currentTime = new Date();
    const lastRestart = new Intl.DateTimeFormat('en', {timeStyle: 'long', dateStyle: 'long', timeZone: "America/Los_Angeles"}).format(currentTime - (uptime * 1000));
    res.send({message: 'healthy', uptime, dbConnection, currentTime, lastRestart});
  } catch (err) {
    next(err);
  }
});


// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
    
  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
  
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
  
      if (id) {
        req.user = await getUserById(id);
        next();
      }
   

    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});
  
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  
  next();
});

apiRouter.post('/pay', async (req, res, next) => {
  try {
    const charge = await stripe.charges.create(req.body);
    res.status(200).send({ success: charge });
  } catch(error) {
    res.status(500).send({ error });
  }
});

// api/products
const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

// api/users
const usersRouter = require('./users')
apiRouter.use('/users', usersRouter);

// api/orders
const ordersRouter = require('./orders')
apiRouter.use('/orders', ordersRouter)

// api/order_products 
const orderProducts = require('./order_products')
apiRouter.use('/order_products', orderProducts)

// // api/admin 
// const admin = require('./admin')
// apiRouter.use('/admin', adminPage)



module.exports = apiRouter;

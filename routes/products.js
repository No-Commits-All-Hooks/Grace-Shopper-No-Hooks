const router = require('express').Router();

const { getAllProducts } = require('../db/products');

router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

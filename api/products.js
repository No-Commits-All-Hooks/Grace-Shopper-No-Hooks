const express = require("express");
const productsRouter = express.Router();

const { getAllProducts, getProductById } = require("../db/products.js");

productsRouter.get('/', async (req, res) => {
    try {
        const allProducts = await getAllProducts();
        
        res.send({
            allProducts
        });
    } catch(error) {
        throw error;
    }
})

productsRouter.get('/:productId', async (req, res) => {
    try {
        const productById = await getProductById();
        
        res.send({
            productById
        });
    } catch(error) {
        throw error;
    }
})

module.exports = productsRouter;
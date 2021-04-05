const express = require('express');
const ordersRouter = express.Router();
const {  getAllOrders, getProductById } = require('../db');
-

ordersRouter.get('/', async(req, res,next) =>{

    try{
        const orders = await getAllOrders();
        res.send(orders);
    } catch(error){
        next(error);
    }
})

// ordersRouter.get('/cart', async (req, res, next)=> {

//     try{

//     }catch(error){
//         next(error);
//     }
// })

module.exports = ordersRouter;

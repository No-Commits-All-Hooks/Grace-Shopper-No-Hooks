const express = require('express');
const ordersRouter = express.Router();
const {  getAllOrders } = require('../db');
-

ordersRouter.get('/', async(req, res,next) =>{

    try{
        const orders = await getAllOrders();
        res.send(orders);
    } catch(error){
        next(error);
    }
})

ordersRouter.get('/cart', async (req, res, next)=> {

    try{

    }catch(error){
        next(error);
    }
})

ordersRouter.post('/')


module.exports = ordersRouter;

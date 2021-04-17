const express = require('express');
const productsRouter = express.Router();

const { 
  getAllProducts, 
  getProductById,
  getReviewById,
  getReviewsByProductId,
  deleteReview,
  updateReview,
  createReview
} = require('../db');

const { requireUser, isAuthorized } = require('./utils');

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.send({
      products,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productById = await getProductById(productId);
    const reviews = await getReviewsByProductId(productId);

    if (!productById) {
      next({
        name: 'NotFound',
        message: `No product found by ID ${productId}`,
      });
    }
    res.send({
      productById,
      reviews
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/:productId/review/create', requireUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    const review = await createReview({...req.body, userId: user.userId, productId})

    res.send({
      review
    })
  } catch(error) {
    next(error);
  }
})

productsRouter.patch('/review/:reviewId/edit', requireUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    let existingReview = getReviewById(reviewId);
    if(isAuthorized(existingReview.userId, req.user)) {
      const review = await updateReview({...req.body, id: reviewId})
      res.send({
        review
      })
      return;
    }
    next({
      name: 'Wrong User',
      message: 'User does not match review author'
    })
  } catch(error) {
    next(error);
  }
})

productsRouter.delete('/review/:reviewId/delete', requireUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    let existingReview = getReviewById(reviewId);
    if(isAuthorized(existingReview.userId, req.user)) {
      const review = await deleteReview(reviewId)
      res.send({
        review
      })
      return;
    }
    next({
      name: 'Wrong User',
      message: 'User does not match review author'
    })
  } catch(error) {
    next(error);
  }
})

module.exports = productsRouter;

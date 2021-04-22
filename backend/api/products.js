const express = require("express");
const productsRouter = express.Router();

const { 
  getAllProducts, 
  getProductById,
  getReviewById,
  getReviewsByProductId,
  deleteReview,
  updateReview,
  createReview,
  updateProduct
} = require('../db');

const { requireUser, isAuthorized, requireAdmin } = require('./utils');


productsRouter.get("/", async (req, res, next) => {
  try {
    let products = await getAllProducts();
    products = await Promise.all(products.map(async product => {
      const reviews = await getReviewsByProductId(product.id);
      product.reviews = reviews;
      return product
    }));

    res.send({
      products,
    });
  } catch (error) {
    next(error);
  }
});

//For admin to add products to database
productsRouter.post("/", requireAdmin, async (req, res, next) => {
//need all fields to create a product in table. Form should require it but just in case.
const { name, description, price, imageurl, instock, category } = req.body;
//need all fields to create a product in table, so check ands send back error based on what is missing
if (!name){
  throw Error(`Please provide a Name for the product.`);
};
if (!description){
  throw Error(`Please provide a Description for the product.`);
};
if (!price){
  throw Error(`Please provide a Price for the product. Only numbers accepted. You entered: ${price}`);
};
if (!imageurl){
  throw Error(`Please provide http: address for the product image. You entered ${imageurl} `);
};
if (!instock){
  throw Error(`Please provide instock status for the product. You selected: ${instock}`);
}

if (!category){
  throw Error(`Please provide Category status for the product. You entered: ${category}`);
}
// if you have all fields try to create it
try{
  
   const newProduct = await createProducts({name, description, price, imageurl, instock, category});
   res.send(newProduct);
} catch({ name, message }) {
  next({ name, message });
};

});



productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productById = await getProductById(productId);
    const reviews = await getReviewsByProductId(productId);

    if (!productById) {
      next({
        name: "NotFound",
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

//this for admin to update product, so check to see of person is an admin first
productsRouter.patch("/:productId", async (req, res, next) => {
  const { productId } = req.params; //pull this from params
  //these are the fields you can update in the products table
  const { name, description, price, imageurl, instock, category } = req.body; //pull this from the body

  try {
    //GO find the product
    const product = await getProductById(productId);

    if (!product) {
      next({
        name: "NotFound",
        message: `No product found with ID ${productId}`,
      });
    }
    //add to that product object what needs to be changed
    if (name) {
      product.name = name;
    }

    if (description) {
      product.descripton = description;
    }

    if (price) {
      product.price = price;
    }
    if (imageurl) {
      product.imageurl = imageurl;
    }

    if (instock) {
      product.instock = instock;
    }
    if (category) {
      product.category = category;
    }
    //now that you've updated your product object try to update 
    const updatedProduct = await updateProduct(product);
    res.send(updatedProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = productsRouter;

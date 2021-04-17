const express = require("express");
const productsRouter = express.Router();

const { getAllProducts, getProductById, updateProduct, createProducts } = require("../db");
const { requireAdmin } = require("./utils");

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();

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
  throw Error(`Please provide Category status address address for the product. You entered: ${category}`);
}
// if you have all fields try to create it
try{
  
   const newProduct = await createProducts({name, description, price, imageurl, instock, category});
   res.send(newProduct);
} catch({ name, message }) {
  next({ name, message });
};

};



productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productById = await getProductById(productId);

    if (!productById) {
      next({
        name: "NotFound",
        message: `No product found by ID ${productId}`,
      });
    }
    res.send({
      productById,
    });
  } catch (error) {
    next(error);
  }
});

//this for admin to update user, so check to see of person is an admin first
productsRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
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

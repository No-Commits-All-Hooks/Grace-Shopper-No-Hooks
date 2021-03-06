const client = require('./client');

async function createProducts({
  name,
  description,
  price,
  imageURL,
  inStock,
  category,
}) {
  try {
    const {
      rows: [products],
    } = await client.query(
      `
            INSERT INTO products(name, description, price, imageURL, inStock, category)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,
      [name, description, price, imageURL, inStock, category]
    );

    return products;
  } catch (error) {
    throw error;
  }
}
//get all products return all fields from the table so in can be displayed
async function getAllProducts() {
  try {
    const { rows: products } = await client.query(
      `SELECT *
            FROM products;
            `
    );

    return products;
  } catch (error) {
    throw error;
  }
}

//This function returns one product base on the id passed in
async function getProductById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        SELECT *
        FROM products
        WHERE id=$1;
        `,
      [id]
    );
    // if you can't find a product return null
    if (!product) {
      return null;
    }
    // return what they are looking for and sell, sell, sell
    return product;
  } catch (error) {
    throw error;
  }
}

async function attachProductsToOrders(orders) {
  // no side effects
  const ordersToReturn = [...orders];
  const binds = orders.map((_, index) => `$${index + 1}`).join(', ');
  const orderId = orders.map(order => order.id);
  if (!orderId?.length) return;
  
  try {
    // get the products, JOIN with order_products (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: products } = await client.query(`
      SELECT products.*, order_products."productId", order_products."orderId", order_products.id AS "orderProductsId", order_products.price, order_products.quantity
      FROM products 
      JOIN order_products ON order_products."productId" = products.id
      WHERE order_products."orderId" IN (${ binds });
    `, orderId);

    // loop over the orders
    for(const order of ordersToReturn) {
      // filter the products to only include those that have this routineId
      const productsToAdd = products.filter(product => product.orderId=== order.id);
      // attach the products to each single routine
      order.products = productsToAdd;
    }

    return ordersToReturn;
  } catch (error) {
    throw error;
  }
}


// DESTROY PRODUCT
const destroyProduct = async ({ id }) => {
  try {
    await client.query(`
      DELETE FROM order_products
      WHERE "productId"=$1
      RETURNING *;
    `, [id]);
    const { rows: [productToDelete] } = await client.query(`
      DELETE FROM products
      WHERE id=$1
      RETURNING *;
    `, [id]);
    return productToDelete;
  } catch (error) {
    throw error;
  };
};

//For admin to update product (everything except product id)
const updateProduct = async ({id: productId, name,  description, price, imageurl, instock, category}) => {

  //start with an empty opject and build it based on variables admin passes in to update
  const updateFields = {};

  if (name) {
      updateFields.name = name;
  };

  if (description) {
      updateFields.description = description;
  };
  
  if (price) {
      updateFields.price = price;
  };

  if (imageurl) {
    updateFields.imageurl = imageurl;
};

if (instock) {
  updateFields.instock = instock;
};

if (category) {
  updateFields.category = category;
};


//build a string based on what was passed in
  const setString = Object.keys(updateFields).map(
      (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
//if there is nothing return it. nothing to do here
  if (setString.length === 0) {
      return;
  };
 //this line Object.values(updateFields) grabs the values of the object you built earlier
  try {
      const {rows: [product]} = await client.query(`
          UPDATE products
          SET ${setString}
          WHERE id=${productId}
          RETURNING *;
      `, Object.values(updateFields));

      return product;
  } catch (error) {
      throw Error(`Error while updating product: ${error}`);
  };
};




module.exports = {
  createProducts,
  getAllProducts,
  getProductById,
  attachProductsToOrders, 
  updateProduct,
  destroyProduct
};

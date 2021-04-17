const client = require('./client');
const { createProducts, 
        createUser, 
        getUserByUsername, 
        getAllUsers, 
        getUser,
        getUserById,
        updateUser,
        getOrderById,
        getAllOrders,
        getOrdersByUser,
        getOrdersByProduct,
        getCartByUser,
        createOrder,
        getAllProducts,
        updateProduct,
        getOrderProductById,
        addProductToOrder,
        updateOrderProduct,
        getProductById,
        destroyOrderProduct,
        updateOrder,
        completeOrder,
        cancelOrder,
        getOrderProductsByOrder,
        getReviewById,
        getReviewsByUser,
        getReviewsByProductId,
        deleteReview,
        updateReview,
        createReview
} = require('./');

async function dropTables() {
  try {
    console.log('Starting to drop tables...');

    await client.query(`
            DROP TABLE IF EXISTS order_products;
            DROP TABLE IF EXISTS orders;
              DROP TABLE IF EXISTS users;
              DROP TABLE IF EXISTS products;
            `);

    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error dropping tables!');
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Starting to build tables...');
    // create all tables, in the correct order

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        imageURL VARCHAR(255) DEFAULT 'https://coursereport-s3-production.global.ssl.fastly.net/uploads/school/logo/39/original/fsa_logo_vertical-01_full_color_CR-01.png',
        inStock BOOLEAN NOT NULL DEFAULT false,
        category VARCHAR(255) NOT NULL
      );
      `);
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        imageURL VARCHAR(255) DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN NOT NULL DEFAULT false
      );
      `);
    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        status TEXT DEFAULT 'created',
        "userId" INTEGER REFERENCES users(id),
        "datePlaced" DATE NOT NULL DEFAULT CURRENT_DATE
      );
      `);
    await client.query(`
      CREATE TABLE order_products (
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "orderId" INTEGER REFERENCES orders(id),
        price NUMERIC NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
      );
      `);

    await client.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        stars INTEGER NOT NULL,
        CHECK (stars >= 0 AND stars <= 5),
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id)
      );
    `);

    console.log('Finished building tables!');
  } catch (error) {
    console.error('Error building tables!');
    throw error;
  }
}

// need to add mock data to test initial users, products etc

async function createInitialProducts() {
  try {
    console.log('Starting to create products...');

    const productsToCreate = [
      {
        name: 'Travel Mug',
        description: 'Fullstack Academy Travel Mug',
        price: 5.99,
        imageURL:
          'https://www.coastalbusiness.com/pub/media/catalog/product/cache/512de54f123dc2b25ce70b0876441768/p/l/plastic_travel_mug_1.png',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Backpack',
        description: 'Backpack with protective padding and laptop sleeve.',
        price: 18.99,
        imageURL:
          'https://d1vo2ulxpswjig.cloudfront.net/CAT4IMAGES/FRONT_MODEL/600/BG203_black_front.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Mesh Cap/Trucker Hat',
        description: 'Adjustable black/grey hat with plastic snap closure',
        price: 10.99,
        imageURL:
          'https://images-na.ssl-images-amazon.com/images/I/71IVBJ8sFSL._AC_UL1500_.jpg',
        inStock: true,
        category: 'Hats',
      },

      {
        name: 'Blue Armada Sling Backpack',
        description: 'Sling back backpack with FullStack Academy logo',
        price: 10.99,
        imageURL: 'https://postimg.cc/TKDzmQ3G',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Black Hoodie',
        description: 'Black hoodie with FullStack Academys logo. Worn by many of your instructors.',
        price: 34.99,
        imageURL: 'https://postimg.cc/0bmvGtbZ',
        inStock: true,
        category: 'Clothing',
      },
      {
        name: 'Salary booster - AKA: "Money Shovel',
        description: 'Make sure to add to your cart. Upon graduation you are most likely to need this shovel to carry your programmers money to the bank. (NOTICE: Salary NOT guaranteed upon graduation, but discussed quite a bit during course).',
        price: 100.00,
        imageURL: 'https://postimg.cc/14BwmH9C',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Salary Mover - AKA: "Take it to the Bank',
        description: 'Make sure to add to your cart if you got Salary Booster. Upon graduation you are most likely to need this take your new money. (NOTICE: Salary NOT guaranteed upon graduation, but discussed quite a bit during course).',
        price: 400.00,
        imageURL: 'https://postimg.cc/xcF01Drx',
        inStock: true,
        category: 'Accesories',
      },


    ];

    const products = await Promise.all(
      productsToCreate.map((product) => createProducts(product))
    );
    console.log('Products Created: ', products);
    console.log('Finished creating products.');
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { firstName: "Mandy", lastName: "Lara", email: "mlara01@gmail.com",username: "mandy.lara", password: "lara2020" },
      { firstName: "Sal", lastName: "Medina", email: "salthepal@yahoo.com",username: "salthepal", password: "sal1234" },
      { firstName: "Martin", lastName: "Cruz", email: "martin.cruz@gmail.com",username: "martini", password: "martin2021", isAdmin:true },
      { firstName: "Cody", lastName: "Banks", email: "cody@gmail.com",username: "cody", password: "cody2021"},
      { firstName: "Heidi", lastName: "Klum", email: "heidi@gmail.com",username: "heidi", password: "cody2021"},
    ];
    const users = await Promise.all(usersToCreate.map(createUser));
    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialOrders() {
try {

  const ordersCreated = [{
      status: "created",
      userId: 2,
    },
    {
      status: "created",
      userId: 3,
  },
    {
      status: "created",
      userId: 1,
  },{
    status: "completed",
    userId: 1,
}];
const orders = await Promise.all( ordersCreated.map((order) => createOrder(order)))
console.log("Orders Created: ", orders);
console.log("Finished creating orders.");
}catch(error){
  throw error;
}
}

async function createInitialOrderProducts() {
  try {
    console.log("Starting to add order products.");
    const orderProductsCreated = [
      {
        productId: 1,
        orderId: 1,
        price: 17.97,
        quantity: 3
      },
      {
        productId: 2,
        orderId: 2,
        price: 18.99,
        quantity: 1
      },
      {
        productId: 3,
        orderId: 3,
        price: 21.98,
        quantity: 2
      },
      {
        productId: 3,
        orderId: 1,
        price: 10.99,
        quantity: 1
      },
      {
        productId: 3,
        orderId: 1,
        price: 10.99,
        quantity: 1
      },
      {
        productId: 6,
        orderId: 4,
        price: 200,
        quantity: 2
      }
    ];

    const orderProducts = await Promise.all(orderProductsCreated.map((orderProduct) => addProductToOrder(orderProduct)));
    console.log("Order Products Added: ", orderProducts);
    console.log("Finished adding order products.");
  } catch(error) {
    throw error;
  }
}

async function createInitialReviews() {
  try {
    console.log("Starting to add reviews.");
    const reviewsToCreate = [
      {
        title: "I Got Mugged!",
        content: "My mug was cracked upon arrival. I want a refund immediately!",
        stars: 0,
        userId: 2,
        productId: 1
      },
      {
        title: "I'll be back!",
        content: "Great backpack, lightweight but sturdy. Perfect for all my school supplies.",
        stars: 5,
        userId: 1,
        productId: 2
      },
      {
        title: "Not sure we mesh",
        content: "Hat looks great, but it is a little too small for my head. Otherwise, can't complain.",
        stars: 3,
        userId: 3,
        productId: 3
      }
    ];

    const reviews = await Promise.all(reviewsToCreate.map((review) => createReview(review)));
    console.log("Reviews Added: ", reviews);
    console.log("Finished adding reviews.");
  } catch(error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialProducts();
    await createInitialUsers();
    await createInitialOrders();
    await createInitialOrderProducts();
    await createInitialReviews();
  } catch (error) {
    console.log('Error during rebuildDB');

    throw error;
  }
}

async function testDB(){

  try{



        const getCart= await getCartByUser(2) 
    console.log("getCartByUser Result:", getCart);

    // const updatedOrderProduct= await updateOrderProduct({id :5, price: 10.99, quantity: 2}) 
    // console.log("updatedOrderProduct Result:", updatedOrderProduct);

    const addedOP= await addProductToOrder({orderId: 1, productId: 3, price: 10.99, quantity : 1}) 
    console.log("addProductToOrder Result:", addedOP);

    // const addedOPTWO= await addProductToOrder({orderId: 2, productId: 2, price: 18.99, quantity : 1}) 
    // console.log("addProductToOrder Result:", addedOPTWO);
    
    const orderProduct= await getOrderProductsByOrder(1) 
    console.log("getOrderProductsByOrder Result:", orderProduct);

    const orderProductId= await getOrderProductById(5) 
    console.log("getOrderProductById Result:", orderProductId);
    // This worked
    // console.log("get an oldProduct")
    // const oldProduct = await getProductById(6)
    // console.log("get oldProduct Result:", oldProduct)
    // console.log("start to update an oldProduct")
    // const updatedProduct = await updateProduct({id:6, name:"New Salary Manager", price:5000, instock:'false'})
    // console.log("Update an oldProduct Result:", updatedProduct)
    
    
  } catch(error){
    throw error
  }
  
}


rebuildDB()
.then(testDB)
  .catch(console.error)
  .finally(() => client.end());

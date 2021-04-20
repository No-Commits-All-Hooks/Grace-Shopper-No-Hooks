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
            DROP TABLE IF EXISTS reviews;
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
        price FLOAT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
      );
      `);

    await client.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(500) NOT NULL,
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
        name: 'White Ceramic Mug',
        description: 'Fullstack Academy Travel Mug',
        price: 5.99,
        imageURL:
          'https://i.postimg.cc/c4YN9Lhb/white-ceramic-mug.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Black Ceramic Mug',
        description: 'Fullstack Academy Travel Mug',
        price: 5.99,
        imageURL: 'https://i.postimg.cc/4ywQdBd7/black-ceramic-mug.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Red Ceramic Mug',
        description: "Fullstack Academy Travel Mug. Yes the price is right. Can't find a better deal.",
        price: 5.99,
        imageURL: 'https://i.postimg.cc/SK6ktNGr/red-ceramic-mug.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Teal Ceramic Mug',
        description: "Fullstack Academy Travel Mug. Teal, cause you want to think of a beach. Yes the price is right. Can't find a better deal.",
        price: 5.99,
        imageURL: 'https://i.postimg.cc/SQ836tD6/teal-ceramic-mug.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Backpack - Foldable - White',
        description: 'Backpack with protective padding and laptop sleeve.',
        price: 28.50,
        imageURL: 'https://i.postimg.cc/bNtMRVg0/black-foldable-backpacks.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Pom Knit Beanie - Red and White',
        description: 'Not only warm, but comfortable, too. Stretchable, one-size-fits-all.',
        price: 15.99,
        imageURL:
          'https://i.postimg.cc/rFZ1KqxQ/red-white-beanies.jpg',
        inStock: true,
        category: 'Hats',
      },
      {
        name: 'Pom Knit Beanie - Blue and White',
        description: 'Not only warm, but comfortable, too. Stretchable, one-size-fits-all.',
        price: 15.99,
        imageURL: 'https://i.postimg.cc/bN6vPJkN/blue-white-beanies.jpg',
        inStock: true,
        category: 'Hats',
      },
      {
        name: 'Blue Armada Sling Backpack',
        description: 'Sling back backpack with FullStack Academy logo.',
        price: 18.99,
        imageURL: 'https://i.postimg.cc/g2SmCT9w/blue-armada-sling-backpack.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Red Armada Sling Backpack',
        description: 'Sling back backpack with FullStack Academy logo.',
        price: 18.99,
        imageURL: 'https://i.postimg.cc/Gtbdvwwp/red-armada-sling-backpack.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Orange Armada Sling Backpack',
        description: 'Sling back backpack with FullStack Academy logo.',
        price: 18.99,
        imageURL: 'https://i.postimg.cc/R0PDXkHF/orange-armada-sling-backpack.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Black Hoodie',
        description: 'Black hoodie with FullStack Academys logo. Worn by many of your instructors.',
        price: 34.99,
        imageURL: 'https://i.postimg.cc/gkt0WQd9/black-hoodie.jpg',
        inStock: true,
        category: 'Clothing',
      },
      {
        name: 'Red Hoodie',
        description: 'Red hoodie with FullStack Academys logo. Worn by many of your instructors.',
        price: 34.99,
        imageURL: 'https://i.postimg.cc/0NQ0Vbxg/red-hoodie.jpg',
        inStock: true,
        category: 'Clothing',
      },
      {
        name: 'Blue Hoodie',
        description: 'Blue hoodie with FullStack Academys logo. Worn by many of your instructors.',
        price: 34.99,
        imageURL: 'https://i.postimg.cc/GhG7D83q/blue-hoodie.jpg',
        inStock: true,
        category: 'Clothing',
      },
      {
        name: '3-in-1 Charging Cable with Key-ring',
        description: '3-in-1 portable USB cable. Compatible wiht various models of cellphones and tablets.',
        price: 12.99,
        imageURL: 'https://i.postimg.cc/904PCS0L/blue-light-up-logo-cable.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Salary booster - AKA: "Money Shovel',
        description: 'Make sure to add to your cart. Upon graduation you are most likely to need this shovel to carry your programmers money to the bank. (NOTICE: Salary NOT guaranteed upon graduation, but discussed quite a bit during course).',
        price: 100.00,
        imageURL: 'https://i.postimg.cc/28RwxcgD/Gold-Plated-Shovel.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Salary Mover - AKA: "Take it to the Bank',
        description: 'Make sure to add to your cart if you got Salary Booster. Upon graduation you are most likely to need this take your new money. (NOTICE: Salary NOT guaranteed upon graduation, but discussed quite a bit during course).',
        price: 400.00,
        imageURL: 'https://i.postimg.cc/3x3W9YtT/Wheel-Barrow.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Three in one Charger Kit - Blue',
        description: "Don't be caught with a low battery. And let your friends know they can count on you to provide a charge with this 3in1 charge kit.",
        price: 19.50,
        imageURL: 'https://i.postimg.cc/zG9PHCKt/blue-metallic-3-in-1-charging.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Three in one Charger Kit - Silver',
        description: "Don't be caught with a low battery. And let your friends know they can count on you to provide a charge with this 3in1 charge kit.",
        price: 19.50,
        imageURL: 'https://i.postimg.cc/L5ykpSmY/silver-metallic-3-in-1-charging.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Three in one Charger Kit - Black',
        description: "Don't be caught with a low battery. And let your friends know they can count on you to provide a charge with this 3in1 charge kit.",
        price: 19.50,
        imageURL: 'https://i.postimg.cc/kMYrXt1Z/black-metallic-3-in-1-charging.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Mason Jar - 16oz - Red',
        description: "Don't be parched, drink from this handy mason jar with handle. Will it tip over, maybe. Just make sure to keep away from your desktop.",
        price: 11.50,
        imageURL: 'https://i.postimg.cc/7YymMHW9/red-16oz-libbey-mason.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Mason Jar - 16oz - Black',
        description: "Don't be parched, drink from this handy mason jar with handle. Will it tip over, maybe. Just make sure to keep away from your desktop.",
        price: 11.50,
        imageURL: 'https://i.postimg.cc/5yvhjskm/black-16oz-libbey-mason.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Mason Jar - 16oz - Blue',
        description: "Don't be parched, drink from this handy mason jar with handle. Will it tip over, maybe. Just make sure to keep away from your desktop.",
        price: 11.50,
        imageURL: 'https://i.postimg.cc/Hn2fQrdJ/blue-16oz-libbey-mason.jpg',
        inStock: true,
        category: 'Drinkware',
      },

      {
        name: 'Collapsible Can Cooler - White',
        description: "Whether it's an energy drink, seltzer, juice, or spiked beverage, make sure to keep it cool with this coozie.",
        price: 8.50,
        imageURL: 'https://i.postimg.cc/x8q5q8xy/white-neoprene-collapsible-can-coolers.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Collapsible Can Cooler - Black',
        description: "Whether it's an energy drink, seltzer, juice, or spiked beverage, make sure to keep it cool with this coozie.",
        price: 8.50,
        imageURL: 'https://i.postimg.cc/0ymzPvf6/black-neoprene-collapsible-can-coolers.jpg',
        inStock: true,
        category: 'Drinkware',
      },
      {
        name: 'Golf Umbrella - 48in - Black and White',
        description: "No need to play golf to use this umbrella. Plenty of coverage for two when you need to get somewhere in the rain.",
        price: 28.50,
        imageURL: 'https://i.postimg.cc/nhW14frk/48in-arc-umbrellas-white-black.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Golf Umbrella - 48in - Blue and Black',
        description: "No need to play golf to use this umbrella. Plenty of coverage for two when you need to get somewhere in the rain.",
        price: 28.50,
        imageURL: 'https://i.postimg.cc/15JBzqZb/48in-arc-umbrellas-blue-black.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Golf Umbrella - 48in - Red and White',
        description: "No need to play golf to use this umbrella. Plenty of coverage for two when you need to get somewhere in the rain.",
        price: 28.50,
        imageURL: 'https://i.postimg.cc/7ZhVJZHh/48in-arc-umbrellas-red-black.jpg',
        inStock: true,
        category: 'Accesories',
      },
      {
        name: 'Backpack - Foldable - White',
        description: "Yes, foldable. Cause sometimes you need a backpack for when you get there. But, this is not just for travel. Everyday use is also part of this bag's design.",
        price: 29.50,
        imageURL: 'https://i.postimg.cc/W4tBLpjr/white-foldable-backpacks.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Backpack - Foldable - Blue',
        description: "Yes, foldable. Cause sometimes you need a backpack for when you get there. But, this is not just for travel. Everyday use is also part of this bag's design.",
        price: 29.50,
        imageURL: 'https://i.postimg.cc/TPtfXNZL/blue-foldable-backpacks.jpg',
        inStock: true,
        category: 'Bags',
      },
      {
        name: 'Shot glass - 2oz',
        description: "Standard shot is 1.5oz. We know you've worked hard, so we give you 33% more capacity with our shot glass.",
        price: 9.50,
        imageURL: 'https://i.postimg.cc/v87XpK2Y/2-oz-shot-glass.jpg',
        inStock: true,
        category: 'Drinkware',
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
      { firstName: "Admin", lastName: "Master", email: "heidi@gmail.com",username: "admin", password: "admin2021"},
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
const orders = await Promise.all( ordersCreated.map((order) => createOrder(order.status, order.userId)))

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

    // const addedOP= await addProductToOrder({orderId: 1, productId: 3, price: 10.99, quantity : 1}) 
    // console.log("addProductToOrder Result:", addedOP);

    const addedOPTWO= await addProductToOrder({orderId: 2, productId: 2, price: 18.99, quantity : 1}) 
    const addedOPthree= await addProductToOrder({orderId: 2, productId: 2, price: 18.99, quantity : 1}) 
    console.log("addProductToOrder Result:", addedOPthree);
    
    const orderProduct= await getOrderProductsByOrder(1) 
    console.log("getOrderProductsByOrder Result:", orderProduct);

    // const orderProductId= await getOrderProductById(5) 
    // console.log("getOrderProductById Result:", orderProductId);
    // This worked
    // console.log("get an oldProduct")
    const oldUser = await getUserByUsername('admin')
    console.log("get oldUser by username 'admin' :", oldUser)

    console.log("start to upgrade an oldUser to admin", oldUser.id)

    const adminUser = await updateUser({id: oldUser.id, isAdmin:true, })
    console.log("Update an oldUser to admin:", adminUser)
    
    
  } catch(error){
    throw error
  }
  
}


rebuildDB()
.then(testDB)
  .catch(console.error)
  .finally(() => client.end());

const client = require('./client');
const { createProducts, 
        createUser, 
        getUserByUsername, 
        getAllUsers, 
        getUser,
        getUserById,
        getOrderById,
        getAllOrders,
        getOrdersByUser,
        getOrdersByProduct,
        getCartByUser,
        createOrder,
        getAllProducts,
        getOrderProductById,
        addProductToOrder,
        updateOrderProduct,
        destroyOrderProduct,
        updateOrder,
        completeOrder,
        cancelOrder,
        getOrderProductsByOrder
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
      { firstName: "Martin", lastName: "Cruz", email: "martin.cruz@gmail.com",username: "martini", password: "martin2021", isAdmin: true },
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
      userId: 1,
  },{
    status: "created",
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
      }
    ];

    const orderProducts = await Promise.all(orderProductsCreated.map((orderProduct) => addProductToOrder(orderProduct)));
    console.log("Order Products Added: ", orderProducts);
    console.log("Finished adding order products.");
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
    
  } catch(error){
    throw error
  }
  
}


rebuildDB()
.then(testDB)
  .catch(console.error)
  .finally(() => client.end());

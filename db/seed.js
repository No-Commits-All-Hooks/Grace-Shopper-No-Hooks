const client = require('./client');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
    
        await client.query(`
            DROP TABLE IF EXISTS order_products;
            DROP TABLE IF EXISTS orders;                
              DROP TABLE IF EXISTS users;
              DROP TABLE IF EXISTS products;
            `);
    
        console.log("Finished dropping tables!");
      } catch (error) {
        console.error("Error dropping tables!");
        throw error;
      }
}

async function createTables() {
    try {
      console.log("Starting to build tables...");
      // create all tables, in the correct order
  
      await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        description varchar(255) NOT NULL,
        price INTEGER NOT NULL,
        imageURL BOOLEAN DEFAULT false,
        inStock BOOLEAN NOT NULL DEFAULT false,
        category TEXT NOT NULL
      );
      `)
      await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstName varchar(255) NOT NULL,
        lastName varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        imageURL BOOLEAN DEFAULT false,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN NOT NULL DEFAULT false
      );
      `)
      await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        status TEXT DEFAULT 'created',
        "userId" INTEGER REFERENCES users(id),
        "dataPlaced" DATE
      );
      `)
      await client.query(`
      CREATE TABLE order_products (
        id SERIAL PRIMARY KEY, 
        "productId" INTEGER REFERENCES products(id),
        "orderId" INTEGER REFERENCES orders(id),
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
      );
      `)
    
      console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}
  
  // need to add mock data to test initial users, products etc


  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
    //   await createInitialUsers();
    //   await createInitialProducts();
    } catch (error) {
      console.log("Error during rebuildDB");
  
      throw error;
    }
  }

//need to build out testDB


// async function testDB(){
// try{

// } catch (error){
//     console.log("Error during testDB:", error);
//     throw error}

// }


rebuildDB()
//uncomment .then after testDB built
//   .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
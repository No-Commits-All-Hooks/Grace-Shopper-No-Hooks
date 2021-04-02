// require and re-export all files in this db directory (users, products...)

module.exports = {
    ...require('./client'), // adds key/values from users.js
    // ...require('./users'), // adds key/values from users.js
    ...require('./products'), // adds key/values from products.js
    // ...require('./orders'), // etc
    // ...require('./order_products') // etc
  }
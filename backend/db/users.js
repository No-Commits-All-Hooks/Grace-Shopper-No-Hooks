const client = require('./client');
const bcrypt = require("bcrypt");


async function createUser({ firstName, lastName, email, username, password }){
const SALT_COUNT = 10;

try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (firstName, lastName, email, username, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
      [firstName, lastName, email, username, hashedPassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw Error(`Error creating author: ${error.message}`);
  }

}



module.exports = {
    createUser
  }
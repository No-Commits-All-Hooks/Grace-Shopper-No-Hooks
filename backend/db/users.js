const client = require("./client");
const bcrypt = require("bcrypt");

//For creating the user for first time
async function createUser({ firstName, lastName, email, username, password }) {
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

//Getting ALL USERS
async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
            SELECT *
            FROM users;
        `);

    delete users.password;
    return users;
  } catch (error) {
    throw error;
  }
}

//Finding User by id
async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
          SELECT *
          FROM users 
          WHERE id = $1;
          `,
      [id]
    );

    if (!user) {
      return;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

//To check if username already is in use?
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
          SELECT *
          FROM users 
          WHERE username = $1;
          `,
      [username]
    );

    if (!user) {
      return;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

//To log in
async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    console.log("user:", user);
    
    if (!user) {
      return null;
    }
    const hashedPassword = user.password;
    const comparePassword = await bcrypt.compare(password, hashedPassword);

    if (!comparePassword) {
      return;
    }
    // return the user object (without the password)
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUser, 
  getUserByUsername,
  getAllUsers,
  getUserById
};

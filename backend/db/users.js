const client = require("./client");
const bcrypt = require("bcrypt");

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
  getUserByUsername,
  getAllUsers,
  getUserById
};

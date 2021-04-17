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
            SELECT firstName, lastName, email, imageURL, username, "isAdmin"
            FROM users;
        `);

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
    const { rows } = await client.query(
      `
          SELECT *
          FROM users 
          WHERE username = $1;
          `,
      [username]
    );
    if (!rows || !rows.length) return null; 
    const [user] = rows; 
    return user;
  } catch (error) {
    throw Error(`Error while getting user by username: ${error}`)
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
      return;
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


const updateUser = async ({id: userId ,firstname, lastname, imageurl, username, password, isAdmin}) => {
  //need this for creating password
  const SALT_COUNT = 10;
  //start with an empty opject and build it based on variables admin passes in to update
  const updateFields = {};

  if (firstname) {
      updateFields.firstname = firstname;
  };

  if (lastname) {
      updateFields.lastname = lastname;
  };

  if (imageurl) {
    updateFields.imageurl = imageurl;
};

if (username) {
  updateFields.username = username;
};
//can the password be changed. Yes, just make sure to hash it with bcrypt
if (password) {

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  updateFields.password = hashedPassword;
};
if (isAdmin) {
  updateFields.isAdmin = isAdmin;
};


//builds a string based on what was passed in. this will be used in your SQL
  const setString = Object.keys(updateFields).map(
      (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
//if there is nothing return it. nothing to do here
  if (setString.length === 0) {
      return;
  };
 //this line Object.values(updateFields) grabs the values of the object you built earlier
  try {
      const {rows: [user]} = await client.query(`
          UPDATE users
          SET ${setString}
          WHERE id=${userId}
          RETURNING *;
      `, Object.values(updateFields));

      return user;
  } catch (error) {
      throw Error(`Error while updating product: ${error}`);
  };
};





module.exports = {
  createUser,
  getUser, 
  getUserByUsername,
  getAllUsers,
  getUserById,
  updateUser
};

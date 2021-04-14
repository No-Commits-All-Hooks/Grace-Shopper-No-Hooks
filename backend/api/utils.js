const { getUser } = require("../db");

const requireUser = (req, res, next) => {
  
    if (!req.user) {
        next({
            name: 'MissingUserError',
            message: 'You must be logged in to perform this action'
        });
    }
    else{

      next();
    }
  
    
  };

// create middlewear similar to requireAdmin 
const requireAdmin = (req, res, next) => {

  console.log ('req.user', req.user)
  if (!req.user && !req.user.isAdmin) {
      next({
          name: 'MissingAdminAuthorization',
          message: 'You must have special access to perform this action'
      });
  }
  next();
};


  module.exports = {
    requireUser,
    requireAdmin
    
  }
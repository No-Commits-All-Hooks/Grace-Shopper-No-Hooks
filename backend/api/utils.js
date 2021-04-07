const requireUser = (req, res, next) => {
    if (!req.user) {
        next({
            name: 'MissingUserError',
            message: 'You must be logged in to perform this action'
        });
    };
  
    next();
  };

// create middlewear similar to requireAdmin 
const requireAdmin = (req, res, next) => {
  if (!req.user) {
      next({
          name: 'MissingUserError',
          message: 'You must be logged in to perform this action'
      });
  }
  if (!req.user.isAdmin){
    next({
      name: 'MissingAdminError',
      message: 'You must be an Admin to perform action'
  });
  };

  next();
};


  module.exports = {
    requireUser,
    requireAdmin
    
  }
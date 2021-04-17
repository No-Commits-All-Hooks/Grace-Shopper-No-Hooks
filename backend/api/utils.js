const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  } else {
    next();
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    next({
      name: "MissingAdminAuthorization",
      message: "You must have special access to perform this action",
    });
  }
  next();
};


const isAuthorized = (userId, user) => user.isAdmin || user.userId === userId;


  module.exports = {
    requireUser,
    requireAdmin,
    isAuthorized
  }


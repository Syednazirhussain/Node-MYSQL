const { StatusCodes } = require('http-status-codes')
const { isTokenValid } = require('./../helper/jwt')

const authenticateUser = async (req, res, next) => {

  try {

    res.setHeader("Content-Type", "text/html")

    if (req.session.username === undefined || req.session.username === null) {
      console.log('Atif');
      res.redirect('/login')
    } else {
      next()
    }

  } catch (error) {    
    res.redirect('/login')
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

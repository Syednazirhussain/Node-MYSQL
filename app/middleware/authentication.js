const { StatusCodes } = require('http-status-codes')
const { isTokenValid } = require('./../helper/jwt')

const authenticateUser = async (req, res, next) => {

  try {

    const token = req.signedCookies.token;

    if (!token) {

      res.status(StatusCodes.PERMANENT_REDIRECT).redirect('/login')
    } else {

      const { id, name, email } = isTokenValid({ token })
      req.user = { id, name, email }
      next()
    }

  } catch (error) {
    
    res.status(StatusCodes.BAD_REQUEST).redirect('/login')
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

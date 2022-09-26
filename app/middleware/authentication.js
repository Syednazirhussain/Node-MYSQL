const { StatusCodes } = require('http-status-codes')
const { isTokenValid } = require('./../helper/jwt')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    res.status(StatusCodes.PERMANENT_REDIRECT).redirect('/login')
  }

  try {
    
    const { id, name, email } = isTokenValid({ token })
    req.user = { id, name, email }

    next()

  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.BAD_REQUEST).redirect('/login')
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
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

const { check, validationResult } = require('express-validator')
const { User } = require('./../model/models')

exports.items = [
  check('type')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),  
  (req, res, next) => {
    console.log(req.body);
    validationResult(req, res, next)
  }
]

/**
 * Validates register request
*/
exports.register = [
    check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    
    check('username')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('email')
    .exists()
    .withMessage('Please provide email address')
    .not()
    .isEmpty()
    .withMessage('Email is not empty'),

    check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
       
  (req, res, next) => {
    console.log(req.body);
    validationResult(req, res, next)
  }
]

/**
 * Validates login request
*/
exports.login = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid')
    .custom(async value => {
      let user = await User.findOne({
        where: {
          email: value
        }
      })
      if (!user) {
        return Promise.reject('Email not exist');
      }
    }),
  check('password')
    .exists()
    .withMessage('Password is required')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 chars long'),
    (req, res, next) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // let err = { errors: errors.array() }
        req.session.errors  = errors.array()
        return res.redirect('/login')
      }
      next()
    }
]

/**
 * Validates verify request
 */
exports.verify = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates forgot password request
 */
exports.forgotPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates reset password request
 */
exports.resetPassword = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

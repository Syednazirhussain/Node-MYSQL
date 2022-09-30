const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()

/* ------------- Middleware ------------- */

const {
    authenticateUser
} = require('./../app/middleware/authentication')

const validate = require('./../app/middleware/request-validate')

/* ------------- Controllers ------------- */

const {
    login,
    loginAttempt,
    logout,
    forgetPassword
} = require('../app/controller/auth.controller')

const {
    home
} = require('../app/controller/home.controller')

const {
    getUsers
} = require('../app/controller/user.controller')

/* ------------- Routes ------------- */

router.get('/', (req, res) => {
    res.redirect('/home');
})

router.get(
    '/login',
    login
)

router.post(
    '/login',
    trimRequest.all,
    validate.login,
    loginAttempt
)

router.get(
    '/logout',
    authenticateUser,
    logout
)

router.all(
    '/forget-password',
    forgetPassword
)

router.get(
    '/home',
    authenticateUser,
    home
)

router.get(
    '/users',
    authenticateUser,
    getUsers
)





module.exports = router
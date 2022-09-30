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

router.get(
    '/home',
    authenticateUser,
    home
)

router.all(
    '/forget-password',
    forgetPassword
)



module.exports = router
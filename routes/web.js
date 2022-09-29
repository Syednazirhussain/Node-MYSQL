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
    loginAttempt
} = require('./../app/controller/auth')

const {
    home
} = require('./../app/controller/home')

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
    '/home',
    authenticateUser,
    home
)



module.exports = router
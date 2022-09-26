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
    login
} = require('./../app/controller/auth')

const {
    home
} = require('./../app/controller/home')

/* ------------- Routes ------------- */

router.get('/', (req, res) => {
    res.redirect('/home');
})

router.all(
    '/login',
    trimRequest.all,
    validate.login,
    login
)

router.get(
    '/home',
    authenticateUser,
    home
)



module.exports = router
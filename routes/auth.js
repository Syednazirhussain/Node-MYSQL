const express = require('express')
const trimRequest = require('trim-request')

const validate = require('./../app/middleware/request-validate')
const { authenticateToken } = require('./../app/middleware/jwt-auth')
const { authenticateUserCookie } = require('./../app/middleware/cookie-auth')


const router = express.Router()

const {
    me,
    login,
    logout,
    register,
} = require('../app/controller/auth')

router.post(
    '/register',
    trimRequest.all,
    validate.register,
    register
)

router.post(
    '/login',
    trimRequest.all,
    validate.login,
    login
)

router.get(
    '/me',
    authenticateToken,
    authenticateUserCookie,
    me
)

router.post(
    '/logout',
    authenticateToken,
    authenticateUserCookie,
    logout
)

module.exports = router
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
    forgetPassword
} = require('../app/controller/api/auth.controller')

const {
    getPosts
} = require('../app/controller/api/post.controller')

const {
    getUsers
} = require('../app/controller/api/user.controller')

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

router.post(
    '/forget-password',
    forgetPassword
)

router.route('/post').get(getPosts)

router.route('/user').get(getUsers)

module.exports = router
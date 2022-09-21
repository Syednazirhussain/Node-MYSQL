const express = require('express')
const trimRequest = require('trim-request')

const validate = require('./../app/middleware/request-validate')

const router = express.Router()

const {
    register
} = require('../app/controller/auth')

router.post(
    '/register',
    trimRequest.all,
    validate.register,
    register
)

module.exports = router
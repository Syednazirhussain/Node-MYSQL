const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const { isTokenValid, userInfo } = require('./../helper/jwt')

exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    if (!isTokenValid({ token: token })) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Token' })
    }

    req.user = userInfo({ token: token })

    next()
}
const { StatusCodes } = require('http-status-codes')
const { isTokenValid } = require('./../helper/jwt')
const utils = require('../helper/utils')

exports.authenticateUserCookie = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    try {

        const { id, name, email } = isTokenValid({ token });
        req.user = { id, name, email }

        next()
    } catch (error) {
        utils.handleError(res, error)
    }
};
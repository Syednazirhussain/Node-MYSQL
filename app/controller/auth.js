const { User } = require('./../model/models')
const { attachCookiesToResponse, createJWT } = require('./../helper/jwt')
const { checkPassword } = require('./../middleware/auth')
const { asyncWrapper, handleError } = require('./../helper/utils')
const { StatusCodes } = require('http-status-codes')

exports.login = async (req, res) => {

    try {

        res.setHeader('Content-Type', 'text/html')
        res.render('auth/login')
    } catch (error) {

        handleError(res, error)
    }
}

exports.loginAttempt = async (req, res) => {

    try {

        console.log("Method: "+req.method);

        const { email, password } = req.body

        const userExist = await User.findOne({
            where: {
                email: email
            }
        })

        if (!userExist) {
            res.status(StatusCodes.NOT_FOUND).redirect('/login')
        }

        let isMatch = await checkPassword(password, userExist)

        if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).redirect('/login')
        }

        let tokenUser = {
            id: userExist.id,
            name: userExist.name,
            email: userExist.email
        }

        // attachCookiesToResponse({ res, user: tokenUser })

        let jwtToken = createJWT({ payload: tokenUser })

        const oneDay = 1000 * 60 * 60 * 24;

        res.cookie('token', jwtToken, {
            httpOnly: true,
            expires: new Date(Date.now() + oneDay),
            secure: process.env.NODE_ENV === 'production',
            signed: true,
        })

        res.status(StatusCodes.OK).redirect('/home')

    } catch (error) {

        handleError(res, error)
    }
}
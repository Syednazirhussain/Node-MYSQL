const { User } = require('./../model/models')
const { checkPassword } = require('./../middleware/auth')
const { handleError } = require('./../helper/utils')
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

        req.session.id = userExist.id
        req.session.name = userExist.name
        req.session.username = userExist.username
        req.session.email = userExist.email

        console.log(req.session)

        res.redirect('/home')

    } catch (error) {

        handleError(res, error)
    }
}

exports.logout = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect('/login')
    } catch (error) {

        handleError(res, error)
    }
}
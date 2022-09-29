const express = require('express')
const trimRequest = require('trim-request')

const authService = require('./../app/services/auth.service')

const router = express.Router()

/* ------------- Middleware ------------- */

const {
    authenticateUser
} = require('./../app/middleware/authentication')

const validate = require('./../app/middleware/request-validate')

/* ------------- Controllers ------------- */

const {
    login,
    // loginAttempt,
    logout
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
    // trimRequest.all,
    // validate.login,
    loginAttempt
)

router.post(
    '/logout',
    authenticateUser,
    logout
)

router.get(
    '/home',
    authenticateUser,
    home
)


async function loginAttempt(req, res) {

    let result = await authService.login(req);

    console.log(result);

    if (result.error == 1) {
        console.log('123');
        // res.redirect("/login")
    } else {

        console.log('Nazir');
        res.redirect("/home")
    }

    return 
}



module.exports = router
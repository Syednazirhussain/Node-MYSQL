const { handleError } = require('../helper/utils')
const authService = require('./../services/auth.service')

exports.login = async (req, res) => {

    try {

        if (req.session.username === undefined || req.session.username === null) {

            res.setHeader('Content-Type', 'text/html')
            
            if (req.session.errors !== undefined && req.session.errors !== null) {
                console.log(req.session.errors)
                res.render('auth/login', { error: req.session.errors })
                delete req.session.errors 
            } else {
                res.render('auth/login')
            }
            
          } else {
            res.redirect('/home')
        }
        
    } catch (error) {

        handleError(res, error)
    }
}

exports.loginAttempt = async (req, res) => {

    try {

        let result = await authService.login(req);

        if (result.error == 1) {

            req.session.errors  = result.message
            res.redirect("/login")
        } else {

            req.flash('info', 'Logged In Successfully.');
            res.redirect("/home")
        }
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

exports.forgetPassword = async (req, res) => {

    if (req.method == "GET") {

        res.render('auth/forget-password')
    } else {

        console.log(req.body);
    }
}
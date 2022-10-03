const { handleError } = require('../helper/utils')
const authService = require('./../services/auth.service')
const { User } = require('./../model/models')

exports.login = async (req, res) => {

    try {
        if (req.session.username === undefined || req.session.username === null) {

            res.setHeader('Content-Type', 'text/html')
            
            if (req.session.errors !== undefined && req.session.errors !== null) {
                console.log(req.session.errors)
                res.render('auth/login', { error: req.session.errors })
                delete req.session.errors 
            } else {
                res.render('auth/login', { success: req.flash('success') })
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

            req.session.errors = result.message
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

exports.forgetPasswordView = async (req, res) => {
    res.render('auth/forget-password', { message: req.flash('message'), success: req.flash('success') }) 
}

exports.forgetPasswordPost = async (req, res) => {

    let result = await authService.forgetPassword(req);
    
    if (result.error == 1) {
        req.flash('message', result.message);
        res.redirect("/forget-password");
    } else {
        req.flash('success', result.success);
        res.redirect("/forget-password");
    }
}

// Reset Password View
exports.resetPasswordView = async (req, res ) => {
    let result = await authService.resetPasswordView(req);

    if (result.error == 1) {
        req.flash('message',result.message);
        res.redirect("/forget-password");
    } else {
        res.render('auth/reset-password',{ email : result.email, val: result.val });
    }

}

// Reset Password View
exports.resetPassword = async (req, res ) => {

    let result = await authService.resetPassword(req);

    if (result.error == 1) {
        req.flash('message', result.message);
        return res.redirect('auth/reset-password', {email : result.email});
    } else {
        if (req.body.val == 0) {
            req.flash('success', result.success);
            return res.redirect("/login");
        } else {
            return res.redirect("/reset-password/success");
        }
    }
}

exports.resetPasswordSuccess = async (req, res) => {
    return res.render('auth/success');
}
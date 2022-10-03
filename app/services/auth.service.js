const { User } = require('./../model/models')
const { checkPassword } = require('./../middleware/auth')
const { v4: uuidv4 } = require('uuid');
const mailer = require("../helper/mailer");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { globalAgent } = require('http');
const bcrypt = require('bcrypt-nodejs');

async function login(req) {
    try {

        console.log(req.body);

        const { email, password } = req.body

        const userExist = await User.findOne({
            where: {
                email: email
            }
        })

        if (!userExist) {
            return { error: 1, message: 'Email not exist' }
        }

        let isMatch = await checkPassword(password, userExist)

        if (!isMatch) {
            return { error: 1, message: 'Invalid password' }
        }

        req.session.id = userExist.id
        req.session.name = userExist.name
        req.session.username = userExist.username
        req.session.email = userExist.email

        console.log(req.session)

        return { error: 0, message: 'Login Successfull' }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function forgetPassword(req) {
    try {

        const email = req.body.email;

        const userExist = await User.findOne({
            where: {
                email: email
            }
        })

        if (userExist) {
            let token = new Buffer(uuidv4());
            let base64Token = token.toString('base64');

            const tokenUpdate = await User.update({ token: base64Token }, {
                where: {
                    email: email
                }
            });

            let buff = new Buffer(email);
            let base64data = buff.toString('base64');

            // Html email body
            let link = `${process.env.APP_BASE_PATH}reset-password/${base64Token}/${base64data}/0`;

            var html = fs.readFileSync(process.cwd()+'/views/emailresponse/email.ejs').toString();
            
            html = html.replace('username', userExist.name);
            html = html.replace('#Link', link);

            // Send confirmation email
            await mailer.send(
                process.env.FROM_EMAIL,
                email,
                "Reset Password Link",
                html
            );

            return {
                error: 0, success: 'We have e-mailed your password reset link!. Please also check Junk/Spam folder as well.!'
            }
        } else {
            return {
                error: 1, message: 'Email does not exist.'
            }
        }

    } catch (error) {
        return { error: 1, message: error.message }
    }
}

async function resetPasswordView(req, res) {
    try {
        let buff = new Buffer(req.params.email, 'base64');
        let email = buff.toString('ascii');

        const rec = await User.findOne({
            where: {
                email: email,
                token: req.params.token
            }
        })

        if (rec) {
            return {
                email: email,
                val: req.params.val
            };

        } else {
            return {
                error: 1, message: "Link has been expired, Please select forgot password again."
            }
        }
    } catch(error) {
        return { error: 1, message: error.message }
    }
}

async function resetPassword(req, res) {
    try {
        var user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            bcrypt.hash(req.body.password, null, null, function (err, hash) {
                User.update({ password: hash }, {
                    where: {
                        email: req.body.email
                    }
                });
            });

            await User.update({ token: null }, {
                where: {
                    email: req.body.email
                }
            });

            return {
               error: 0, success: "Password reset successfully. Please enter your credentials and login"
            };

        } else {
            return {
                error: 1, message: "Email does not exist."
            }
        }
    } catch (error) {
            return { error: 1, message: error.message, email: req.body.email }
        }
    }

module.exports = {
    login,
    forgetPassword,
    resetPasswordView,
    resetPassword
};
const { User } = require('./../model/models')
const { checkPassword } = require('./../middleware/auth')

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

module.exports = {
    login
};
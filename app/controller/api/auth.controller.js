const bcrypt = require('bcrypt-nodejs')
const { StatusCodes } = require('http-status-codes')

const { User } = require('../../model/models')
const { checkPassword } = require('../../middleware/auth')

const { createJWT } = require('../../helper/jwt')
const { asyncWrapper, handleError } = require('../../helper/utils')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const mailer = require("../../helper/mailer");

exports.register = asyncWrapper(async (req, res) => {
  
  try {

      let user = await User.findOne({
        where: {
          email: req.body.email
        }
      })

      if (user) {
        res.status(StatusCodes.NOT_FOUND).json({ "message": "User already exists" })
      }

      let data = { ...req.body }

      let hash = bcrypt.hashSync(data.password)

      data.password = hash

      const newUser = await User.create(data);

      let tokenUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
      
      let jwtToken = createJWT({ payload: tokenUser })

      let payload = {
        token: jwtToken,
        user: tokenUser
      }

      const oneDay = 1000 * 60 * 60 * 24;

      res.cookie('token', jwtToken, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      })

      return res.status(StatusCodes.CREATED).json(payload)

  } catch (error) {

    handleError(res, error)
  }
})

exports.me = asyncWrapper(async (req, res) => {
  
  try {

    res.status(StatusCodes.ACCEPTED).json(req.user)
  } catch (error) {
    
    handleError(res, error)
  }
})

exports.login = asyncWrapper(async (req, res) => {
  
  try {

    const { email, password } = req.body

    const userExist = await User.findOne({
      where: {
        email: email
      }
    })

    if (!userExist) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Email not found' })
    }

    let isMatch = await checkPassword(password, userExist)

    if (!isMatch) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Invalid Password' })
    }

    let tokenUser = {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email
    }

    /*
      // Create Token
      jwt.sign({ tokenUser }, process.env.JWT_SECRET, { expireIn: '30s' }, (err, token) => {
        res.json({
          token
        })
      })

      // Verify Token
      jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403)
        } else {
          res.json({
            message: 'Post Created',
            authData
          })
        }
      })
    */
    
    let jwtToken = createJWT({ payload: tokenUser })

    let payload = {
      token: jwtToken,
      user: tokenUser
    }

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', jwtToken, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    })

    return res.status(StatusCodes.OK).json(payload)

  } catch (error) {
    
    handleError(res, error)
  }
})


exports.logout = asyncWrapper(async (req, res) => {
  
  try {

    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000)
    })

    res.status(StatusCodes.OK).json({ msg: 'User logged out!' });

  } catch (error) {
    
    handleError(res, error)
  }
})

exports.forgetPassword = asyncWrapper(async (req, res) => {
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
          let link = `${process.env.APP_BASE_PATH}reset-password/${base64Token}/${base64data}/1`;

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

          return res.status(StatusCodes.OK).json({ msg: 'We have e-mailed your password reset link!. Please also check Junk/Spam folder as well.!' });
      } else {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Email does not exist' })
      }

  } catch (error) {
      handleError(res, error)
  }  
});
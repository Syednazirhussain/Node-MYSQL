const bcrypt = require('bcrypt-nodejs')
const { StatusCodes } = require('http-status-codes')

const { User } = require('../model/models')
const { checkPassword } = require('./../middleware/auth')

const { createJWT } = require('./../helper/jwt')
const { asyncWrapper, handleError } = require('../helper/utils')


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
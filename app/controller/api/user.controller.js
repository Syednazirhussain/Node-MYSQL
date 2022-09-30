const { User, Post, Comment } = require('../../model/models')

const utils = require('../../helper/utils')
const asyncWrapper = require('../../middleware/async')


exports.getUsers = asyncWrapper(async (req, res) => {
  
  try {

      let data = await User.findAll({
        // include: Post
        include: {
          model: Post,
          include: {
            model: Comment
          }
        }
      })

      // let data = await Post.findAll({
      //   include: User
      // })

      // let data = await Post.findAll({
      //   include: Comment
      // })

      // let payload = {
      //   total: data.length,
      //   data: data
      // }

      // return res.status(200).json(payload)


      return res.status(200).json(data)
  } catch (error) {

    utils.handleError(res, error)
  }

})


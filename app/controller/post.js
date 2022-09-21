const { User, Post, Comment } = require('../model/models')

const utils = require('../middleware/utils')
const asyncWrapper = require('../middleware/async')


exports.index = asyncWrapper(async (req, res) => {
  
  try {

      let data = await Post.findAll({
        include: [User, Comment]
      })

      let payload = {
        total: data.length,
        data: data
      }

      return res.status(200).json(payload)

  } catch (error) {

    utils.handleError(res, error)
  }

})

const { User } = require('../model/models')

const utils = require('../middleware/utils')
const asyncWrapper = require('../middleware/async')


exports.register = asyncWrapper(async (req, res) => {
  
    try {
        return res.status(200).json(req.body)
    } catch (error) {
  
      utils.handleError(res, error)
    }
  
  })
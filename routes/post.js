const express = require('express')
const router = express.Router()

const {
  index
} = require('../app/controller/post')

router.route('/').get(index)

module.exports = router

const express = require('express')
const router = express.Router()

const {
  index
} = require('../app/controller/user')

router.route('/').get(index)

module.exports = router

const express = require('express')
const router = express.Router()

const {
  index
} = require('../app/controller/user')

// router.route('/').get(index)

// router.post(
//   '/get/profile/items',
//   trimRequest.all,
//   validate.items,
//   controller.getProfileItems
// )

router.route('/').get(index)

module.exports = router

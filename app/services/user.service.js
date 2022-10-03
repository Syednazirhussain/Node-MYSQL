const { User, RoleUser, Role } = require('./../model/models')

async function index(req) {

    try {

      let skip = 0
      if (req.query.page > 1) {
        skip = (req.query.page * 10)
      }

      let results = await User.findAndCountAll({
        include: {
          model: RoleUser,
          include: {
            model: Role
          }
        },
        order: [
          ['id', 'DESC'],
        ],
        limit: 10, 
        offset: skip
      })

      const itemCount = results.count
      const pageCount = Math.ceil(results.count / 10)

      let payload = {
        users: results.rows,
        pageCount,
        itemCount
      }

      console.log(payload)

      return { error: 0, payload: payload }

    } catch (error) {
      return { error: 1, message: error.message }
    }


}

module.exports = {
    index
}

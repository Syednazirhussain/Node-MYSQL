const { User, RoleUser, Role } = require('./../model/models')

async function index({ params }) {

    try {

      // let users = await User.findAll({
      //   include: {
      //     model: Post,
      //     include: {
      //       model: Comment
      //     }
      //   },
      //   limit: 2
      // })

      let users = await User.findAll({
        include: {
          model: RoleUser,
          include: {
            model: Role
          }
        },
        order: [
          ['id', 'DESC'],
        ],
        // limit: 10,
      })


      console.log(users)

      return { error: 0, payload: { users: users } }

    } catch (error) {

        return { error: 1, message: error.message }
    }


}

module.exports = {
    index
}

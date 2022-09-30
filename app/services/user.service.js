const { User, Post, Comment } = require('./../model/models')

async function index({ params }) {

    try {

        let users = await User.findAll({
            include: {
              model: Post,
              include: {
                model: Comment
              }
            }
          })

          return { error: 0, payload: { users: users } }

    } catch (error) {

        return { error: 1, message: error.message }
    }


}

module.exports = {
    index
}

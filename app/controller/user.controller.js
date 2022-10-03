const { handleError } = require('./../helper/utils')
const userServices = require('./../services/user.service')

exports.getUsers = async (req, res) => {

    try {

        // let result = await userServices.index({ params: req.params })
        let result = await userServices.index(req)
        
        if (result.error == 1) {
            req.flash('error', result.message)
            res.render('user/index')            
        } else {
            req.flash('success', 'User list fetch successfull')
            res.render('user/index', {
                users: result.payload.users,
                pageCount: result.payload.pageCount
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}
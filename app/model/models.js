const Sequelize = require('sequelize');

exports.User = sequelize.define('users', {
    name: {type: Sequelize.STRING},  
    username: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
    email_verified_at: {type: Sequelize.DATE},           
    password: {type: Sequelize.STRING},
    token: {type: Sequelize.STRING},
    created_at:{type: Sequelize.DATE},
    updated_at:{type: Sequelize.DATE}       
}, {
    tableName : "users"
})

exports.Post = sequelize.define('posts', {
    title: {type: Sequelize.STRING},  
    user_id: {type: Sequelize.NUMBER},
    created_at:{type: Sequelize.DATE},
    updated_at:{type: Sequelize.DATE}       
}, {
    tableName : "posts"
})

exports.RoleUser = sequelize.define('role_users', {
    user_id: {type: Sequelize.NUMBER},
    role_id: {type: Sequelize.NUMBER},
    created_at:{type: Sequelize.DATE},
    updated_at:{type: Sequelize.DATE}       
}, {
    tableName : "role_users"
})

exports.Role = sequelize.define('roles', {
    name: {type: Sequelize.NUMBER},
    created_at:{type: Sequelize.DATE},
    updated_at:{type: Sequelize.DATE}       
}, {
    tableName : "roles"
})

exports.Comment = sequelize.define('comments', {
    text: {type: Sequelize.STRING},  
    post_id: {type: Sequelize.NUMBER},
    created_at:{type: Sequelize.DATE},
    updated_at:{type: Sequelize.DATE}       
}, {
    tableName : "comments"
})

this.Post.belongsTo(this.User, { foreignKey: "user_id" })
this.User.hasMany(this.Post, { foreignKey: "user_id" })
this.Post.hasMany(this.Comment, { foreignKey: "post_id" })

this.User.hasMany(this.RoleUser, { foreignKey: "user_id" })
this.RoleUser.belongsTo(this.Role, { foreignKey: "role_id" })

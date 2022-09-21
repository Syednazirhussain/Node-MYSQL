const Sequelize = require('sequelize');

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

var password = DB_PASSWORD ? DB_PASSWORD : null;

module.exports = sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD, {
        logging: console.log,
          dialect: 'mysql',
        define: {
            timestamps: false
        }
    }
)

sequelize
  .authenticate()
  .then(function(err) {

    console.log('****************************')
    console.log('*    Starting Server')
    console.log(`*    Port: ${process.env.PORT || 3000}`)
    console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`*    Database: ${process.env.DB_NAME}`)
    console.log('Connection has been established successfully.');

  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

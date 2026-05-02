const { Sequelize } = require("sequelize")

require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
   logging:false,

})

    ; (async () => {
        try {
          await  sequelize.authenticate()
            console.log("db connected")
        } catch (error) {
            console.log("db error ", error)
        }
})()

module.exports = sequelize
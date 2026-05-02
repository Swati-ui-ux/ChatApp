const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db-connection")

const Messages = sequelize.define("message", {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull:false,
    }

}, { timestamps: true })

module.exports = Messages
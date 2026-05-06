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
    },
    room: {
    type: DataTypes.STRING,
  },
  chatType: {
    type: DataTypes.STRING,
  }

}, { timestamps: true })

module.exports = Messages
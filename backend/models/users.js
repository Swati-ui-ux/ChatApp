const sequelize = require("../utils/db-connection")
const { DataTypes} = require("sequelize")
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    resetToken: {
        type: DataTypes.STRING,
        
    }, resetTokenExpire: {
        type: DataTypes.DATE,
        
    }
    
}, { timestamps: true })

module.exports = User 
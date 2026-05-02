const Message = require("./message")
const Users = require("./users")

Users.hasMany(Message)
Message.belongsTo(Users)

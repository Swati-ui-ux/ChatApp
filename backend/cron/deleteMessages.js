const cron = require("node-cron");
const { Op } = require("sequelize");
const Message = require("../models/message");

// har 1 ghante me check karega
cron.schedule("0 * * * *", async () => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const deleted = await Message.destroy({
      where: {
        createdAt: {
          [Op.lt]: twoDaysAgo
        }
      }
    });

    console.log("Deleted old messages:", deleted);
  } catch (err) {
    console.log("Cron error:", err);
  }
});
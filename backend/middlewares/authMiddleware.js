const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log("DECODED:", decoded); 

    req.user = decoded; 

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "invalid token" });
  }
};

module.exports = authMiddleware;
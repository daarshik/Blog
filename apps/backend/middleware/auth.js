const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expired. Please refresh." });
  }
};

module.exports = { verifyJWT };

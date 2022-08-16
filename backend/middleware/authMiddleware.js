const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const pool = require("../startup/db");

const adminProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get header token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Get user verified token
      req.user = await pool.query("SELECT * FROM admins WHERE admin_id = $1", [verifiedToken.id]);

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Token not found");
  }
});

module.exports = { adminProtect };

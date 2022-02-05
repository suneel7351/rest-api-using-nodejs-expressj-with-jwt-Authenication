const jwt = require("jsonwebtoken");
require("dotenv").config();
function fetuser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECERET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "please authenticate using a valid token" });
  }
}

module.exports = fetuser;

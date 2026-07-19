const jwt = require("jsonwebtoken");

function requireJwt(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "A Bearer token is required",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      error: "The token is invalid or expired",
    });
  }
}

module.exports = requireJwt;

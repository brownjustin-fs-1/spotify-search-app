const crypto = require("crypto");
const AuthSession = require("../models/AuthSession");

async function validateSession(req, res, next) {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(req.token)
      .digest("hex");

    const session = await AuthSession.findOne({
      where: {
        tokenHash,
      },
    });

    if (!session || session.expiresAt <= new Date()) {
      return res.status(401).json({
        authenticated: false,
        loginAgain: true,
        error: "The authentication session is no longer valid",
      });
    }

    req.authSession = session;
    next();
  } catch (error) {
    console.error("Could not validate authentication session:", error.message);

    return res.status(500).json({
      authenticated: false,
      loginAgain: true,
      error: "The authentication session could not be validated",
    });
  }
}

module.exports = validateSession;

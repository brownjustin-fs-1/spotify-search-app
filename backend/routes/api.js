const express = require("express");
const requireJwt = require("../middleware/requireJwt");
const validateSession = require("../middleware/validateSession");

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({
    message: "JB Music Search API is available",
  });
});

router.get("/session", requireJwt, validateSession, (req, res) => {
  res.status(200).json({
    authenticated: true,
    loginAgain: false,
    message: "The authentication session is valid",
    expiresAt: req.authSession.expiresAt,
  });
});

router.get("/profile", requireJwt, validateSession, (req, res) => {
  res.status(200).json({
    message: "Protected profile retrieved",
    user: {
      googleId: req.user.googleId,
      displayName: req.user.displayName,
      email: req.user.email,
    },
  });
});

module.exports = router;

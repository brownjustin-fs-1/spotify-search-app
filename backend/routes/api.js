const express = require("express");
const requireJwt = require("../middleware/requireJwt");

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({
    message: "JB Music Search API is available",
  });
});

router.get("/profile", requireJwt, (req, res) => {
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

const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const AuthSession = require("../models/AuthSession");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: false,
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        {
          googleId: req.user.googleId,
          displayName: req.user.displayName,
          email: req.user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          jwtid: crypto.randomUUID(),
        },
      );

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await AuthSession.create({
        googleId: req.user.googleId,
        displayName: req.user.displayName,
        email: req.user.email,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      res.json({
        message: "Google authentication successful",
        token,
        user: req.user,
      });
    } catch (error) {
      console.error("Could not save authentication session:", error.message);

      res.status(500).json({
        error: "Authentication succeeded, but the session could not be saved",
      });
    }
  },
);

router.get("/failure", (req, res) => {
  res.status(401).json({
    error: "Google authentication failed",
  });
});

module.exports = router;

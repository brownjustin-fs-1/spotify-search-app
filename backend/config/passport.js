const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

passport.use(
  new GoogleStrategy(
    googleOptions,
    (_accessToken, _refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value || null,
      };

      return done(null, user);
    },
  ),
);

module.exports = passport;

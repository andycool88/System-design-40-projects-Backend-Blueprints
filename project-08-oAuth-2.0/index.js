// Import Express framework
const express = require("express");
// Import passport for OAuth
const passport = require("passport");
// Import Google OAuth strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Create an Express app
const app = express();

// Configure passport with Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: "GOOGLE_CLIENT_ID",        // Replace with your Google client ID
  clientSecret: "GOOGLE_CLIENT_SECRET",// Replace with your Google client secret
  callbackURL: "/auth/google/callback" // Redirect URL after login
}, (accessToken, refreshToken, profile, done) => {
  // Here you would save user info to DB
  return done(null, profile);
}));

// Initialize passport
app.use(passport.initialize());

// Route to start Google login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google login
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // If successful, show user profile
    res.json({ message: "Logged in with Google" });
  }
);

// Start the server
app.listen(9100, () => console.log("OAuth API running on port 9100"));

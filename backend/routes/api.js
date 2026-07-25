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

router.get("/music/search", requireJwt, validateSession, async (req, res) => {
  const searchTerm = String(req.query.q || "").trim();

  if (searchTerm.length < 2) {
    return res.status(400).json({
      error: "Enter at least two characters to search for music",
    });
  }

  try {
    const searchParameters = new URLSearchParams({
      term: searchTerm,
      media: "music",
      entity: "song",
      country: "US",
      limit: "24",
    });

    const response = await fetch(
      `https://itunes.apple.com/search?${searchParameters.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`iTunes returned status ${response.status}`);
    }

    const data = await response.json();

    const tracks = data.results
      .filter((result) => result.kind === "song")
      .map((result) => ({
        id: result.trackId,
        trackName: result.trackName,
        artistName: result.artistName,
        albumName: result.collectionName,
        artworkUrl: result.artworkUrl100,
        genre: result.primaryGenreName,
        durationMs: result.trackTimeMillis,
        trackUrl: result.trackViewUrl,
        releaseDate: result.releaseDate,
        isExplicit: result.trackExplicitness === "explicit",
      }));

    return res.status(200).json({
      query: searchTerm,
      count: tracks.length,
      tracks,
    });
  } catch (error) {
    console.error("Music search failed:", error.message);

    return res.status(502).json({
      error: "Music search is temporarily unavailable",
    });
  }
});

module.exports = router;

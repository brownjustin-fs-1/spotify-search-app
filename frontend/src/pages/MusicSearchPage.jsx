import { useState } from "react";
import AppHeader from "../components/AppHeader";
import TrackCard from "../components/TrackCard";
import { searchMusic } from "../services/api";

function MusicSearchPage({ token, user, onSignOut }) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [searchStatus, setSearchStatus] = useState("initial");
  const [searchError, setSearchError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSearchError("Enter at least two characters to search.");
      setSearchStatus("error");
      return;
    }

    setSearchStatus("loading");
    setSearchError("");

    try {
      const data = await searchMusic(token, trimmedQuery);
      setTracks(data.tracks);
      setSearchStatus("success");
    } catch (error) {
      setTracks([]);
      setSearchError(error.message);
      setSearchStatus("error");
    }
  }

  return (
    <div className="search-app">
      <AppHeader user={user} onSignOut={onSignOut} />

      <main className="search-content">
        <section className="search-hero">
          <p className="section-label">DISCOVER SOMETHING NEW</p>

          <h1>What do you want to hear?</h1>

          <p>
            Search for a song, artist, or album and explore matching tracks.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <label className="screen-reader-only" htmlFor="music-search">
              Search for music
            </label>

            <input
              id="music-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs, artists, or albums"
              autoComplete="off"
            />

            <button type="submit" disabled={searchStatus === "loading"}>
              {searchStatus === "loading" ? "Searching..." : "Search"}
            </button>
          </form>
        </section>

        <section className="results-section" aria-live="polite">
          {searchStatus === "initial" && (
            <div className="results-message">
              <span aria-hidden="true">♫</span>
              <h2>Your next favorite song is waiting.</h2>
              <p>Start with an artist, album, or song title.</p>
            </div>
          )}

          {searchStatus === "loading" && (
            <div className="results-message">
              <span className="loading-note" aria-hidden="true">
                ♪
              </span>
              <h2>Searching the catalog...</h2>
            </div>
          )}

          {searchStatus === "error" && (
            <div className="results-message results-error" role="alert">
              <h2>We could not complete that search.</h2>
              <p>{searchError}</p>
            </div>
          )}

          {searchStatus === "success" && tracks.length === 0 && (
            <div className="results-message">
              <h2>No matching tracks were found.</h2>
              <p>Try another artist, album, or song title.</p>
            </div>
          )}

          {searchStatus === "success" && tracks.length > 0 && (
            <>
              <div className="results-heading">
                <div>
                  <p className="section-label">SEARCH RESULTS</p>
                  <h2>
                    {tracks.length} {tracks.length === 1 ? "track" : "tracks"}{" "}
                    found
                  </h2>
                </div>
              </div>

              <div className="track-grid">
                {tracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>

              <p className="itunes-credit">
                Music information and artwork provided courtesy of iTunes.
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default MusicSearchPage;

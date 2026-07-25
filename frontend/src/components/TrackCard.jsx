function formatDuration(durationMs) {
  if (!durationMs) {
    return "";
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function TrackCard({ track }) {
  return (
    <article className="track-card">
      {track.artworkUrl ? (
        <img
          className="track-artwork"
          src={track.artworkUrl}
          alt={`Cover artwork for ${track.albumName}`}
          loading="lazy"
        />
      ) : (
        <div className="track-artwork track-artwork-placeholder">♪</div>
      )}

      <div className="track-details">
        <div className="track-heading">
          <div>
            <h2>{track.trackName}</h2>
            <p className="track-artist">{track.artistName}</p>
          </div>

          <span className="track-duration">
            {formatDuration(track.durationMs)}
          </span>
        </div>

        <p className="track-album">{track.albumName}</p>

        <div className="track-footer">
          <span>{track.genre || "Music"}</span>

          {track.isExplicit && <span className="explicit-label">E</span>}

          <a
            className="track-link"
            href={track.trackUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on iTunes
          </a>
        </div>
      </div>
    </article>
  );
}

export default TrackCard;

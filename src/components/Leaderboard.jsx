import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/client.js';

const medal = (i) => ['🥇', '🥈', '🥉'][i] || i + 1;

export default function Leaderboard() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    getLeaderboard(20).then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Top <em>typists</em></h1>
        <p>The best run from every registered typist, ranked by speed.</p>
      </div>

      {rows === null && <div className="empty">Loading scores…</div>}
      {rows && rows.length === 0 && <div className="empty">No scores yet — be the first to set a record.</div>}

      {rows && rows.length > 0 && (
        <div className="board">
          <div className="board__head">
            <span>#</span><span>Typist</span><span>Best WPM</span><span>Acc.</span>
            <span className="board__dur">Length</span>
          </div>
          {rows.map((r, i) => (
            <div className="board__row" key={r._id || i}>
              <span className={`board__rank ${i < 3 ? 'board__rank--medal' : ''}`}>{medal(i)}</span>
              <span className="board__name">{r.username}</span>
              <span className="board__wpm">{r.wpm}</span>
              <span>{r.accuracy}%</span>
              <span className="board__dur">{r.durationSec}s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

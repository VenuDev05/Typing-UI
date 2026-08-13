import { useEffect, useState } from 'react';
import { getMyStats } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

// A tiny inline bar chart of recent WPM — no chart library needed.
function WpmChart({ runs }) {
  const data = [...runs].reverse().slice(-20); // oldest -> newest
  if (data.length < 2) {
    return <div className="empty">Take a few tests to see your progress chart.</div>;
  }
  const max = Math.max(...data.map((r) => r.wpm), 10);
  return (
    <div className="chart">
      <div className="chart__bars">
        {data.map((r, i) => (
          <div className="chart__bar-wrap" key={r._id || i} title={`${r.wpm} WPM · ${r.accuracy}%`}>
            <div className="chart__bar" style={{ height: `${(r.wpm / max) * 100}%` }}>
              <span className="chart__val">{r.wpm}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chart__axis"><span>Older</span><span>WPM per test</span><span>Newer</span></div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyStats().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="empty">Could not load your dashboard: {error}</div>;
  if (!data) return <div className="empty">Loading your dashboard…</div>;

  const { summary, runs } = data;

  return (
    <div>
      <div className="dash-head">
        <div>
          <span className="eyebrow">User dashboard</span>
          <h1 className="dash-title">Welcome back, {user.displayName || user.username}</h1>
        </div>
        <button className="btn btn--brand" onClick={() => onNavigate('test')}>Take a test →</button>
      </div>

      <div className="kpi-row">
        <div className="kpi"><div className="kpi__value brand">{summary.bestWpm}</div><div className="kpi__label">Best WPM</div></div>
        <div className="kpi"><div className="kpi__value">{summary.avgWpm}</div><div className="kpi__label">Average WPM</div></div>
        <div className="kpi"><div className="kpi__value">{summary.avgAccuracy}%</div><div className="kpi__label">Avg accuracy</div></div>
        <div className="kpi"><div className="kpi__value">{summary.tests}</div><div className="kpi__label">Tests taken</div></div>
      </div>

      <div className="panel">
        <h2 className="panel__title">Progress</h2>
        <WpmChart runs={runs} />
      </div>

      <div className="panel">
        <h2 className="panel__title">Recent tests</h2>
        {runs.length === 0 ? (
          <div className="empty">No tests yet — take your first one!</div>
        ) : (
          <div className="table">
            <div className="table__head">
              <span>Date</span><span>WPM</span><span>Accuracy</span><span>Level</span><span>Errors</span>
            </div>
            {runs.slice(0, 15).map((r) => (
              <div className="table__row" key={r._id}>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                <span className="mono brand">{r.wpm}</span>
                <span className="mono">{r.accuracy}%</span>
                <span className="tag">{r.difficulty}</span>
                <span className="mono">{r.errors}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

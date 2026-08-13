import { useEffect, useState } from 'react';
import { getAdminToday } from '../api/client.js';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} hr ago`;
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null); // expanded userId

  useEffect(() => {
    getAdminToday().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="admin"><div className="empty">Could not load: {error}</div></div>;
  if (!data) return <div className="admin"><div className="empty">Loading today’s activity…</div></div>;

  const today = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="admin">
      <div className="admin__bar">
        <div>
          <span className="admin__eyebrow">● Admin control panel</span>
          <h1 className="admin__title">Today’s activity</h1>
          <p className="admin__date">{today}</p>
        </div>
        <button className="admin__refresh" onClick={() => { setData(null); getAdminToday().then(setData); }}>
          ↻ Refresh
        </button>
      </div>

      <div className="admin__kpis">
        <div className="admin__kpi">
          <div className="admin__kpi-val">{data.totals.activeToday}</div>
          <div className="admin__kpi-label">Users tested today</div>
        </div>
        <div className="admin__kpi">
          <div className="admin__kpi-val">{data.totals.testsToday}</div>
          <div className="admin__kpi-label">Tests today</div>
        </div>
        <div className="admin__kpi">
          <div className="admin__kpi-val">{data.totals.avgWpmToday}</div>
          <div className="admin__kpi-label">Avg WPM today</div>
        </div>
        <div className="admin__kpi">
          <div className="admin__kpi-val">{data.totals.registeredUsers}</div>
          <div className="admin__kpi-label">Registered users</div>
        </div>
      </div>

      <h2 className="admin__section">Users who tested today</h2>

      {data.users.length === 0 ? (
        <div className="admin__empty">No one has taken a test yet today.</div>
      ) : (
        <div className="admin__list">
          {data.users.map((u) => (
            <div className={`admin__user ${open === u.userId ? 'is-open' : ''}`} key={u.userId}>
              <button className="admin__user-head" onClick={() => setOpen(open === u.userId ? null : u.userId)}>
                <span className="admin__avatar">{u.username[0].toUpperCase()}</span>
                <span className="admin__user-name">
                  {u.username}
                  <small>last active {timeAgo(u.lastActive)}</small>
                </span>
                <span className="admin__chip">{u.tests} test{u.tests > 1 ? 's' : ''}</span>
                <span className="admin__metric"><b>{u.bestWpm}</b><small>best wpm</small></span>
                <span className="admin__metric"><b>{u.avgAccuracy}%</b><small>avg acc</small></span>
                <span className="admin__caret">{open === u.userId ? '▲' : '▼'}</span>
              </button>

              {open === u.userId && (
                <div className="admin__runs">
                  <div className="admin__runs-head">
                    <span>Time</span><span>WPM</span><span>Accuracy</span>
                    <span>Errors</span><span>Level</span><span>Length</span>
                  </div>
                  {u.runs.map((r) => (
                    <div className="admin__run" key={r.id}>
                      <span>{fmtTime(r.at)}</span>
                      <span className="mono admin__wpm">{r.wpm}</span>
                      <span className="mono">{r.accuracy}%</span>
                      <span className="mono">{r.errors}</span>
                      <span className="admin__tag">{r.difficulty}</span>
                      <span className="mono">{r.durationSec}s</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

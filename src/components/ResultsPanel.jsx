import { levelFor } from '../utils/stats.js';

export default function ResultsPanel({ result, canCertify, onRetry, onCertificate, onLogin }) {
  const { wpm, rawWpm, accuracy, errors, charsTyped, wrong = [] } = result;
  const rank = levelFor(wpm, accuracy);

  return (
    <div className="result-card">
      <div className="result-rank-badge">{rank}</div>

      <div className="result-grid">
        <div className="big-stat">
          <div className="big-stat__value brand">{wpm}</div>
          <div className="big-stat__label">Net WPM</div>
        </div>
        <div className="big-stat">
          <div className="big-stat__value">{accuracy}%</div>
          <div className="big-stat__label">Accuracy</div>
        </div>
        <div className="big-stat">
          <div className="big-stat__value">{rawWpm}</div>
          <div className="big-stat__label">Raw WPM</div>
        </div>
        <div className="big-stat">
          <div className="big-stat__value">{errors}</div>
          <div className="big-stat__label">Errors</div>
        </div>
      </div>

      <p className="errors-note">You typed <span className="mono">{charsTyped}</span> characters.</p>

      {wrong.length > 0 && (
        <p className="errors-note">
          Most-missed keys (you typed the red one instead):{' '}
          {wrong.slice(0, 8).map((w, i) => (
            <span key={i}>
              <span className="mono">{w.expected === ' ' ? '␣' : w.expected}</span>
              {' → '}
              <span className="wrong-chip">{w.actual === ' ' ? '␣' : w.actual}</span>
            </span>
          ))}
        </p>
      )}

      <div className="btn-row">
        <button className="btn btn--brand" onClick={onRetry}>↻ Try again</button>
        {canCertify
          ? <button className="btn btn--gold" onClick={onCertificate}>🏆 Get certificate</button>
          : <button className="btn btn--ghost" onClick={onLogin}>Sign in to save & certify</button>}
      </div>
    </div>
  );
}

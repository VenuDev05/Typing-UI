import { useState } from 'react';
import TypingTest from '../components/TypingTest.jsx';
import ResultsPanel from '../components/ResultsPanel.jsx';
import CertificateModal from '../components/CertificateModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { saveResult } from '../api/client.js';

const DIFFS = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];
const DURATIONS = [15, 30, 60];

export default function TestPage({ onNavigate }) {
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(60);
  const [sound, setSound] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const [saveNote, setSaveNote] = useState('');

  const handleFinish = async (stats) => {
    setResult(stats);
    if (user) {
      try {
        await saveResult({
          wpm: stats.wpm, rawWpm: stats.rawWpm, accuracy: stats.accuracy,
          durationSec: stats.durationSec, charsTyped: stats.charsTyped,
          errors: stats.errors, difficulty: stats.difficulty,
        });
        setSaveNote('Saved to your dashboard.');
      } catch (err) {
        setSaveNote(`Could not save: ${err.message}`);
      }
    } else {
      setSaveNote('Sign in to save this run and earn a certificate.');
    }
  };

  const retry = () => { setResult(null); setSaveNote(''); setRunKey((k) => k + 1); };

  if (result) {
    return (
      <>
        <div className="hero">
          <h1>Test complete</h1>
          {saveNote && <p>{saveNote}</p>}
        </div>
        <ResultsPanel
          result={result}
          canCertify={!!user}
          onRetry={retry}
          onCertificate={() => setShowCert(true)}
          onLogin={() => onNavigate('login')}
        />
        {showCert && user && (
          <CertificateModal
            result={result}
            username={user.displayName || user.username}
            onClose={() => setShowCert(false)}
          />
        )}
      </>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1>Typing <em>test</em></h1>
        <p>Pick a length and difficulty, then type until the timer runs out.</p>
      </div>

      <div className="controls">
        <div className="segment" role="group" aria-label="Test length">
          {DURATIONS.map((d) => (
            <button key={d} className={duration === d ? 'on' : ''} onClick={() => setDuration(d)}>{d}s</button>
          ))}
        </div>
        <div className="segment" role="group" aria-label="Difficulty">
          {DIFFS.map((d) => (
            <button key={d.id} className={difficulty === d.id ? 'on' : ''} onClick={() => setDifficulty(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <label className="toggle">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
          🔊 Tik sound
        </label>
      </div>

      <TypingTest
        key={runKey}
        sound={sound}
        difficulty={difficulty}
        duration={duration}
        onFinish={handleFinish}
      />
    </div>
  );
}

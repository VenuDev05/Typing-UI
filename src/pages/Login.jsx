import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ onNavigate }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', displayName: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.username, form.password);
      else await register(form.username, form.password, form.displayName || form.username);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setError(''); }}>
            Sign in
          </button>
          <button className={mode === 'register' ? 'on' : ''} onClick={() => { setMode('register'); setError(''); }}>
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            Username
            <input value={form.username} onChange={set('username')} placeholder="e.g. Venu"
              autoComplete="username" minLength={3} required />
          </label>

          {mode === 'register' && (
            <label>
              Display name
              <input value={form.displayName} onChange={set('displayName')} placeholder="Shown on the leaderboard" />
            </label>
          )}

          <label>
            Password
            <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn--brand btn--block" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

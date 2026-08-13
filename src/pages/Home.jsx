import { useAuth } from '../context/AuthContext.jsx';

export default function Home({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div>
      <section className="landing">
        <span className="eyebrow">Learn · Practice · Improve</span>
        <h1 className="landing__title">
          Type faster,<br /><em>one tik at a time</em>
        </h1>
        <p className="landing__sub">
          A focused typing tutor with timed tests, live speed and accuracy, an endless
          paragraph that keeps you moving, and certificates you can download and share.
        </p>
        <div className="btn-row landing__cta">
          <button className="btn btn--brand btn--lg" onClick={() => onNavigate('test')}>
            Start a test →
          </button>
          {!user && (
            <button className="btn btn--ghost btn--lg" onClick={() => onNavigate('login')}>
              Create an account
            </button>
          )}
        </div>
      </section>

      <section className="feature-grid">
        {[
          { icon: '⏱', title: 'Timed tests', body: '15, 30 or 60-second runs. The paragraph never ends — you stop when the clock does.' },
          { icon: '🎯', title: 'Live accuracy', body: 'Watch WPM and accuracy update as you type, with every wrong letter marked in red.' },
          { icon: '🔊', title: 'Tik feedback', body: 'A crisp tick on every keystroke keeps your rhythm — toggle it off any time.' },
          { icon: '🏆', title: 'Certificates', body: 'Earn a ranked certificate, download it as an image, and climb the leaderboard.' },
          { icon: '📈', title: 'Your dashboard', body: 'Track your best speed, average accuracy and full test history over time.' },
          { icon: '🔒', title: 'Accounts & roles', body: 'Personal progress for every user, plus an admin view of the whole site.' },
        ].map((f) => (
          <article className="feature" key={f.title}>
            <span className="feature__icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

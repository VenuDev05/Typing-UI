import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ page, onNavigate }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Admins run the control panel, not the test. Everyone else can practice.
  const links = [{ id: 'home', label: 'Home' }];
  if (!isAdmin) links.push({ id: 'test', label: 'Test' });
  links.push({ id: 'leaderboard', label: 'Leaderboard' });
  if (user && !isAdmin) links.push({ id: 'dashboard', label: 'Dashboard' });
  if (isAdmin) links.push({ id: 'admin', label: 'Admin' });

  return (
    <nav className="nav">
      <button className="nav__brand" onClick={() => onNavigate(isAdmin ? 'admin' : 'home')}>
        <span className="nav__logo">⌨</span>
        Typing Trainer
        {isAdmin && <span className="nav__badge">Admin</span>}
      </button>

      <div className="nav__links">
        {links.map((l) => (
          <button
            key={l.id}
            className={`nav__link ${page === l.id ? 'nav__link--active' : ''}`}
            onClick={() => onNavigate(l.id)}
          >
            {l.label}
          </button>
        ))}

        {user ? (
          <div className="nav__user">
            <span className="nav__avatar">{(user.displayName || user.username)[0].toUpperCase()}</span>
            <span className="nav__name">{user.displayName || user.username}</span>
            <button className="nav__logout" onClick={() => { logout(); onNavigate('home'); }}>
              Log out
            </button>
          </div>
        ) : (
          <button
            className={`nav__link nav__link--cta ${page === 'login' ? 'nav__link--active' : ''}`}
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

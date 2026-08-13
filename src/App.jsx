import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Home from './pages/Home.jsx';
import TestPage from './pages/TestPage.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function Shell() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');
  const isAdmin = user?.role === 'admin';

  // Send admins straight to their control panel on login.
  useEffect(() => {
    if (isAdmin && (page === 'test' || page === 'dashboard' || page === 'home')) {
      setPage('admin');
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (p) => {
    if (isAdmin && (p === 'test' || p === 'dashboard')) return setPage('admin'); // admins can't take tests
    if (p === 'dashboard' && !user) return setPage('login');
    if (p === 'admin' && !isAdmin) return setPage(user ? 'dashboard' : 'login');
    return setPage(p);
  };

  if (loading) return <div className="app"><div className="empty">Loading…</div></div>;

  return (
    <div className="app">
      <Navbar page={page} onNavigate={navigate} />

      {page === 'home' && <Home onNavigate={navigate} />}
      {page === 'test' && !isAdmin && <TestPage onNavigate={navigate} />}
      {page === 'leaderboard' && <Leaderboard />}
      {page === 'login' && <Login onNavigate={navigate} />}
      {page === 'dashboard' && !isAdmin && (user ? <Dashboard onNavigate={navigate} /> : <Login onNavigate={navigate} />)}
      {page === 'admin' && (isAdmin ? <AdminDashboard /> : <div className="empty">Admin access only.</div>)}

      <div className="footer">Typing Trainer · React + Node/Express + MongoDB</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

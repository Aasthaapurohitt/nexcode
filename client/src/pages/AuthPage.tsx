import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo} onClick={() => navigate('/')}>NexCode</div>
        <h2 style={styles.title}>{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>

        <div style={styles.tabs}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handle} style={styles.form}>
          {tab === 'register' && (
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                type="text"
                placeholder="your_username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                required
                minLength={3}
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switch}>
          {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.switchLink} onClick={() => setTab(tab === 'login' ? 'register' : 'login')}>
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', padding: 20 },
  card: { width: '100%', maxWidth: 420, background: '#141414', border: '1px solid #222', borderRadius: 14, padding: '36px 40px' },
  logo: { fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: '#6366f1', marginBottom: 24, cursor: 'pointer', display: 'inline-block' },
  title: { fontSize: 22, fontWeight: 700, color: '#e8e8e8', marginBottom: 24, letterSpacing: '-0.3px' },
  tabs: { display: 'flex', gap: 4, background: '#1a1a1a', padding: 4, borderRadius: 8, marginBottom: 28 },
  tab: { flex: 1, padding: '7px', background: 'transparent', border: 'none', color: '#666', fontSize: 13, fontWeight: 500, borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' },
  tabActive: { background: '#252525', color: '#e8e8e8' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#888', fontSize: 12, fontWeight: 500, letterSpacing: '0.3px' },
  input: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', padding: '10px 14px', borderRadius: 7, fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' },
  error: { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', padding: '10px 14px', borderRadius: 7, fontSize: 13 },
  btn: { background: '#6366f1', color: 'white', padding: '11px', borderRadius: 7, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', border: 'none', marginTop: 4, transition: 'background 0.15s' },
  switch: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 22 },
  switchLink: { color: '#6366f1', cursor: 'pointer' },
};

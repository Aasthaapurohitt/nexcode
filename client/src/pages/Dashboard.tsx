import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];
const LANG_COLORS: Record<string, string> = {
  javascript: '#fbbf24', typescript: '#60a5fa', python: '#4ade80',
  java: '#f97316', cpp: '#a78bfa', go: '#22d3ee', rust: '#f87171'
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', description: '', language: 'javascript' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    axios.get('/api/projects').then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, []);

  const createProject = async () => {
    if (!newForm.name.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post('/api/projects', newForm);
      navigate(`/editor/${res.data._id}`);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to create project');
    } finally { setCreating(false); }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    await axios.delete(`/api/projects/${id}`);
    setProjects(p => p.filter(proj => proj._id !== id));
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>NexCode</div>
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, ...styles.navActive }}>
            <span>📁</span> Projects
          </div>
        </nav>
        <div style={styles.sidebarBottom}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user?.username[0].toUpperCase()}</div>
            <div>
              <div style={styles.userName}>{user?.username}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>My Projects</h1>
            <p style={styles.subheader}>Your AI-powered code workspaces</p>
          </div>
          <button style={styles.newBtn} onClick={() => setShowNew(true)}>+ New Project</button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : projects.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✦</div>
            <p style={styles.emptyText}>No projects yet</p>
            <p style={styles.emptySubtext}>Create your first project to get started</p>
            <button style={styles.newBtn} onClick={() => setShowNew(true)}>Create Project</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map(p => (
              <div key={p._id} style={styles.card} onClick={() => navigate(`/editor/${p._id}`)}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.langDot, background: LANG_COLORS[p.language] || '#888' }} />
                  <span style={styles.langLabel}>{p.language}</span>
                  <button style={styles.deleteBtn} onClick={e => deleteProject(p._id, e)}>✕</button>
                </div>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                {p.description && <p style={styles.cardDesc}>{p.description}</p>}
                <div style={styles.cardMeta}>
                  {p.files?.length || 0} file{(p.files?.length || 0) !== 1 ? 's' : ''} ·{' '}
                  {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNew && (
        <div style={styles.overlay} onClick={() => setShowNew(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>New Project</h2>
            <div style={styles.fields}>
              <div style={styles.field}>
                <label style={styles.label}>Project Name *</label>
                <input style={styles.input} type="text" placeholder="My awesome app" autoFocus
                  value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <input style={styles.input} type="text" placeholder="What does this project do?"
                  value={newForm.description} onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Primary Language</label>
                <select style={styles.input} value={newForm.language} onChange={e => setNewForm(p => ({ ...p, language: e.target.value }))}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowNew(false)}>Cancel</button>
              <button style={styles.createBtn} onClick={createProject} disabled={creating || !newForm.name.trim()}>
                {creating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', height: '100vh', background: '#0d0d0d', overflow: 'hidden' },
  sidebar: { width: 220, background: '#111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0 },
  sidebarLogo: { fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#6366f1', padding: '0 20px 24px', letterSpacing: '-0.3px' },
  nav: { flex: 1, padding: '0 8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 7, color: '#666', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  navActive: { background: '#1e1e1e', color: '#e8e8e8' },
  sidebarBottom: { padding: '0 16px', borderTop: '1px solid #1e1e1e', paddingTop: 16 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  userName: { color: '#e8e8e8', fontSize: 13, fontWeight: 500 },
  userEmail: { color: '#555', fontSize: 11 },
  logoutBtn: { width: '100%', background: 'transparent', border: '1px solid #222', color: '#555', padding: '7px', borderRadius: 6, fontSize: 12, fontFamily: 'Inter,sans-serif', cursor: 'pointer' },
  main: { flex: 1, overflow: 'auto', padding: '32px 40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  h1: { fontSize: 26, fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.5px', marginBottom: 4 },
  subheader: { color: '#555', fontSize: 13 },
  newBtn: { background: '#6366f1', color: 'white', padding: '9px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', border: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.1s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  langDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  langLabel: { color: '#666', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', flex: 1 },
  deleteBtn: { background: 'transparent', border: 'none', color: '#444', fontSize: 12, cursor: 'pointer', padding: '2px 6px', borderRadius: 4 },
  cardTitle: { color: '#e8e8e8', fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.2px' },
  cardDesc: { color: '#666', fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 },
  cardMeta: { color: '#444', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 12, color: '#555' },
  emptyIcon: { fontSize: 32, color: '#333' },
  emptyText: { fontSize: 16, fontWeight: 600, color: '#555' },
  emptySubtext: { fontSize: 13, color: '#444', marginBottom: 8 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' },
  modal: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 14, padding: '32px', width: '100%', maxWidth: 440 },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e8e8e8', marginBottom: 24, letterSpacing: '-0.3px' },
  fields: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#888', fontSize: 12, fontWeight: 500 },
  input: { background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', padding: '10px 12px', borderRadius: 7, fontSize: 13.5, fontFamily: 'Inter,sans-serif', outline: 'none', width: '100%' },
  modalBtns: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  cancelBtn: { background: 'transparent', border: '1px solid #2a2a2a', color: '#666', padding: '9px 18px', borderRadius: 7, fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer' },
  createBtn: { background: '#6366f1', color: 'white', padding: '9px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', border: 'none' },
};

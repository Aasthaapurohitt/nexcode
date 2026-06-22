import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.logo}>NexCode</span>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate('/auth?tab=login')}>Sign In</button>
          <button style={styles.navBtnPrimary} onClick={() => navigate('/auth?tab=register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <main style={styles.hero}>
        <div style={styles.badge}>✦ Powered by Claude AI</div>
        <h1 style={styles.h1}>
          Code with an AI that<br />
          <span style={styles.gradient}>understands you.</span>
        </h1>
        <p style={styles.subtitle}>
          NexCode is an intelligent code editor with real-time AI completions,<br />
          bug detection, code explanations, and a Copilot-style chat sidebar.
        </p>
        <div style={styles.ctaRow}>
          <button style={styles.ctaPrimary} onClick={() => navigate('/auth?tab=register')}>
            Start coding for free →
          </button>
          <button style={styles.ctaGhost} onClick={() => navigate('/auth?tab=login')}>
            Sign in
          </button>
        </div>

        {/* Code preview mockup */}
        <div style={styles.mockup}>
          <div style={styles.mockupBar}>
            <span style={{...styles.dot, background: '#f87171'}}/>
            <span style={{...styles.dot, background: '#fbbf24'}}/>
            <span style={{...styles.dot, background: '#4ade80'}}/>
            <span style={styles.mockupTitle}>main.py — NexCode</span>
          </div>
          <div style={styles.mockupBody}>
            <pre style={styles.pre}><code>
{`\u0020 1  `}<span style={{color:'#c792ea'}}>def</span>{` `}<span style={{color:'#82aaff'}}>fibonacci</span>{`(n: `}<span style={{color:'#ffcb6b'}}>int</span>{`) -> `}<span style={{color:'#ffcb6b'}}>list</span>{`:`}{'\n'}
{`\u0020 2      `}<span style={{color:'#546e7a'}}># AI: Consider memoization for better performance</span>{'\n'}
{`\u0020 3      result = []`}{'\n'}
{`\u0020 4      a, b = `}<span style={{color:'#f78c6c'}}>0</span>{`, `}<span style={{color:'#f78c6c'}}>1</span>{'\n'}
{`\u0020 5      `}<span style={{color:'#c792ea'}}>while</span>{` `}<span style={{color:'#c792ea'}}>len</span>{`(result) < n:`}{'\n'}
{`\u0020 6          result.`}<span style={{color:'#82aaff'}}>append</span>{`(a)`}{'\n'}
{`\u0020 7          a, b = b, a + b`}{'\n'}
{`\u0020 8      `}<span style={{color:'#c792ea'}}>return</span>{` result`}
</code></pre>
            <div style={styles.aiHint}>
              <span style={styles.aiHintIcon}>✦</span>
              <span style={{color:'#a78bfa', fontFamily:'JetBrains Mono,monospace', fontSize:12}}>AI suggests: Use <code style={{color:'#6366f1'}}>@lru_cache</code> to memoize for O(1) repeated calls</span>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section style={styles.features}>
        {[
          { icon: '⚡', title: 'AI Completions', desc: 'Smart context-aware completions powered by Claude. Press a key, get production-ready code.' },
          { icon: '🐛', title: 'Bug Detection', desc: 'Select any code and instantly get a full analysis of bugs, edge cases, and potential errors.' },
          { icon: '💬', title: 'Copilot Chat', desc: 'Ask anything about your code. The AI sees your entire file and gives targeted advice.' },
          { icon: '🔧', title: 'Optimization', desc: 'Let the AI refactor your code for performance, readability, and language best practices.' },
          { icon: '📚', title: 'Code Explainer', desc: 'New to a codebase? Highlight any snippet and get a plain-language explanation.' },
          { icon: '▶️', title: 'Live Execution', desc: 'Run Python, JS, Java, Go, Rust, C++ and more right in the browser without any setup.' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>NexCode — Built with React, Monaco Editor, Node.js & Claude AI</span>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  nav: { width: '100%', maxWidth: 1100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', position: 'sticky', top: 0, background: 'rgba(13,13,13,0.9)', backdropFilter: 'blur(12px)', zIndex: 10 },
  logo: { fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', gap: 10 },
  navBtn: { background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '7px 16px', borderRadius: 6, fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer' },
  navBtnPrimary: { background: '#6366f1', border: 'none', color: 'white', padding: '7px 16px', borderRadius: 6, fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer', fontWeight: 500 },
  hero: { width: '100%', maxWidth: 1100, padding: '80px 32px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  badge: { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a78bfa', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: 28, letterSpacing: '0.3px' },
  h1: { fontSize: 58, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', color: '#e8e8e8', marginBottom: 20 },
  gradient: { background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: 17, color: '#777', lineHeight: 1.7, marginBottom: 36 },
  ctaRow: { display: 'flex', gap: 12, marginBottom: 56 },
  ctaPrimary: { background: '#6366f1', color: 'white', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', border: 'none', boxShadow: '0 0 30px rgba(99,102,241,0.3)' },
  ctaGhost: { background: 'transparent', color: '#888', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontFamily: 'Inter,sans-serif', cursor: 'pointer', border: '1px solid #2a2a2a' },
  mockup: { width: '100%', maxWidth: 780, background: '#141414', border: '1px solid #222', borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)' },
  mockupBar: { background: '#1a1a1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #222' },
  dot: { width: 11, height: 11, borderRadius: '50%', display: 'inline-block' },
  mockupTitle: { color: '#555', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginLeft: 8 },
  mockupBody: { padding: '0 0 0 0' },
  pre: { background: 'transparent', padding: '20px 24px 0', fontSize: 13.5, lineHeight: 1.8, textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', color: '#d4d4d4', overflowX: 'auto' },
  aiHint: { background: 'rgba(99,102,241,0.06)', borderTop: '1px solid rgba(99,102,241,0.15)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' },
  aiHintIcon: { color: '#6366f1', fontSize: 14 },
  features: { width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '20px 32px 80px' },
  featureCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '24px', transition: 'border-color 0.2s' },
  featureIcon: { fontSize: 24, marginBottom: 12 },
  featureTitle: { color: '#e8e8e8', fontSize: 15, fontWeight: 600, marginBottom: 8 },
  featureDesc: { color: '#666', fontSize: 13.5, lineHeight: 1.65 },
  footer: { padding: '24px', borderTop: '1px solid #1a1a1a', width: '100%', textAlign: 'center' },
  footerText: { color: '#444', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
};

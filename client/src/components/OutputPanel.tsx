import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  code: string;
  language: string;
}

export default function OutputPanel({ code, language }: Props) {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);

  const run = async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('');
    setError('');
    setExitCode(null);

    try {
      const res = await axios.post('/api/execute', { code, language, stdin });
      setOutput(res.data.stdout || '');
      setError(res.data.stderr || '');
      setExitCode(res.data.exitCode);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setExitCode(1);
    } finally {
      setRunning(false);
    }
  };

  const hasOutput = output || error;
  const isSuccess = exitCode === 0;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.title}>▶ Output</span>
        <div style={styles.actions}>
          <button style={styles.stdinBtn} onClick={() => setShowStdin(!showStdin)} title="Toggle stdin input">
            {showStdin ? 'Hide stdin' : 'stdin'}
          </button>
          <button style={{ ...styles.runBtn, opacity: running ? 0.6 : 1 }} onClick={run} disabled={running}>
            {running ? '⏳ Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      {showStdin && (
        <div style={styles.stdinArea}>
          <div style={styles.stdinLabel}>Standard Input</div>
          <textarea
            style={styles.stdinInput}
            value={stdin}
            onChange={e => setStdin(e.target.value)}
            placeholder="Enter stdin (if needed)..."
            rows={3}
          />
        </div>
      )}

      <div style={styles.terminal}>
        {!hasOutput && !running && (
          <div style={styles.placeholder}>Run your code to see output here</div>
        )}
        {running && (
          <div style={styles.running}>Executing {language}...</div>
        )}
        {output && (
          <pre style={styles.stdout}>{output}</pre>
        )}
        {error && (
          <pre style={styles.stderr}>{error}</pre>
        )}
        {exitCode !== null && (
          <div style={{ ...styles.exitCode, color: isSuccess ? '#4ade80' : '#f87171' }}>
            {isSuccess ? '✓' : '✗'} Exit code: {exitCode}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: { display: 'flex', flexDirection: 'column', height: '100%', background: '#111', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 },
  title: { color: '#4ade80', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' },
  actions: { display: 'flex', gap: 8 },
  stdinBtn: { background: 'transparent', border: '1px solid #252525', color: '#666', padding: '4px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  runBtn: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', padding: '4px 12px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  stdinArea: { padding: '10px 14px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 },
  stdinLabel: { color: '#555', fontSize: 11, marginBottom: 6 },
  stdinInput: { width: '100%', background: '#141414', border: '1px solid #252525', color: '#e8e8e8', padding: '8px', borderRadius: 5, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', resize: 'none', outline: 'none' },
  terminal: { flex: 1, overflow: 'auto', padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5 },
  placeholder: { color: '#333', fontStyle: 'italic', fontSize: 12 },
  running: { color: '#fbbf24', fontStyle: 'italic' },
  stdout: { color: '#d4d4d4', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 },
  stderr: { color: '#f87171', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, marginTop: 8 },
  exitCode: { marginTop: 10, fontSize: 11, letterSpacing: '0.3px' },
};

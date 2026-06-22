import React, { useState } from 'react';
import { File } from '../types';

interface Props {
  files: File[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
  onAddFile: (name: string, language: string) => void;
  onDeleteFile: (index: number) => void;
  projectName: string;
}

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];
const LANG_EXTS: Record<string, string> = {
  javascript: 'js', typescript: 'ts', python: 'py', java: 'java', cpp: 'cpp', go: 'go', rust: 'rs'
};

export default function FileTree({ files, activeFileIndex, onSelectFile, onAddFile, onDeleteFile, projectName }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLang, setNewLang] = useState('javascript');

  const handleAdd = () => {
    if (!newName.trim()) return;
    const ext = LANG_EXTS[newLang] || 'txt';
    const name = newName.includes('.') ? newName : `${newName}.${ext}`;
    onAddFile(name, newLang);
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div style={styles.tree}>
      <div style={styles.header}>
        <span style={styles.projectName}>{projectName}</span>
        <button style={styles.addBtn} onClick={() => setShowAdd(!showAdd)} title="New file">+</button>
      </div>

      {showAdd && (
        <div style={styles.addForm}>
          <input style={styles.input} type="text" placeholder="filename" value={newName}
            onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
          <select style={styles.input} value={newLang} onChange={e => setNewLang(e.target.value)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button style={styles.confirmBtn} onClick={handleAdd}>Add</button>
        </div>
      )}

      <div style={styles.files}>
        {files.map((f, i) => (
          <div key={i} style={{ ...styles.file, ...(i === activeFileIndex ? styles.activeFile : {}) }}
            onClick={() => onSelectFile(i)}>
            <span style={styles.fileIcon}>{getFileIcon(f.language)}</span>
            <span style={styles.fileName}>{f.name}</span>
            {files.length > 1 && (
              <button style={styles.delBtn} onClick={e => { e.stopPropagation(); onDeleteFile(i); }}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getFileIcon(lang: string) {
  const map: Record<string, string> = {
    javascript: '🟨', typescript: '🟦', python: '🐍', java: '☕',
    cpp: '⚙️', go: '🔵', rust: '🦀', html: '🌐', css: '🎨'
  };
  return map[lang] || '📄';
}

const styles: Record<string, React.CSSProperties> = {
  tree: { width: 200, background: '#111', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #1a1a1a' },
  projectName: { color: '#666', fontSize: 11, fontWeight: 600, letterSpacing: '0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  addBtn: { background: 'transparent', border: 'none', color: '#555', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 2px' },
  addForm: { padding: '8px 10px', borderBottom: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: 6 },
  input: { background: '#1a1a1a', border: '1px solid #252525', color: '#e8e8e8', padding: '6px 8px', borderRadius: 4, fontSize: 11.5, fontFamily: 'JetBrains Mono, monospace', outline: 'none', width: '100%' },
  confirmBtn: { background: '#6366f1', border: 'none', color: 'white', padding: '5px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  files: { flex: 1, overflow: 'auto' },
  file: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', cursor: 'pointer', borderRadius: 0, fontSize: 12.5 },
  activeFile: { background: '#1e1e1e', borderRight: '2px solid #6366f1' },
  fileIcon: { fontSize: 13, flexShrink: 0 },
  fileName: { color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 },
  delBtn: { background: 'transparent', border: 'none', color: '#444', fontSize: 10, cursor: 'pointer', padding: '2px 4px', borderRadius: 3, flexShrink: 0 },
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Project, File } from '../types';
import AIChatSidebar from '../components/AIChatSidebar';
import OutputPanel from '../components/OutputPanel';
import FileTree from '../components/FileTree';

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];
const LANG_MAP: Record<string, string> = { cpp: 'cpp', javascript: 'javascript', typescript: 'typescript', python: 'python', java: 'java', go: 'go', rust: 'rust' };

type SaveStatus = 'saved' | 'saving' | 'unsaved';
type RightPanel = 'output' | 'ai';

export default function Editor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [rightPanel, setRightPanel] = useState<RightPanel>('ai');
  const [aiAction, setAiAction] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState('');
  const [completing, setCompleting] = useState(false);

  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    axios.get(`/api/projects/${projectId}`)
      .then(r => { setProject(r.data); setLoading(false); })
      .catch(() => { navigate('/dashboard'); });
  }, [projectId, navigate]);

  const activeFile = project?.files[activeFileIndex];

  const handleCodeChange = (value: string | undefined) => {
    if (!project || value === undefined) return;
    const updated = { ...project };
    updated.files = [...project.files];
    updated.files[activeFileIndex] = { ...updated.files[activeFileIndex], content: value };
    setProject(updated);
    setSaveStatus('unsaved');

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => autoSave(updated), 2000);
  };

  const autoSave = useCallback(async (proj: Project) => {
    setSaveStatus('saving');
    try {
      await axios.put(`/api/projects/${proj._id}`, { files: proj.files, language: proj.language, name: proj.name });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  }, []);

  const manualSave = async () => {
    if (!project) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await autoSave(project);
  };

  const addFile = (name: string, language: string) => {
    if (!project) return;
    const newFile: File = { name, language, content: getDefaultContent(language) };
    const updated = { ...project, files: [...project.files, newFile] };
    setProject(updated);
    setActiveFileIndex(updated.files.length - 1);
    autoSave(updated);
  };

  const deleteFile = (index: number) => {
    if (!project || project.files.length <= 1) return;
    const updated = { ...project, files: project.files.filter((_, i) => i !== index) };
    setProject(updated);
    setActiveFileIndex(Math.min(activeFileIndex, updated.files.length - 1));
    autoSave(updated);
  };

  const handleLanguageChange = (lang: string) => {
    if (!project) return;
    const updated = { ...project, language: lang };
    updated.files = [...project.files];
    updated.files[activeFileIndex] = { ...updated.files[activeFileIndex], language: lang };
    setProject(updated);
    autoSave(updated);
  };

  const getCompletion = async () => {
    if (!activeFile || completing) return;
    const editor = editorRef.current;
    if (!editor) return;

    setCompleting(true);
    const cursor = editor.getPosition();
    const model = editor.getModel();
    const offset = model.getOffsetAt(cursor);

    try {
      const res = await axios.post('/api/ai/complete', {
        code: activeFile.content,
        language: activeFile.language,
        cursorPosition: offset
      });
      const completion = res.data.completion;
      if (completion && editor) {
        editor.executeEdits('ai-complete', [{
          range: { startLineNumber: cursor.lineNumber, startColumn: cursor.column, endLineNumber: cursor.lineNumber, endColumn: cursor.column },
          text: completion
        }]);
      }
    } catch (e) {
      console.error('Completion error', e);
    } finally {
      setCompleting(false);
    }
  };

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom keybinding: Ctrl+Shift+Space for AI completion
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Space, getCompletion);

    // Ctrl+S to save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, manualSave);

    editor.updateOptions({
      fontSize: 14,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontLigatures: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      padding: { top: 16 },
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d0d', color: '#555', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
        Loading editor...
      </div>
    );
  }

  if (!project || !activeFile) return null;

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topbar}>
        <div style={styles.topLeft}>
          <span style={styles.logo} onClick={() => navigate('/dashboard')}>NexCode</span>
          <span style={styles.separator}>/</span>
          <span style={styles.projectName}>{project.name}</span>
          <span style={styles.fileName}>{activeFile.name}</span>
        </div>

        <div style={styles.topCenter}>
          <div style={{ ...styles.saveStatus, color: saveStatus === 'saved' ? '#4ade80' : saveStatus === 'saving' ? '#fbbf24' : '#f87171' }}>
            {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'saving' ? '⏳ Saving...' : '● Unsaved'}
          </div>
        </div>

        <div style={styles.topRight}>
          <select style={styles.langSelect} value={activeFile.language} onChange={e => handleLanguageChange(e.target.value)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button style={styles.saveBtn} onClick={manualSave}>Save</button>
          <span style={styles.userName}>{user?.username}</span>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      {/* Main layout */}
      <div style={styles.layout}>
        {/* File tree */}
        <FileTree
          files={project.files}
          activeFileIndex={activeFileIndex}
          onSelectFile={setActiveFileIndex}
          onAddFile={addFile}
          onDeleteFile={deleteFile}
          projectName={project.name}
        />

        {/* Editor */}
        <div style={styles.editorContainer}>
          {/* Tab bar */}
          <div style={styles.tabBar}>
            {project.files.map((f, i) => (
              <div key={i} style={{ ...styles.tab, ...(i === activeFileIndex ? styles.tabActive : {}) }}
                onClick={() => setActiveFileIndex(i)}>
                {f.name}
              </div>
            ))}
            <div style={styles.aiHint}>
              <span>Ctrl+Shift+Space</span>
              <span style={{ color: '#a78bfa' }}>AI Complete</span>
            </div>
          </div>

          <MonacoEditor
            height="100%"
            language={LANG_MAP[activeFile.language] || 'javascript'}
            value={activeFile.content}
            theme="vs-dark"
            onChange={handleCodeChange}
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              minimap: { enabled: false },
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
            }}
          />

          {completing && (
            <div style={styles.completingBadge}>✦ AI completing...</div>
          )}
        </div>

        {/* Right panels */}
        <div style={styles.rightSide}>
          <div style={styles.panelTabs}>
            <button style={{ ...styles.panelTab, ...(rightPanel === 'ai' ? styles.panelTabActive : {}) }}
              onClick={() => setRightPanel('ai')}>✦ AI Chat</button>
            <button style={{ ...styles.panelTab, ...(rightPanel === 'output' ? styles.panelTabActive : {}) }}
              onClick={() => setRightPanel('output')}>▶ Output</button>
          </div>

          <div style={styles.panelContent}>
            {rightPanel === 'ai' ? (
              <AIChatSidebar code={activeFile.content} language={activeFile.language} />
            ) : (
              <OutputPanel code={activeFile.content} language={activeFile.language} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultContent(lang: string): string {
  const map: Record<string, string> = {
    javascript: '// New file\nconsole.log("Hello!");\n',
    typescript: '// New TypeScript file\nconst greet = (name: string) => `Hello, ${name}!`;\n',
    python: '# New file\nprint("Hello!")\n',
    java: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello!");\n    }\n}\n',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello!" << endl;\n    return 0;\n}\n',
    go: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello!")\n}\n',
    rust: 'fn main() {\n    println!("Hello!");\n}\n',
  };
  return map[lang] || '';
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d0d0d', overflow: 'hidden' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 42, background: '#111', borderBottom: '1px solid #1a1a1a', padding: '0 16px', flexShrink: 0, zIndex: 5 },
  topLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: { fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#6366f1', cursor: 'pointer' },
  separator: { color: '#333', fontSize: 18 },
  projectName: { color: '#666', fontSize: 13 },
  fileName: { color: '#e8e8e8', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' },
  topCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  saveStatus: { fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 },
  topRight: { display: 'flex', alignItems: 'center', gap: 10 },
  langSelect: { background: '#1a1a1a', border: '1px solid #252525', color: '#888', padding: '4px 8px', borderRadius: 5, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none', cursor: 'pointer' },
  saveBtn: { background: 'transparent', border: '1px solid #252525', color: '#666', padding: '4px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  userName: { color: '#555', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
  backBtn: { background: 'transparent', border: '1px solid #252525', color: '#666', padding: '4px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  layout: { display: 'flex', flex: 1, overflow: 'hidden' },
  editorContainer: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  tabBar: { display: 'flex', alignItems: 'center', background: '#111', borderBottom: '1px solid #1a1a1a', overflow: 'hidden', flexShrink: 0, gap: 0 },
  tab: { padding: '7px 16px', fontSize: 12, color: '#666', cursor: 'pointer', borderRight: '1px solid #1a1a1a', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' },
  tabActive: { background: '#1e1e1e', color: '#e8e8e8', borderBottom: '2px solid #6366f1' },
  aiHint: { marginLeft: 'auto', display: 'flex', gap: 8, padding: '0 14px', fontSize: 10.5, color: '#333', fontFamily: 'JetBrains Mono, monospace', alignItems: 'center' },
  completingBadge: { position: 'absolute', bottom: 16, right: 16, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', zIndex: 10 },
  rightSide: { width: 340, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1a1a1a', overflow: 'hidden', flexShrink: 0 },
  panelTabs: { display: 'flex', background: '#111', borderBottom: '1px solid #1a1a1a', flexShrink: 0 },
  panelTab: { flex: 1, padding: '8px', background: 'transparent', border: 'none', color: '#555', fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter,sans-serif', borderBottom: '2px solid transparent', transition: 'all 0.15s' },
  panelTabActive: { color: '#a78bfa', borderBottom: '2px solid #6366f1', background: '#141414' },
  panelContent: { flex: 1, overflow: 'hidden' },
};

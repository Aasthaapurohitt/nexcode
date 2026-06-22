import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';

interface Props {
  code: string;
  language: string;
}

const QUICK_ACTIONS = [
  { label: '✦ Explain', action: 'explain', prompt: 'Explain this code' },
  { label: '🐛 Debug', action: 'debug', prompt: 'Find bugs in this code' },
  { label: '⚡ Optimize', action: 'optimize', prompt: 'Optimize this code' },
];

export default function AIChatSidebar({ code, language }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Hi! I'm your AI coding assistant. I can see your code in real time. Ask me to explain, debug, or optimize it — or generate new code from a description."
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (userMessage?: string) => {
    const msg = (userMessage || input).trim();
    if (!msg || loading) return;
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        code,
        language
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: ' + (err.response?.data?.error || err.message) }]);
    } finally {
      setLoading(false);
    }
  };

  const quickAction = async (action: string, prompt: string) => {
    if (loading || !code.trim()) return;
    setActiveAction(action);
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const endpoint = action === 'explain' ? '/api/ai/explain' : action === 'debug' ? '/api/ai/debug' : '/api/ai/optimize';
      const res = await axios.post(endpoint, { code, language });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.result }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: ' + (err.response?.data?.error || err.message) }]);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>✦ AI Assistant</span>
        <button style={styles.clearBtn} onClick={() => setMessages([{ role: 'assistant', content: "Chat cleared. How can I help?" }])}>Clear</button>
      </div>

      {/* Quick actions */}
      <div style={styles.quickActions}>
        {QUICK_ACTIONS.map(qa => (
          <button
            key={qa.action}
            style={{ ...styles.quickBtn, ...(activeAction === qa.action ? styles.quickBtnActive : {}) }}
            onClick={() => quickAction(qa.action, qa.prompt)}
            disabled={loading}
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.message, ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage) }}>
            {msg.role === 'assistant' && <div style={styles.aiLabel}>✦ AI</div>}
            <div className="ai-response">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, ...styles.aiMessage }}>
            <div style={styles.aiLabel}>✦ AI</div>
            <div style={styles.thinking}>
              <span style={styles.dot1} />
              <span style={styles.dot2} />
              <span style={styles.dot3} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          style={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your code... (Enter to send)"
          rows={3}
          disabled={loading}
        />
        <button style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.4 : 1 }}
          onClick={() => send()} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: { width: 320, display: 'flex', flexDirection: 'column', background: '#111', borderLeft: '1px solid #1e1e1e', height: '100%', overflow: 'hidden', flexShrink: 0 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1e1e1e' },
  headerTitle: { color: '#a78bfa', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' },
  clearBtn: { background: 'transparent', border: 'none', color: '#444', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  quickActions: { display: 'flex', gap: 6, padding: '10px 12px', borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' },
  quickBtn: { background: '#1a1a1a', border: '1px solid #252525', color: '#888', padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' },
  quickBtnActive: { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa' },
  messages: { flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 },
  message: { padding: '12px', borderRadius: 8, fontSize: 13 },
  userMessage: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', marginLeft: 12 },
  aiMessage: { background: '#161616', border: '1px solid #1e1e1e' },
  aiLabel: { color: '#6366f1', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 },
  thinking: { display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' },
  dot1: { width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.2s infinite 0s' },
  dot2: { width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.2s infinite 0.2s' },
  dot3: { width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.2s infinite 0.4s' },
  inputArea: { padding: '10px 12px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 8, alignItems: 'flex-end' },
  textarea: { flex: 1, background: '#1a1a1a', border: '1px solid #252525', color: '#e8e8e8', padding: '9px 12px', borderRadius: 7, fontSize: 12.5, fontFamily: 'Inter,sans-serif', resize: 'none', outline: 'none', lineHeight: 1.5 },
  sendBtn: { background: '#6366f1', color: 'white', width: 32, height: 32, borderRadius: 6, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', flexShrink: 0 },
};

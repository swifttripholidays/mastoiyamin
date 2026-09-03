'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, UserRound } from 'lucide-react';

type ChatMessage = {
  id: string;
  sender: 'visitor' | 'assistant' | 'owner';
  body: string;
  created_at: string;
};

type StoredChat = { sessionId: string; token: string; name: string };
const STORAGE_KEY = 'ym-concierge-session';
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

async function chatFetch(input: RequestInfo | URL, init?: RequestInit) {
  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      lastResponse = await fetch(input, init);
      if (!RETRYABLE_STATUSES.has(lastResponse.status) || attempt === 2) return lastResponse;
    } catch (error) {
      if (attempt === 2) throw error;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 650 * (attempt + 1)));
  }
  return lastResponse as Response;
}

export function VisitorChat() {
  const [open, setOpen] = useState(false);
  const [identity, setIdentity] = useState<StoredChat | null>(null);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'ai' | 'human' | 'closed'>('ai');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async (active: StoredChat) => {
    const params = new URLSearchParams({ sessionId: active.sessionId, token: active.token });
    const response = await fetch(`/api/chat?${params}`);
    if (!response.ok) return;
    const data = await response.json() as { messages: ChatMessage[]; status: 'ai' | 'human' | 'closed' };
    setMessages(data.messages);
    setStatus(data.status);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredChat;
        if (parsed.sessionId && parsed.token && parsed.name) {
          setIdentity(parsed);
          setName(parsed.name);
          refresh(parsed).catch(() => undefined);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [refresh]);

  useEffect(() => {
    if (!identity || !open) return;
    const timer = window.setInterval(() => refresh(identity).catch(() => undefined), 4500);
    return () => window.clearInterval(timer);
  }, [identity, open, refresh]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  async function startChat(event: FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) return setError('Please enter your name first.');
    setBusy(true);
    setError('');
    try {
      const response = await chatFetch('/api/chat/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: cleanName }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return setError(data.error || 'The concierge is unavailable right now. Please try again.');
      const next = { sessionId: data.sessionId, token: data.token, name: cleanName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIdentity(next);
      setMessages(data.messages || []);
    } catch {
      setError('The connection paused. Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!identity || !draft.trim() || busy) return;
    const body = draft.trim();
    setDraft('');
    setBusy(true);
    setError('');
    const optimistic: ChatMessage = { id: `local-${Date.now()}`, sender: 'visitor', body, created_at: new Date().toISOString() };
    setMessages((current) => [...current, optimistic]);
    try {
      const response = await chatFetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: identity.sessionId, token: identity.token, message: body }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDraft(body);
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        return setError(data.error || 'That message did not send. Please try again.');
      }
      setMessages(data.messages || []);
      setStatus(data.status || 'ai');
    } catch {
      setDraft(body);
      setMessages((current) => current.filter((message) => message.id !== optimistic.id));
      setError('The connection paused. Your message is still here—try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className={`visitor-chat ${open ? 'is-open' : ''}`} aria-label="Talk with Yamin">
      {open && (
        <div className="chat-window" role="dialog" aria-modal="false" aria-label="Yamin Mastoi concierge">
          <header>
            <div className="chat-mark"><Sparkles /></div>
            <div><strong>Mastoi Concierge</strong><span><i className={status} /> {status === 'human' ? 'Yamin notified' : status === 'closed' ? 'Conversation closed' : 'AI + human mode'}</span></div>
            <button onClick={() => setOpen(false)} aria-label="Minimize chat"><ChevronDown /></button>
          </header>
          {!identity ? (
            <form className="chat-gate" onSubmit={startChat}>
              <span>Before we begin</span>
              <h2>What should I call you?</h2>
              <p>Your name connects every message to one private conversation in Yamin’s studio.</p>
              <label><UserRound /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" maxLength={60} /></label>
              <button disabled={busy}>{busy ? 'Opening…' : 'Enter the conversation'} <Send /></button>
              {error && <small role="alert">{error}</small>}
            </form>
          ) : (
            <>
              <div className="chat-messages" aria-live="polite">
                {messages.map((message) => (
                  <div className={`chat-bubble ${message.sender}`} key={message.id}>
                    <span>{message.sender === 'visitor' ? identity.name : message.sender === 'owner' ? 'Yamin' : 'Mastoi AI'}</span>
                    <p>{message.body}</p>
                  </div>
                ))}
                {busy && <div className="chat-typing"><i /><i /><i /></div>}
                <div ref={bottomRef} />
              </div>
              <form className="chat-compose" onSubmit={sendMessage}>
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about a project, idea or collaboration…" maxLength={1200} rows={2} />
                <button disabled={!draft.trim() || busy} aria-label="Send message"><Send /></button>
              </form>
              {error && <small className="chat-error" role="alert">{error}</small>}
              <footer><Bot /> Instant guidance. Yamin can take over anytime.</footer>
            </>
          )}
        </div>
      )}
      <button className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span><MessageCircle /></span><strong>{open ? 'Close' : 'Talk to Yamin'}</strong><em>Online</em>
      </button>
    </aside>
  );
}

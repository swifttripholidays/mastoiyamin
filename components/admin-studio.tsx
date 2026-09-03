'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Check,
  Copy,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JournalPost } from '@/lib/site-data';

type Tab = 'overview' | 'posts' | 'media' | 'chats' | 'inbox' | 'social';
type Message = { id: string; name: string; email: string; message: string; created_at: string; status: string };
type ChatSession = { id: string; visitor_name: string; status: 'ai' | 'human' | 'closed'; last_message_at: string; last_message: string; message_count: number };
type ChatMessage = { id: string; sender: 'visitor' | 'assistant' | 'owner'; body: string; created_at: string };
type ActiveChat = { session: ChatSession; messages: ChatMessage[] };

const emptyPost = {
  title: '', slug: '', excerpt: '', content: '', category: 'Perspective', status: 'draft' as const, featured: false, coverUrl: '',
};

export function AdminStudio({ displayName, signOutPath }: { displayName: string; signOutPath: string }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [chatReply, setChatReply] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyPost);
  const [notice, setNotice] = useState('');
  const [socialCopy, setSocialCopy] = useState('Building intelligent products, digital ventures and meaningful experiences.');
  const [selectedNetworks, setSelectedNetworks] = useState(['LinkedIn', 'X']);

  const load = async () => {
    const [postResponse, messageResponse, chatResponse] = await Promise.all([fetch('/api/posts?all=1'), fetch('/api/messages'), fetch('/api/chats')]);
    if (postResponse.ok) setPosts(await postResponse.json());
    if (messageResponse.ok) setMessages(await messageResponse.json());
    if (chatResponse.ok) setChatSessions(await chatResponse.json());
  };

  useEffect(() => { load().catch(() => undefined); }, []);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const registration = context.registerTool({
      name: 'create_portfolio_post_draft',
      title: 'Create portfolio post draft',
      description: 'Create a new unpublished journal draft in Yamin Mastoi’s creator studio.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 3 },
          excerpt: { type: 'string', minLength: 10 },
          content: { type: 'string', minLength: 10 },
          category: { type: 'string', minLength: 2 },
        },
        required: ['title', 'excerpt', 'content', 'category'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const value = input as Partial<{ title: string; excerpt: string; content: string; category: string }>;
        if (!value.title || value.title.trim().length < 3 || !value.excerpt || value.excerpt.trim().length < 10 || !value.content || value.content.trim().length < 10 || !value.category || value.category.trim().length < 2) {
          throw new Error('A title, excerpt, category and at least ten characters of content are required.');
        }
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...value, status: 'draft', featured: false }),
        });
        const result = await response.json() as { id?: string; error?: string };
        if (!response.ok || !result.id) throw new Error(result.error || 'The draft could not be created.');
        const refreshed = await fetch('/api/posts?all=1');
        if (refreshed.ok) setPosts(await refreshed.json());
        setTab('posts');
        setNotice('Draft created by your connected assistant.');
        return { id: result.id, status: 'draft', created: true };
      },
    }, { signal: lifecycle.signal });
    Promise.resolve(registration).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const publishedCount = useMemo(() => posts.filter((post) => post.status === 'published').length, [posts]);

  function startNew() {
    setEditingId(null);
    setDraft(emptyPost);
    setTab('posts');
  }

  function startEdit(post: JournalPost) {
    setEditingId(post.id);
    setDraft({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      featured: post.featured,
      coverUrl: post.coverUrl ?? '',
    });
    setTab('posts');
  }

  async function savePost(event: FormEvent) {
    event.preventDefault();
    setNotice('Saving…');
    const endpoint = editingId ? `/api/posts/${editingId}` : '/api/posts';
    const response = await fetch(endpoint, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(result.error || 'Could not save the post.');
    setNotice(draft.status === 'published' ? 'Published successfully.' : 'Draft saved.');
    setDraft(emptyPost);
    setEditingId(null);
    await load();
  }

  async function removePost(post: JournalPost) {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    if (response.ok) {
      setNotice('Post deleted.');
      await load();
    }
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setNotice('Uploading…');
    const response = await fetch('/api/media', { method: 'POST', body: data });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(result.error || 'Upload failed.');
    setDraft((current) => ({ ...current, coverUrl: result.url }));
    setNotice('Media uploaded. Its URL is ready for your next post.');
    form.reset();
  }

  async function openChat(id: string) {
    const response = await fetch(`/api/chats/${id}`);
    if (!response.ok) return setNotice('Could not open that conversation.');
    setActiveChat(await response.json());
    setTab('chats');
  }

  async function sendChatReply(event: FormEvent) {
    event.preventDefault();
    if (!activeChat || !chatReply.trim()) return;
    const response = await fetch(`/api/chats/${activeChat.session.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: chatReply.trim() }),
    });
    if (!response.ok) return setNotice('Your reply could not be sent.');
    setActiveChat(await response.json());
    setChatReply('');
    setNotice('Reply sent. This conversation is now in human mode.');
    await load();
  }

  async function changeChatStatus(status: ChatSession['status']) {
    if (!activeChat) return;
    const response = await fetch(`/api/chats/${activeChat.session.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return setNotice('Could not change the conversation mode.');
    setActiveChat(await response.json());
    setNotice(status === 'ai' ? 'Mastoi AI is handling this chat.' : status === 'human' ? 'Human mode is active.' : 'Conversation closed.');
    await load();
  }

  function toggleNetwork(network: string) {
    setSelectedNetworks((current) => current.includes(network) ? current.filter((item) => item !== network) : [...current, network]);
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(socialCopy);
    setNotice('Caption copied.');
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'posts', label: 'Posts', icon: BookOpen },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'chats', label: 'Live chats', icon: MessagesSquare },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'social', label: 'Social composer', icon: Send },
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><span>YM</span> Studio</a>
        <p className="admin-eyebrow">Owner control room</p>
        <nav aria-label="Admin navigation">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>
              <Icon /> {label}
            </button>
          ))}
        </nav>
        <div className="admin-profile">
          <span>{displayName.slice(0, 1).toUpperCase()}</span>
          <div><strong>{displayName}</strong><small>Portfolio owner</small></div>
          <a href={signOutPath} aria-label="Sign out"><LogOut /></a>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div><p>Private creator studio</p><h1>{tabs.find((item) => item.id === tab)?.label}</h1></div>
          <Button onClick={startNew} className="admin-primary"><Plus /> New post</Button>
        </header>

        {notice && <div className="admin-notice" role="status"><Sparkles /> {notice}<button onClick={() => setNotice('')}>×</button></div>}

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="metric-card"><span>Published stories</span><strong>{publishedCount.toString().padStart(2, '0')}</strong><BookOpen /></div>
            <div className="metric-card maroon"><span>Works in progress</span><strong>{(posts.length - publishedCount).toString().padStart(2, '0')}</strong><BarChart3 /></div>
            <div className="metric-card cream"><span>Live conversations</span><strong>{chatSessions.length.toString().padStart(2, '0')}</strong><MessagesSquare /></div>
            <section className="admin-panel recent-panel">
              <div className="panel-heading"><div><span>Editorial pipeline</span><h2>Recent posts</h2></div><button onClick={() => setTab('posts')}>Manage all</button></div>
              {posts.length ? posts.slice(0, 4).map((post) => (
                <button className="admin-post-row" onClick={() => startEdit(post)} key={post.id}>
                  <span className={post.status}>{post.status === 'published' ? <Check /> : <span />}</span>
                  <div><strong>{post.title}</strong><small>{post.category} · {post.status}</small></div>
                  <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                </button>
              )) : <div className="admin-empty">Your first original post begins here.<Button onClick={startNew}>Create a post</Button></div>}
            </section>
            <section className="admin-panel quick-panel">
              <span>Quick dispatch</span><h2>Turn one thought into many.</h2><p>Write once, shape the caption for each network, then publish with the correct official workflow.</p>
              <Button onClick={() => setTab('social')} variant="outline">Open social composer <Send /></Button>
            </section>
          </div>
        )}

        {tab === 'posts' && (
          <div className="editor-grid">
            <form className="admin-panel post-editor" onSubmit={savePost}>
              <div className="panel-heading"><div><span>{editingId ? 'Editing entry' : 'New entry'}</span><h2>{editingId ? 'Refine your story' : 'Start with the idea'}</h2></div></div>
              <label>Title<Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required placeholder="A precise, memorable title" /></label>
              <div className="form-pair">
                <label>URL slug<Input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="generated-from-title" /></label>
                <label>Category<Input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
              </div>
              <label>Short introduction<Textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="The reason someone should keep reading…" /></label>
              <label>Story<Textarea className="story-field" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} required placeholder="Write the full story here…" /></label>
              <label>Cover image URL<Input value={draft.coverUrl} onChange={(event) => setDraft({ ...draft, coverUrl: event.target.value })} placeholder="Upload media, then paste or reuse its URL" /></label>
              <div className="editor-options">
                <label><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /> Feature this story</label>
                <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as 'draft' | 'published' })}><option value="draft">Save as draft</option><option value="published">Publish now</option></select>
                <Button className="admin-primary" type="submit">{draft.status === 'published' ? 'Publish story' : 'Save draft'}</Button>
              </div>
            </form>
            <section className="admin-panel post-list-panel">
              <div className="panel-heading"><div><span>Library</span><h2>{posts.length} posts</h2></div></div>
              {posts.map((post) => <article className="post-list-item" key={post.id}><div><span>{post.category}</span><h3>{post.title}</h3><small>{post.status}</small></div><div><button onClick={() => startEdit(post)}>Edit</button><button className="danger" onClick={() => removePost(post)} aria-label={`Delete ${post.title}`}><Trash2 /></button></div></article>)}
            </section>
          </div>
        )}

        {tab === 'media' && (
          <section className="admin-panel media-panel">
            <div className="panel-heading"><div><span>Asset library</span><h2>Upload once. Use everywhere.</h2></div></div>
            <form className="media-drop" onSubmit={uploadMedia}>
              <Upload /><strong>Choose a polished visual</strong><p>JPG, PNG, WebP, GIF or MP4 · up to 8 MB</p><input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" required /><Button className="admin-primary" type="submit">Upload asset</Button>
            </form>
            {draft.coverUrl && <div className="uploaded-url"><Check /><span>{draft.coverUrl}</span><Button onClick={() => navigator.clipboard.writeText(draft.coverUrl)} variant="outline"><Copy /> Copy URL</Button></div>}
          </section>
        )}

        {tab === 'chats' && (
          <div className="chat-admin-grid">
            <section className="admin-panel chat-session-list">
              <div className="panel-heading"><div><span>AI + human inbox</span><h2>{chatSessions.length} conversations</h2></div></div>
              {chatSessions.length ? chatSessions.map((chat) => (
                <button className={activeChat?.session.id === chat.id ? 'active' : ''} onClick={() => openChat(chat.id)} key={chat.id}>
                  <i className={chat.status} />
                  <div><strong>{chat.visitor_name}</strong><p>{chat.last_message}</p></div>
                  <time>{new Date(chat.last_message_at).toLocaleDateString()}</time>
                </button>
              )) : <div className="admin-empty">Named visitor chats will appear here in real time.</div>}
            </section>
            <section className="admin-panel active-chat-panel">
              {activeChat ? (
                <>
                  <header>
                    <div><span>Conversation with</span><h2>{activeChat.session.visitor_name}</h2></div>
                    <div className="chat-mode-controls">
                      {(['ai', 'human', 'closed'] as const).map((mode) => <button className={activeChat.session.status === mode ? 'active' : ''} onClick={() => changeChatStatus(mode)} key={mode}>{mode}</button>)}
                    </div>
                  </header>
                  <div className="admin-chat-messages">
                    {activeChat.messages.map((message) => <div className={message.sender} key={message.id}><span>{message.sender === 'owner' ? 'You' : message.sender === 'assistant' ? 'Mastoi AI' : activeChat.session.visitor_name}</span><p>{message.body}</p><time>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>)}
                  </div>
                  <form className="admin-chat-compose" onSubmit={sendChatReply}>
                    <Textarea value={chatReply} onChange={(event) => setChatReply(event.target.value)} placeholder={`Reply to ${activeChat.session.visitor_name}…`} maxLength={1600} />
                    <Button className="admin-primary" type="submit"><Send /> Send as Yamin</Button>
                  </form>
                </>
              ) : <div className="admin-empty"><MessagesSquare />Choose a conversation to read it, switch between AI and human mode, and reply as yourself.</div>}
            </section>
          </div>
        )}

        {tab === 'inbox' && (
          <section className="admin-panel inbox-panel">
            <div className="panel-heading"><div><span>Conversations</span><h2>Private inbox</h2></div></div>
            {messages.length ? messages.map((message) => <article className="message-card" key={message.id}><div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div><time>{new Date(message.created_at).toLocaleString()}</time><p>{message.message}</p></article>) : <div className="admin-empty">New portfolio enquiries will arrive here.</div>}
          </section>
        )}

        {tab === 'social' && (
          <div className="social-composer">
            <section className="admin-panel composer-editor">
              <div className="panel-heading"><div><span>Master caption</span><h2>One idea, every channel.</h2></div></div>
              <Textarea className="social-textarea" value={socialCopy} onChange={(event) => setSocialCopy(event.target.value)} maxLength={2200} />
              <div className="character-count">{socialCopy.length} / 2,200 characters</div>
              <div className="network-pills">{['LinkedIn', 'X', 'Instagram', 'TikTok', 'Facebook'].map((network) => <button className={selectedNetworks.includes(network) ? 'selected' : ''} onClick={() => toggleNetwork(network)} key={network}>{selectedNetworks.includes(network) && <Check />}{network}</button>)}</div>
              <div className="composer-actions"><Button onClick={copyCaption} variant="outline"><Copy /> Copy caption</Button><Button className="admin-primary" onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}>Continue to platforms <Send /></Button></div>
              <p className="integration-note">Direct publishing can be enabled later using each platform’s official API and OAuth approval. No social passwords are stored here.</p>
            </section>
            <section className="admin-panel social-preview-card"><span>Live preview</span><div className="preview-avatar">YM</div><strong>Yamin Mastoi</strong><small>@mastoi_yamin10 · now</small><p>{socialCopy}</p><div className="preview-media"><span>YAMIN</span><span>MASTOI</span></div></section>
          </div>
        )}
      </section>
    </main>
  );
}

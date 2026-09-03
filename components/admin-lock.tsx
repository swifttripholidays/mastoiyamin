'use client';

import { FormEvent, useState } from 'react';
import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';

export function AdminLock({ displayName }: { displayName: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const response = await fetch('/api/admin/unlock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    setBusy(false);
    if (!response.ok) return setError('That private access code is not correct.');
    window.location.reload();
  }

  return (
    <main className="admin-lock-shell">
      <section className="admin-lock-card">
        <div className="lock-orbit" aria-hidden="true"><i /><i /><LockKeyhole /></div>
        <span>Protected control room</span>
        <h1>One more key,<br /><em>{displayName}.</em></h1>
        <p>This private access code protects your posts, media, inbox and live conversations.</p>
        <form onSubmit={unlock}>
          <label><KeyRound /><input type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Private access code" autoFocus autoComplete="one-time-code" /></label>
          <button disabled={busy || code.length < 6}>{busy ? 'Verifying…' : 'Unlock studio'} <ShieldCheck /></button>
        </form>
        {error && <small role="alert">{error}</small>}
        <a href="/">← Return to portfolio</a>
      </section>
    </main>
  );
}

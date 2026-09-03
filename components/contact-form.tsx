'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    }).catch(() => null);
    if (response?.ok) {
      setState('sent');
      event.currentTarget.reset();
    } else {
      setState('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        <span>Your name</span>
        <input name="name" minLength={2} required placeholder="How should I address you?" />
      </label>
      <label>
        <span>Email address</span>
        <input name="email" type="email" required placeholder="you@example.com" />
      </label>
      <label className="full-field">
        <span>What are we building?</span>
        <textarea name="message" minLength={10} maxLength={3000} required placeholder="Tell me about the idea, the ambition and where you need help." />
      </label>
      <input className="honey" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button disabled={state === 'sending'} type="submit">
        {state === 'sent' ? <><Check /> Message Sent</> : <>{state === 'sending' ? 'Sending…' : 'Send an introduction'} <ArrowUpRight /></>}
      </button>
      {state === 'error' && <p role="alert">The private inbox is not connected yet. Reach me through one of the social links below.</p>}
    </form>
  );
}

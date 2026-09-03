'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function DiscordCopy() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText('mastoi_yamin10');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <button className="discord-row" type="button" onClick={copy} title="Copy mastoi_yamin10"><span>07</span><h3>Discord</h3><p>{copied ? 'Copied' : 'mastoi_yamin10'}</p>{copied ? <Check /> : <Copy />}</button>;
}

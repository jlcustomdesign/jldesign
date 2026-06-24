/** ui.tsx — small reusable form controls for the admin. */
import React, { useRef, useState } from 'react';
import { fileToDataUrl } from './api';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="adm-field">
      <label>
        {label} {hint && <span className="hint">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="adm-input" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="adm-textarea" {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="adm-select" {...props} />;
}

/**
 * Image picker. `value` is either a public path ("/assets/..."), a data URL, or ''.
 * Emits a JPEG data URL (downscaled) on selection.
 */
export function ImageInput({
  value,
  onChange,
  small,
  aspect,
}: {
  value?: string;
  onChange: (dataUrl: string) => void;
  small?: boolean;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`adm-image${small ? ' small' : ''}`}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {value ? (
        <img className="preview" src={value} alt="" style={aspect ? { aspectRatio: aspect } : undefined} />
      ) : (
        <div className="drop" onClick={() => ref.current?.click()}>
          {busy ? 'Se procesează…' : '＋ Adaugă imagine (click pentru a alege)'}
        </div>
      )}
      {value && (
        <div className="bar">
          <button type="button" className="adm-btn ghost sm" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? 'Se procesează…' : 'Schimbă'}
          </button>
          <button type="button" className="adm-btn danger sm" onClick={() => onChange('')}>
            Elimină
          </button>
        </div>
      )}
    </div>
  );
}

/** Minimal markdown editor with a small toolbar. */
export function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after = before, placeholder = 'text') => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    });
  };

  const prefixLine = (prefix: string) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart));
  };

  return (
    <div>
      <div className="adm-md-toolbar">
        <button type="button" onClick={() => prefixLine('## ')}>H2</button>
        <button type="button" onClick={() => prefixLine('### ')}>H3</button>
        <button type="button" onClick={() => wrap('**')}><b>B</b></button>
        <button type="button" onClick={() => wrap('*')}><i>I</i></button>
        <button type="button" onClick={() => prefixLine('- ')}>• Listă</button>
        <button type="button" onClick={() => wrap('[', '](https://)', 'link')}>🔗 Link</button>
        <button type="button" onClick={() => wrap('> ', '', 'citat')}>❝ Citat</button>
      </div>
      <textarea
        ref={ref}
        className="adm-textarea"
        style={{ minHeight: 220, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Scrie conținutul articolului în format Markdown…"
      />
    </div>
  );
}

export function Toast({ msg, kind }: { msg: string; kind: 'ok' | 'err' | '' }) {
  if (!msg) return null;
  return <div className={`adm-toast ${kind}`}>{msg}</div>;
}

export function SectionHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="adm-sec-head">
      <div style={{ flex: 1 }}>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

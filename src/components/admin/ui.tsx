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

/** Multi-tag input (chips + free text). */
export function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => { const v = draft.trim(); if (v && !tags.includes(v)) onChange([...tags, v]); setDraft(''); };
  return (
    <div className="tag-input">
      {tags.map((t, i) => (
        <span className="tag-chip" key={i}>{t}<button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'text-bottom'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></span>
      ))}
      <input
        className="tag-add"
        value={draft}
        placeholder={tags.length ? 'Adaugă…' : placeholder || 'Adaugă etichetă (ex: Bucătărie, Dormitor)…'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          else if (e.key === 'Backspace' && !draft && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={add}
      />
    </div>
  );
}

/**
 * Image picker. `value` is either a public path ("/assets/..."), a data URL, or ''.
 * Emits a JPEG data URL (downscaled) on selection.
 */
let _imgCache: Promise<string[]> | null = null;
const loadLibrary = () =>
  (_imgCache ||= fetch('/api/admin/images').then((r) => r.json()).then((d) => d.images || []).catch(() => []));

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
  const [drag, setDrag] = useState(false);
  const [lib, setLib] = useState<string[] | null>(null); // null = closed

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try { onChange(await fileToDataUrl(file)); }
    catch (e) { alert((e as Error).message); }
    finally { setBusy(false); }
  };
  const openLib = async () => { setLib([]); setLib(await loadLibrary()); };

  return (
    <div
      className={`adm-image${small ? ' small' : ''}${drag ? ' drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
    >
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => pick(e.target.files?.[0])} />
      <button
        type="button"
        className="ai-thumb"
        style={value ? { backgroundImage: `url("${value}")`, ...(aspect ? { aspectRatio: aspect } : {}) } : undefined}
        onClick={() => ref.current?.click()}
        title={value ? 'Schimbă imaginea' : 'Încarcă imagine'}
      >
        {busy ? <span className="ai-spin" /> : !value && <span className="ai-plus" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>}
      </button>
      <div className="ai-acts">
        <button type="button" onClick={() => ref.current?.click()} disabled={busy}>{value ? 'Schimbă' : 'Încarcă'}</button>
        <button type="button" onClick={openLib}>Bibliotecă</button>
        {value && <button type="button" className="rm" onClick={() => onChange('')}>Elimină</button>}
      </div>

      {lib !== null && (
        <div className="img-lib" onClick={() => setLib(null)}>
          <div className="img-lib-box" onClick={(e) => e.stopPropagation()}>
            <div className="img-lib-head"><span>Alege o imagine din bibliotecă</span><button type="button" onClick={() => setLib(null)}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'text-bottom'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>
            <div className="img-lib-grid">
              {lib.length === 0 ? (
                <div className="img-lib-empty">Se încarcă…</div>
              ) : (
                lib.map((src) => (
                  <button key={src} type="button" className="img-lib-item" style={{ backgroundImage: `url("${src}")` }} title={src.split('/').pop()} onClick={() => { onChange(src); setLib(null); }} />
                ))
              )}
            </div>
          </div>
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

/** ui.tsx — small reusable form controls for the admin. */
import React, { useRef, useState, useEffect } from 'react';
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

/** Convert Markdown to semantic HTML for editing in the WYSIWYG surface. */
function markdownToHtml(md: string): string {
  if (!md || !md.trim()) return '<p><br /></p>';

  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { htmlParts.push('</ul>'); inUl = false; }
    if (inOl) { htmlParts.push('</ol>'); inOl = false; }
  };

  const formatInline = (str: string) => {
    let s = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    s = s.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return s || '<br />';
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      closeLists();
      continue;
    }

    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      closeLists();
      htmlParts.push('<hr />');
      continue;
    }

    if (trimmed.startsWith('### ')) {
      closeLists();
      htmlParts.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      closeLists();
      const content = trimmed.replace(/^#+\s*/, '');
      htmlParts.push(`<h2>${formatInline(content)}</h2>`);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      closeLists();
      htmlParts.push(`<blockquote>${formatInline(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    // Bullet list item
    const bulletMatch = raw.match(/^(\s*)[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      if (!inUl) { htmlParts.push('<ul>'); inUl = true; }
      htmlParts.push(`<li>${formatInline(bulletMatch[2])}</li>`);
      continue;
    }

    // Numbered list item
    const numMatch = raw.match(/^(\s*)\d+\.\s+(.*)$/);
    if (numMatch) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (!inOl) { htmlParts.push('<ol>'); inOl = true; }
      htmlParts.push(`<li>${formatInline(numMatch[2])}</li>`);
      continue;
    }

    // Normal paragraph line
    closeLists();
    htmlParts.push(`<p>${formatInline(raw)}</p>`);
  }

  closeLists();
  return htmlParts.join('') || '<p><br /></p>';
}

/** Convert rendered HTML back to clean, standardized Markdown for saving to the repository. */
function htmlToMarkdown(html: string): string {
  if (typeof document === 'undefined') return html;

  const temp = document.createElement('div');
  temp.innerHTML = html;

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(walk).join('');

    switch (tag) {
      case 'h1':
      case 'h2':
        return `\n\n## ${children.trim()}\n\n`;
      case 'h3':
      case 'h4':
        return `\n\n### ${children.trim()}\n\n`;
      case 'strong':
      case 'b':
        return children ? `**${children}**` : '';
      case 'em':
      case 'i':
        return children ? `*${children}*` : '';
      case 'a':
        return `[${children}](${el.getAttribute('href') || '#'})`;
      case 'blockquote':
        return `\n\n> ${children.trim()}\n\n`;
      case 'hr':
        return '\n\n---\n\n';
      case 'br':
        return '\n';
      case 'li': {
        const parentTag = el.parentElement?.tagName.toLowerCase();
        if (parentTag === 'ol') {
          const idx = Array.from(el.parentElement?.children || []).indexOf(el) + 1;
          return `${idx}. ${children.trim()}\n`;
        }
        return `- ${children.trim()}\n`;
      }
      case 'ul':
      case 'ol':
        return `\n\n${children.trim()}\n\n`;
      case 'p': {
        const trimmed = children.trim();
        return trimmed ? `\n\n${trimmed}\n\n` : '';
      }
      case 'div': {
        const trimmed = children.trim();
        return trimmed ? `\n${trimmed}` : '';
      }
      default:
        return children;
    }
  }

  const rawMd = walk(temp);
  return rawMd
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** True WYSIWYG Visual Editor with localized list toggling and predictable Enter behavior. */
export function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef(false);

  // Initialize and synchronize HTML when value updates from outside
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    const targetHtml = markdownToHtml(value);
    if (editorRef.current.innerHTML !== targetHtml) {
      editorRef.current.innerHTML = targetHtml;
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    isInternalChangeRef.current = true;
    const currentHtml = editorRef.current.innerHTML;
    const md = htmlToMarkdown(currentHtml);
    onChange(md);
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    emitChange();
  };

  const formatBlock = (tag: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    // If inside a list item, first convert out of list
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let cur: Node | null = sel.anchorNode;
      while (cur && cur !== editorRef.current) {
        if (cur.nodeName === 'LI') {
          document.execCommand('insertUnorderedList', false);
          break;
        }
        cur = cur.parentNode;
      }
    }
    document.execCommand('formatBlock', false, tag);
    emitChange();
  };

  const toggleList = (ordered: boolean) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    document.execCommand(command, false);
    emitChange();
  };

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    blockquote: false,
  });

  const updateActiveStyles = () => {
    if (!editorRef.current) return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUl = document.queryCommandState('insertUnorderedList');
      const isOl = document.queryCommandState('insertOrderedList');

      const sel = window.getSelection();
      let isH2 = false;
      let isH3 = false;
      let isQuote = false;

      if (sel && sel.anchorNode) {
        let cur: Node | null = sel.anchorNode;
        while (cur && cur !== editorRef.current) {
          if (cur.nodeName === 'H2') isH2 = true;
          if (cur.nodeName === 'H3') isH3 = true;
          if (cur.nodeName === 'BLOCKQUOTE') isQuote = true;
          cur = cur.parentNode;
        }
      }

      setActiveStyles({
        bold: isBold,
        italic: isItalic,
        h2: isH2,
        h3: isH3,
        ul: isUl,
        ol: isOl,
        blockquote: isQuote,
      });
    } catch {
      // Ignore queryCommandState issues if unfocused
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      let liNode: HTMLElement | null = null;
      let cur: Node | null = range.startContainer;

      while (cur && cur !== editorRef.current) {
        if (cur.nodeName === 'LI') {
          liNode = cur as HTMLElement;
          break;
        }
        cur = cur.parentNode;
      }

      // If pressing Enter on an EMPTY list item, exit the list immediately and create a regular paragraph aligned to the left
      if (liNode && !liNode.textContent?.trim()) {
        e.preventDefault();
        const listParent = liNode.parentElement;
        liNode.remove();

        const p = document.createElement('p');
        p.innerHTML = '<br>';

        if (listParent && listParent.parentNode) {
          if (listParent.children.length === 0) {
            listParent.parentNode.replaceChild(p, listParent);
          } else {
            listParent.parentNode.insertBefore(p, listParent.nextSibling);
          }

          // Move cursor to the new regular paragraph with standard zero-indent margin
          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);

          emitChange();
          updateActiveStyles();
        }
      }
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt('Introdu link-ul (ex: https://...):');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleInsertDivider = () => {
    exec('insertHorizontalRule');
  };

  return (
    <div className="adm-wysiwyg">
      <div className="adm-wysiwyg-toolbar">
        <button
          type="button"
          title="Titlu secțiune"
          className={activeStyles.h2 ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('<h2>'); }}
        >
          H2 Titlu
        </button>
        <button
          type="button"
          title="Subtitlu secțiune"
          className={activeStyles.h3 ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('<h3>'); }}
        >
          H3 Subtitlu
        </button>
        <button
          type="button"
          title="Paragraf text normal"
          className={!activeStyles.h2 && !activeStyles.h3 && !activeStyles.ul && !activeStyles.ol && !activeStyles.blockquote ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('<p>'); }}
        >
          Text normal
        </button>
        <div className="sep" />
        <button
          type="button"
          title="Îngroșat (Bold)"
          className={activeStyles.bold ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          title="Cursiv (Italic)"
          className={activeStyles.italic ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
        >
          <i>I</i>
        </button>
        <div className="sep" />
        <button
          type="button"
          title="Listă cu buline (Puncte)"
          className={activeStyles.ul ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); toggleList(false); }}
        >
          • Puncte
        </button>
        <button
          type="button"
          title="Listă numerotată (1, 2, 3)"
          className={activeStyles.ol ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); toggleList(true); }}
        >
          1. Numerotată
        </button>
        <button
          type="button"
          title="Citat"
          className={activeStyles.blockquote ? 'is-active' : ''}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('<blockquote>'); }}
        >
          ❝ Citat
        </button>
        <div className="sep" />
        <button type="button" title="Adaugă Link" onMouseDown={(e) => { e.preventDefault(); handleInsertLink(); }}>🔗 Link</button>
        <button type="button" title="Linie despărțitoare" onMouseDown={(e) => { e.preventDefault(); handleInsertDivider(); }}>— Linie</button>
      </div>

      <div
        ref={editorRef}
        className="adm-wysiwyg-content"
        contentEditable
        suppressContentEditableWarning
        onInput={() => { emitChange(); updateActiveStyles(); }}
        onBlur={() => { emitChange(); updateActiveStyles(); }}
        onKeyUp={updateActiveStyles}
        onMouseUp={updateActiveStyles}
        onKeyDown={handleKeyDown}
        data-placeholder="Scrie articolul direct aici… Tastează liber, apasă Enter pentru un rând nou sau selectează textul pentru a-i aplica un stil."
      />

      <div style={{ padding: '6px 14px', background: '#faf9f5', borderTop: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>💡 Butoanele evidențiate cu negru indică stilul activ la poziția cursorului.</span>
        <span>Apasă Enter pe un punct gol pentru a reveni la marginea normală</span>
      </div>
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

/** Persistent island listing unpublished local drafts so the user can see
    and re-open them without guessing. */
export function PendingIsland({
  title,
  items,
  onEdit,
  onClearNew,
}: {
  title: string;
  items: { key: string; label: string; isNew: boolean }[];
  onEdit: (key: string) => void;
  onClearNew?: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="pending-island">
      <div className="pending-island-head">
        <span className="pending-island-title">{title}</span>
        <span className="pending-island-count">{items.length}</span>
      </div>
      <div className="pending-island-body">
        {items.map((it) => (
          <div key={it.key} className="pending-island-row">
            <span className="pending-island-label">
              {it.isNew && <span className="pending-island-new">Nou</span>}
              {it.label}
            </span>
            <div className="pending-island-actions">
              <button type="button" className="adm-btn ghost sm" onClick={() => onEdit(it.key)}>Editează</button>
              {it.isNew && onClearNew && (
                <button type="button" className="adm-btn danger sm" onClick={onClearNew} title="Șterge draftul nesalvat">Șterge</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Save/publish choice dialog. */
export function SavePrompt({
  open,
  onClose,
  onLocal,
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  onLocal: () => void;
  onPublish: () => void;
}) {
  if (!open) return null;
  return (
    <div className="adm-dialog" onClick={onClose}>
      <div className="adm-dialog-box" onClick={(e) => e.stopPropagation()}>
        <h4>Publici modificările acum?</h4>
        <p>Modificările sunt deja salvate în browser. Poți să le publici pe site acum sau să le păstrezi locale și să publici mai târziu.</p>
        <div className="adm-dialog-actions">
          <button className="adm-btn ghost" onClick={onClose}>Anulează</button>
          <button className="adm-btn" onClick={onLocal}>Salvează local și închide</button>
          <button className="adm-btn gold" onClick={onPublish}>Publică pe site</button>
        </div>
      </div>
    </div>
  );
}


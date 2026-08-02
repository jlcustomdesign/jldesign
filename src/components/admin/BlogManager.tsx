import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Entry } from './api';
import { saveEntry, deleteEntry } from './api';
import { Field, TextInput, TextArea, Select, ImageInput, MarkdownEditor, SectionHead, SavePrompt } from './ui';
import { readDraft, writeDraft, clearDraft } from './drafts';

const CATEGORIES = [
  { value: 'inspiratie', label: 'Inspirație & Design' },
  { value: 'ghid', label: 'Ghid Practic' },
  { value: 'materiale', label: 'Materiale & Tehnologii' },
  { value: 'proiecte', label: 'Proiecte Finalizate' },
  { value: 'noutati', label: 'Noutăți' },
];

interface Props {
  items: Entry[];
  notify: (msg: string, kind?: 'ok' | 'err') => void;
  reload: () => Promise<void>;
  openTarget?: { collection: 'blog'; slug?: string; isNew?: boolean } | null;
  onOpenHandled?: () => void;
}

interface Draft {
  slug?: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedDate: string;
  coverImage: string;
  coverImageAlt: string;
  body: string;
}

const today = () => new Date().toISOString().slice(0, 10);

const emptyDraft = (): Draft => ({
  title: '', description: '', category: 'inspiratie', author: 'JL Custom Design',
  publishedDate: today(), coverImage: '', coverImageAlt: '', body: '',
});

export default function BlogManager({ items, notify, reload, openTarget, onOpenHandled }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());
  const draftRef = useRef<Draft | null>(null);
  const lastSaved = useRef<string>('');
  draftRef.current = draft;
  const hideSlug = (slug: string) => setHiddenSlugs((prev) => new Set(prev).add(slug));
  const unhideSlug = (slug: string) => setHiddenSlugs((prev) => { const n = new Set(prev); n.delete(slug); return n; });

  const open = (e?: Entry) => {
    let server: Draft | null = null;
    if (e) {
      server = {
        slug: e.slug,
        title: e.data.title || '',
        description: e.data.description || '',
        category: e.data.category || 'inspiratie',
        author: e.data.author || 'JL Custom Design',
        publishedDate: String(e.data.publishedDate || today()).slice(0, 10),
        coverImage: e.data.coverImage || '',
        coverImageAlt: e.data.coverImageAlt || '',
        body: e.body || '',
      };
    }
    // For a NEW article, always start fresh. Use the separate resume action
    // to continue an unsaved new draft.
    const local = e ? readDraft<Draft>('blog', e.slug) : null;
    const restored = local && JSON.stringify(local) !== JSON.stringify(server);
    const next = local || server || emptyDraft();
    setDraft(next);
    lastSaved.current = JSON.stringify(server || next);
    if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
  };

  const resumeNew = () => {
    const d = readDraft<Draft>('blog', undefined);
    if (!d) return;
    setDraft(d);
    lastSaved.current = '';
    notify('Am restaurat articolul nou nesalvat', 'ok');
  };

  const publish = async () => {
    if (!draft) return;
    if (!draft.title.trim()) return notify('Adaugă un titlu', 'err');
    if (!draft.description.trim()) return notify('Adaugă o descriere SEO', 'err');
    if (!draft.coverImage) return notify('Adaugă o imagine de copertă', 'err');
    if (!draft.coverImageAlt.trim()) return notify('Adaugă textul alternativ al imaginii', 'err');
    const prevSlug = draft.slug;
    setBusy(true);
    try {
      await saveEntry({
        collection: 'blog',
        slug: draft.slug,
        data: {
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category,
          author: draft.author.trim() || 'JL Custom Design',
          publishedDate: draft.publishedDate,
          coverImage: draft.coverImage,
          coverImageAlt: draft.coverImageAlt.trim(),
        },
        body: draft.body,
      });
      await reload();
      notify(prevSlug ? 'Articol actualizat' : 'Articol publicat', 'ok');
      setDraft(null);
      clearDraft('blog', prevSlug);
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const openSavePrompt = () => {
    if (!draft) return;
    if (!draft.title.trim()) return notify('Adaugă un titlu', 'err');
    if (!draft.description.trim()) return notify('Adaugă o descriere SEO', 'err');
    if (!draft.coverImage) return notify('Adaugă o imagine de copertă', 'err');
    if (!draft.coverImageAlt.trim()) return notify('Adaugă textul alternativ al imaginii', 'err');
    setSavePrompt(true);
  };

  const saveLocal = () => {
    if (!draft) return;
    writeDraft('blog', draft.slug, draft);
    setSavePrompt(false);
    notify('Salvat în browser', 'ok');
    setDraft(null);
  };

  // Autosave to browser on every change.
  useEffect(() => {
    if (!draft) return;
    const t = setTimeout(() => {
      const d = draftRef.current;
      if (!d) return;
      writeDraft('blog', d.slug, d);
    }, 400);
    return () => clearTimeout(t);
  }, [draft]);

  // Warn before leaving only if the current draft is neither published nor
  // saved locally in the browser.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const d = draftRef.current;
      if (!d) return;
      const draft = readDraft<Draft>('blog', d.slug);
      const curJson = JSON.stringify(d);
      if (curJson === lastSaved.current || curJson === JSON.stringify(draft)) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Open a specific pending item requested from the global pending bar.
  useEffect(() => {
    if (!openTarget || draft) return;
    if (openTarget.isNew || !openTarget.slug) {
      const d = readDraft<Draft>('blog', undefined);
      if (d) { setDraft(d); lastSaved.current = ''; onOpenHandled?.(); }
    } else {
      const e = items.find((x) => x.slug === openTarget.slug);
      if (e) {
        const server = {
          slug: e.slug, title: e.data.title || '', description: e.data.description || '', category: e.data.category || 'inspiratie',
          author: e.data.author || 'JL Custom Design', publishedDate: String(e.data.publishedDate || today()).slice(0, 10),
          coverImage: e.data.coverImage || '', coverImageAlt: e.data.coverImageAlt || '', body: e.body || '',
        };
        const local = readDraft<Draft>('blog', e.slug);
        const restored = local && JSON.stringify(local) !== JSON.stringify(server);
        setDraft(local || server); lastSaved.current = JSON.stringify(server);
        if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
        onOpenHandled?.();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTarget]);

  const closeEditor = () => {
    const d = draftRef.current;
    if (!d) { setDraft(null); return; }
    const draft = readDraft<Draft>('blog', d.slug);
    const curJson = JSON.stringify(d);
    const dirty = curJson !== lastSaved.current && curJson !== JSON.stringify(draft);
    if (dirty && !window.confirm('Ai modificări nepublicate. Dacă închizi, rămân salvate în browser. Continui?')) return;
    setDraft(null);
  };

  const remove = async (e: Entry) => {
    if (!window.confirm(`Ștergi articolul „${e.data.title || e.slug}”?`)) return;
    hideSlug(e.slug);
    try {
      await deleteEntry('blog', e.slug);
      await reload();
      notify('Articol șters', 'ok');
    } catch (err) {
      unhideSlug(e.slug);
      notify((err as Error).message, 'err');
    }
  };

  if (draft) {
    return (
      <div className="adm-editor">
        <div className="adm-editor-head">
          <h3>{draft.slug ? 'Editează articol' : 'Articol nou'}</h3>
          <div className="adm-spacer" />
          <button className="adm-btn ghost" onClick={closeEditor} disabled={busy} title="Închide editorul și întoarce-te la listă">Anulează</button>
          <button className="adm-btn gold" onClick={openSavePrompt} disabled={busy} title="Alege: salvează local în browser sau publică pe site" style={{ marginLeft: 8 }}>Salvează</button>
        </div>

        <SavePrompt
          open={savePrompt}
          onClose={() => setSavePrompt(false)}
          onLocal={saveLocal}
          onPublish={() => { setSavePrompt(false); publish(); }}
        />

        <Field label="Titlu articol">
          <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Un titlu atractiv pentru cititori" />
        </Field>

        <Field label="Descriere SEO (meta)" hint="apare în Google · max ~160 caractere">
          <TextArea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={200} style={{ minHeight: 70 }} />
        </Field>

        <div className="adm-row">
          <Field label="Categorie">
            <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Data publicării">
            <TextInput type="date" value={draft.publishedDate} onChange={(e) => setDraft({ ...draft, publishedDate: e.target.value })} />
          </Field>
        </div>

        <Field label="Autor">
          <TextInput value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
        </Field>

        <div className="adm-row">
          <Field label="Imagine de copertă">
            <ImageInput value={draft.coverImage} onChange={(v) => setDraft({ ...draft, coverImage: v })} />
          </Field>
          <Field label="Text alternativ (SEO)" hint="descrie ce apare în imagine">
            <TextArea value={draft.coverImageAlt} onChange={(e) => setDraft({ ...draft, coverImageAlt: e.target.value })} style={{ minHeight: 70 }} />
          </Field>
        </div>

        <Field label="Conținut articol">
          <MarkdownEditor value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} />
        </Field>
      </div>
    );
  }

  const sorted = [...items].filter((e) => !hiddenSlugs.has(e.slug)).sort((a, b) =>
    String(b.data.publishedDate || '').localeCompare(String(a.data.publishedDate || ''))
  );

  return (
    <div>
      <SectionHead
        title="Blog"
        desc={`${items.length} articole`}
        action={<button className="adm-btn" onClick={() => open()} title="Adaugă un articol nou pe blog">＋ Articol nou</button>}
      />
      {sorted.length === 0 ? (
        <div className="adm-empty">Niciun articol încă. Apasă „Articol nou” pentru a scrie primul.</div>
      ) : (
        <div className="adm-grid">
          {sorted.map((e) => (
            <div className="adm-card" key={e.slug}>
              <div className={`thumb${e.data.coverImage ? '' : ' empty'}`} style={e.data.coverImage ? { backgroundImage: `url("${e.data.coverImage}")` } : undefined}>
                {!e.data.coverImage && 'fără imagine'}
              </div>
              <div className="body">
                <span className="badge">{CATEGORIES.find((c) => c.value === e.data.category)?.label || e.data.category}</span>
                <span className="title">{e.data.title || e.slug}</span>
                <span className="meta">{String(e.data.publishedDate || '').slice(0, 10)}</span>
              </div>
              <div className="actions">
                <a className="adm-btn ghost sm" href={`/blog/${e.slug}`} target="_blank" rel="noreferrer" title="Vezi articolul pe site">Vezi</a>
                <button className="adm-btn ghost sm" onClick={() => open(e)} title="Editează articolul">Editează</button>
                <button className="adm-btn danger sm" onClick={() => remove(e)} title="Șterge articolul definitiv">Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

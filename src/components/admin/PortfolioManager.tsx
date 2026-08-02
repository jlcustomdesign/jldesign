import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Entry } from './api';
import { saveEntry, deleteEntry } from './api';
import { Field, TextInput, Select, ImageInput, MarkdownEditor, SectionHead, SavePrompt } from './ui';
import { readDraft, writeDraft, clearDraft } from './drafts';

interface Props {
  items: Entry[];
  categories: Entry[];
  notify: (msg: string, kind?: 'ok' | 'err') => void;
  reload: () => Promise<void>;
}

interface Draft {
  slug?: string;
  name: string;
  category: string;
  image: string;
  body: string;
}

const emptyDraft = (cat: string): Draft => ({ name: '', category: cat, image: '', body: '' });

export default function PortfolioManager({ items, categories, notify, reload }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [imgOrient, setImgOrient] = useState<'portrait' | 'landscape' | null>(null);
  const draftRef = useRef<Draft | null>(null);
  const lastSaved = useRef<string>('');
  draftRef.current = draft;

  // Detect orientation of the selected image so the preview frame matches it.
  useEffect(() => {
    const url = draft?.image;
    if (!url) { setImgOrient(null); return; }
    const img = new Image();
    img.onload = () => setImgOrient(img.naturalWidth / img.naturalHeight > 1 ? 'landscape' : 'portrait');
    img.onerror = () => setImgOrient(null);
    img.src = url;
  }, [draft?.image]);

  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.data?.name || slug;

  const open = (e?: Entry) => {
    let server: Draft | null = null;
    if (e) {
      server = {
        slug: e.slug,
        name: e.data.name || '',
        category: e.data.category || categories[0]?.slug || '',
        image: e.data.image || '',
        body: e.body || '',
      };
    }
    const local = readDraft<Draft>('portfolio', e?.slug);
    const restored = local && JSON.stringify(local) !== JSON.stringify(server);
    const next = local || server || emptyDraft(categories[0]?.slug || '');
    setDraft(next);
    lastSaved.current = JSON.stringify(server || next);
    if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
  };

  const addCategory = async () => {
    const name = window.prompt('Numele noii categorii (ex: Bucătărie, Dormitor):');
    if (!name?.trim()) return;
    try {
      await saveEntry({ collection: 'categories', data: { name: name.trim() } });
      await reload();
      notify('Categorie adăugată', 'ok');
    } catch (e) {
      notify((e as Error).message, 'err');
    }
  };

  const publish = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return notify('Adaugă un titlu pentru proiect', 'err');
    if (!draft.image) return notify('Adaugă o imagine principală', 'err');
    const prevSlug = draft.slug;
    setBusy(true);
    try {
      const { slug } = await saveEntry({
        collection: 'portfolio',
        slug: draft.slug,
        data: { name: draft.name.trim(), category: draft.category, image: draft.image },
        body: draft.body,
      });
      await reload();
      notify(prevSlug ? 'Proiect actualizat' : 'Proiect adăugat', 'ok');
      setDraft(null);
      clearDraft('portfolio', prevSlug); clearDraft('portfolio', slug);
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const openSavePrompt = () => {
    if (!draft) return;
    if (!draft.name.trim()) return notify('Adaugă un titlu pentru proiect', 'err');
    if (!draft.image) return notify('Adaugă o imagine principală', 'err');
    setSavePrompt(true);
  };

  const saveLocal = () => {
    if (!draft) return;
    writeDraft('portfolio', draft.slug, draft);
    setSavePrompt(false);
    notify('Salvat în browser', 'ok');
  };

  // Autosave to browser on every change.
  useEffect(() => {
    if (!draft) return;
    const t = setTimeout(() => {
      const d = draftRef.current;
      if (!d) return;
      writeDraft('portfolio', d.slug, d);
    }, 400);
    return () => clearTimeout(t);
  }, [draft]);

  // Warn before leaving with unpublished changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const d = draftRef.current;
      if (!d || JSON.stringify(d) === lastSaved.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const remove = async (e: Entry) => {
    if (!window.confirm(`Ștergi proiectul „${e.data.name || e.slug}”?`)) return;
    try {
      await deleteEntry('portfolio', e.slug);
      await reload();
      notify('Proiect șters', 'ok');
    } catch (err) {
      notify((err as Error).message, 'err');
    }
  };

  const closeEditor = () => {
    const d = draftRef.current;
    const dirty = d && JSON.stringify(d) !== lastSaved.current;
    if (dirty && !window.confirm('Ai modificări nepublicate. Dacă închizi, rămân salvate în browser. Continui?')) return;
    setDraft(null);
  };

  if (draft) {
    return (
      <div className="adm-editor-fit">
        <div className="adm-editor-head" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{draft.slug ? 'Editează proiect' : 'Proiect nou'}</h3>
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

        <div className="ofb">
          <div className="ofb-form-col">
            <Field label="Titlu proiect" hint="numele afișat pe site">
              <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: Bucătărie modernă Coresi" />
            </Field>

            <Field label="Categorie">
              <div style={{ display: 'flex', gap: 8 }}>
                <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  {categories.length === 0 && <option value="">— nicio categorie —</option>}
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.data.name || c.slug}</option>
                  ))}
                </Select>
                <button type="button" className="adm-btn ghost" onClick={addCategory} title="Adaugă o categorie nouă">+ Categorie</button>
              </div>
            </Field>

            <Field label="Imagine principală" hint="fotografia proiectului (se convertește automat în WebP)">
              <ImageInput value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} onMeta={(m) => setImgOrient(m.orient)} />
            </Field>

            <Field label="Descriere proiect" hint="opțional — povestea din spatele designului">
              <MarkdownEditor value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} />
            </Field>
          </div>

          <div className="ofb-preview-col">
            <div className="ofb-preview-tip">Previzualizare — așa apare proiectul</div>
            <div className="pf-preview">
              <div className="pf-card">
                {draft.image
                  ? <div className={`pf-img${imgOrient === 'landscape' ? ' landscape' : ''}`} style={{ backgroundImage: `url("${draft.image}")` }} />
                  : <div className="pf-img empty">fără imagine</div>}
                <div className="pf-meta">
                  <span className="pf-cat">{catName(draft.category) || 'Categorie'}</span>
                  <span className="pf-name">{draft.name || 'Titlu proiect'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHead
        title="Portofoliu"
        desc={`${items.length} proiecte · ${categories.length} categorii`}
        action={<button className="adm-btn" onClick={() => open()} title="Adaugă un proiect nou în portofoliu">＋ Proiect nou</button>}
      />
      {items.length === 0 ? (
        <div className="adm-empty">Niciun proiect încă. Apasă „Proiect nou” pentru a începe.</div>
      ) : (
        <div className="adm-grid">
          {items.map((e) => (
            <div className="adm-card" key={e.slug}>
              <div className={`thumb${e.data.image ? '' : ' empty'}`} style={e.data.image ? { backgroundImage: `url("${e.data.image}")` } : undefined}>
                {!e.data.image && 'fără imagine'}
              </div>
              <div className="body">
                <span className="badge">{catName(e.data.category)}</span>
                <span className="title">{e.data.name || e.slug}</span>
              </div>
              <div className="actions">
                <button className="adm-btn ghost sm" onClick={() => open(e)} title="Editează proiectul">Editează</button>
                <button className="adm-btn danger sm" onClick={() => remove(e)} title="Șterge proiectul definitiv">Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

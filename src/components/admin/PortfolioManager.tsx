import React, { useState } from 'react';
import type { Entry } from './api';
import { saveEntry, deleteEntry } from './api';
import { Field, TextInput, Select, ImageInput, MarkdownEditor, SectionHead } from './ui';

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

  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.data?.name || slug;

  const open = (e?: Entry) => {
    if (e) {
      setDraft({
        slug: e.slug,
        name: e.data.name || '',
        category: e.data.category || categories[0]?.slug || '',
        image: e.data.image || '',
        body: e.body || '',
      });
    } else {
      setDraft(emptyDraft(categories[0]?.slug || ''));
    }
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

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return notify('Adaugă un titlu pentru proiect', 'err');
    if (!draft.image) return notify('Adaugă o imagine principală', 'err');
    setBusy(true);
    try {
      await saveEntry({
        collection: 'portfolio',
        slug: draft.slug,
        data: { name: draft.name.trim(), category: draft.category, image: draft.image },
        body: draft.body,
      });
      await reload();
      notify(draft.slug ? 'Proiect actualizat' : 'Proiect adăugat', 'ok');
      setDraft(null);
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

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

  if (draft) {
    return (
      <div className="adm-editor-fit">
        <div className="adm-editor-head" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{draft.slug ? 'Editează proiect' : 'Proiect nou'}</h3>
          <div className="adm-spacer" />
          <button className="adm-btn ghost" onClick={() => setDraft(null)} disabled={busy}>Anulează</button>
          <button className="adm-btn gold" onClick={save} disabled={busy} style={{ marginLeft: 8 }}>
            {busy ? 'Se salvează…' : 'Salvează'}
          </button>
        </div>

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
                <button type="button" className="adm-btn ghost" onClick={addCategory}>+ Categorie</button>
              </div>
            </Field>

            <Field label="Imagine principală" hint="fotografia proiectului (se convertește automat în WebP)">
              <ImageInput value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
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
                  ? <div className="pf-img" style={{ backgroundImage: `url("${draft.image}")` }} />
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
        action={<button className="adm-btn" onClick={() => open()}>＋ Proiect nou</button>}
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
                <button className="adm-btn ghost sm" onClick={() => open(e)}>Editează</button>
                <button className="adm-btn danger sm" onClick={() => remove(e)}>Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

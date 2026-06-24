import React, { useState } from 'react';
import type { Entry } from './api';
import { saveEntry, deleteEntry } from './api';
import { Field, TextInput, TextArea, Select, ImageInput, MarkdownEditor, SectionHead } from './ui';

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

export default function BlogManager({ items, notify, reload }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const open = (e?: Entry) => {
    if (e) {
      setDraft({
        slug: e.slug,
        title: e.data.title || '',
        description: e.data.description || '',
        category: e.data.category || 'inspiratie',
        author: e.data.author || 'JL Custom Design',
        publishedDate: String(e.data.publishedDate || today()).slice(0, 10),
        coverImage: e.data.coverImage || '',
        coverImageAlt: e.data.coverImageAlt || '',
        body: e.body || '',
      });
    } else setDraft(emptyDraft());
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim()) return notify('Adaugă un titlu', 'err');
    if (!draft.description.trim()) return notify('Adaugă o descriere SEO', 'err');
    if (!draft.coverImage) return notify('Adaugă o imagine de copertă', 'err');
    if (!draft.coverImageAlt.trim()) return notify('Adaugă textul alternativ al imaginii', 'err');
    setBusy(true);
    try {
      const { viewUrl } = await saveEntry({
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
      notify(draft.slug ? 'Articol actualizat' : `Articol publicat${viewUrl ? '' : ''}`, 'ok');
      setDraft(null);
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (e: Entry) => {
    if (!window.confirm(`Ștergi articolul „${e.data.title || e.slug}”?`)) return;
    try {
      await deleteEntry('blog', e.slug);
      await reload();
      notify('Articol șters', 'ok');
    } catch (err) {
      notify((err as Error).message, 'err');
    }
  };

  if (draft) {
    return (
      <div className="adm-editor">
        <div className="adm-editor-head">
          <h3>{draft.slug ? 'Editează articol' : 'Articol nou'}</h3>
          <div className="adm-spacer" />
          <button className="adm-btn ghost" onClick={() => setDraft(null)} disabled={busy}>Anulează</button>
          <button className="adm-btn gold" onClick={save} disabled={busy} style={{ marginLeft: 8 }}>
            {busy ? 'Se salvează…' : 'Publică'}
          </button>
        </div>

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

  const sorted = [...items].sort((a, b) =>
    String(b.data.publishedDate || '').localeCompare(String(a.data.publishedDate || ''))
  );

  return (
    <div>
      <SectionHead
        title="Blog"
        desc={`${items.length} articole`}
        action={<button className="adm-btn" onClick={() => open()}>＋ Articol nou</button>}
      />
      {items.length === 0 ? (
        <div className="adm-empty">Niciun articol încă. Apasă „Articol nou” pentru a scrie primul.</div>
      ) : (
        <div className="adm-grid">
          {sorted.map((e) => (
            <div className="adm-card" key={e.slug}>
              <div className={`thumb${e.data.coverImage ? '' : ' empty'}`} style={e.data.coverImage ? { backgroundImage: `url(${e.data.coverImage})` } : undefined}>
                {!e.data.coverImage && 'fără imagine'}
              </div>
              <div className="body">
                <span className="badge">{CATEGORIES.find((c) => c.value === e.data.category)?.label || e.data.category}</span>
                <span className="title">{e.data.title || e.slug}</span>
                <span className="meta">{String(e.data.publishedDate || '').slice(0, 10)}</span>
              </div>
              <div className="actions">
                <a className="adm-btn ghost sm" href={`/blog/${e.slug}`} target="_blank" rel="noreferrer">Vezi</a>
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

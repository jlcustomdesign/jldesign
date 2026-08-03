import React, { useEffect, useState, useCallback } from 'react';
import { fetchData, publishBatch, type AllData } from './api';
import { Toast } from './ui';
import PortfolioManager from './PortfolioManager';
import BlogManager from './BlogManager';
import OfferManager from './OfferManager';
import SiteContentManager from './SiteContentManager';
import { computePending, clearPendingDrafts, readSiteDraft, type PendingItem } from './pending';
import { readPendingDeletes, clearPendingDeletes, removePendingDelete } from './deletes';

type Tab = 'home' | 'portfolio' | 'blog' | 'offers' | 'site';

const SECTIONS: { id: Exclude<Tab, 'home'>; label: string; short: string; desc: string }[] = [
  { id: 'portfolio', label: 'Portofoliu', short: 'Portofoliu', desc: 'Proiecte și categorii' },
  { id: 'blog', label: 'Blog', short: 'Blog', desc: 'Articole și noutăți' },
  { id: 'offers', label: 'Generator oferte', short: 'Oferte', desc: 'Prezentări de proiect (PDF)' },
  { id: 'site', label: 'Conținut site', short: 'Conținut', desc: 'Texte și imagini din site' },
];

const SECTION_LABEL: Record<PendingItem['kind'], string> = {
  'offer-new': 'Oferte',
  'offer-edit': 'Oferte',
  'offer-delete': 'Oferte',
  'portfolio-new': 'Portofoliu',
  'portfolio-edit': 'Portofoliu',
  'portfolio-delete': 'Portofoliu',
  'blog-new': 'Blog',
  'blog-edit': 'Blog',
  'blog-delete': 'Blog',
  site: 'Conținut site',
};

export interface OpenTarget {
  collection: 'offers' | 'portfolio' | 'blog' | 'site';
  slug?: string;
  tempId?: string;
  isNew?: boolean;
}

export default function AdminApp({ user }: { user?: { name?: string | null; login?: string; avatar?: string } }) {
  const [tab, setTabRaw] = useState<Tab>(() => {
    try {
      const h = window.location.hash.replace('#', '');
      const parts = h.split('-');
      const t = parts[0] as Tab;
      if (t === 'home' || SECTIONS.find(s => s.id === t)) return t;
      return (sessionStorage.getItem('jl-adm-tab') as Tab) || 'home';
    } catch { return 'home'; }
  });

  const setTab = useCallback((t: Tab) => {
    setTabRaw(t);
    window.location.hash = t;
  }, []);

  useEffect(() => { try { sessionStorage.setItem('jl-adm-tab', tab); } catch {} }, [tab]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      const parts = h.split('-');
      const t = parts[0] as Tab;
      if (t === 'home' || SECTIONS.find(s => s.id === t)) {
        setTabRaw(t);
      } else if (!h) {
        setTabRaw('home');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [data, setData] = useState<AllData | null>(null);
  const [siteServer, setSiteServer] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' | '' }>({ msg: '', kind: '' });

  const notify = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast({ msg: '', kind: '' }), 3200);
  }, []);
  const reload = useCallback(async () => {
    try {
      const [all, site] = await Promise.all([fetchData(), fetch('/api/admin/site').then((r) => r.json())]);
      setData(all);
      setSiteServer(site);
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const [pending, setPending] = useState<PendingItem[]>([]);
  const [publishBusy, setPublishBusy] = useState(false);
  const [openTarget, setOpenTarget] = useState<OpenTarget | null>(null);
  const [pendingPanelOpen, setPendingPanelOpen] = useState(false);

  const recomputePending = useCallback(() => {
    setPending(computePending(data, siteServer));
  }, [data, siteServer]);

  useEffect(() => { recomputePending(); }, [recomputePending]);

  useEffect(() => {
    const onDraftChange = () => recomputePending();
    window.addEventListener('jl-draft-change', onDraftChange);
    return () => window.removeEventListener('jl-draft-change', onDraftChange);
  }, [recomputePending]);

  const publishAllPending = async () => {
    if (pending.length === 0) return;
    if (!window.confirm(`Publici ${pending.length} modificări pe site?`)) return;
    setPendingPanelOpen(false);
    setPublishBusy(true);
    try {
      const edits = pending
        .filter((it) => !it.kind.endsWith('-delete'))
        .map((it) => {
          if (it.collection === 'offers') {
            return { collection: 'offers' as const, slug: it.slug, data: it.draft };
          }
          if (it.collection === 'portfolio') {
            const d = it.draft;
            return {
              collection: 'portfolio' as const,
              slug: it.slug,
              data: { name: d.name?.trim() || '', category: d.category || '', image: d.image || '' },
              body: d.body || '',
            };
          }
          if (it.collection === 'blog') {
            const d = it.draft;
            return {
              collection: 'blog' as const,
              slug: it.slug,
              data: {
                title: d.title?.trim() || '',
                description: d.description?.trim() || '',
                category: d.category || 'inspiratie',
                author: d.author?.trim() || 'JL Custom Design',
                publishedDate: d.publishedDate || '',
                coverImage: d.coverImage || '',
                coverImageAlt: d.coverImageAlt?.trim() || '',
              },
              body: d.body || '',
            };
          }
          // site
          return { collection: 'site' as const, data: it.draft };
        });
      const deletes = readPendingDeletes();
      const { count } = await publishBatch({ edits, deletes });
      clearPendingDrafts(pending);
      clearPendingDeletes();
      await reload();
      notify(count ? `${count} modificări publicate într-un singur commit` : 'Nicio modificare de publicat', 'ok');
    } catch (e) {
      notify((e as Error).message, 'err');
    } finally {
      setPublishBusy(false);
    }
  };

  const grouped = pending.reduce((acc, it) => {
    const label = SECTION_LABEL[it.kind];
    acc[label] = acc[label] || [];
    acc[label].push(it);
    return acc;
  }, {} as Record<string, PendingItem[]>);

  const openPending = (it: PendingItem) => {
    const isNew = it.kind.endsWith('-new');
    const target: OpenTarget = {
      collection: it.collection,
      slug: it.slug,
      tempId: isNew ? (it as any).tempId : undefined,
      isNew,
    };
    if (it.collection === 'offers') setTab('offers');
    else if (it.collection === 'portfolio') setTab('portfolio');
    else if (it.collection === 'blog') setTab('blog');
    else if (it.collection === 'site') { setTab('site'); return; }
    setOpenTarget(target);
  };

  const counts: Record<string, number | undefined> = {
    portfolio: data?.portfolio.length, blog: data?.blog.length, offers: data?.offers.length,
  };

  return (
    <div className="adm">
      {/* Navbar — only inside a section, for quick switching. */}
      {tab !== 'home' && (
        <header className="adm-nav">
          <div className="adm-nav-in">
            <button className="adm-logo" onClick={() => setTab('home')}>JL Custom Design</button>
            <ul className="adm-links">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button className="adm-link" aria-current={tab === s.id ? 'true' : undefined} onClick={() => setTab(s.id)}>
                    {s.label}<span className="adm-ul" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="adm-nav-actions" style={{ position: 'relative', zIndex: 55, display: 'flex', alignItems: 'center', gap: 10 }}>
              <a className="adm-cta" href="/api/admin/logout">Ieșire</a>
            </div>
          </div>
        </header>
      )}

      <div className={tab === 'home' ? 'adm-home' : 'adm-shell'}>
        {/* Dashboard hub */}
        {tab === 'home' && (
          <>
            <div className="adm-home-top">
              <span className="adm-home-brand">JL Custom Design</span>
              <span className="adm-home-user">{user?.name || user?.login} · <a href="/api/admin/logout">Ieșire</a></span>
            </div>
            <h1 className="adm-home-title">Panou de administrare</h1>
            <p className="adm-home-sub">Alege ce vrei să administrezi.</p>
            <div className="adm-home-grid">
              {SECTIONS.map((s, i) => (
                <button key={s.id} className="adm-home-card" onClick={() => setTab(s.id)}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  {typeof counts[s.id] === 'number' && <span className="count">{counts[s.id]}</span>}
                  <span className="t">{s.label}</span>
                  <span className="d">{s.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Sections */}
        {tab !== 'home' && (
          tab === 'site' ? (
            <SiteContentManager notify={notify} />
          ) : (
            <>
              {error && <div className="adm-empty" style={{ color: 'var(--danger)' }}>Eroare: {error}</div>}
              {!data && !error && <div className="adm-loading"><span className="adm-spin" /> Se încarcă…</div>}
              {data && (
                <>
                  {tab === 'portfolio' && <PortfolioManager items={data.portfolio} categories={data.categories} notify={notify} reload={reload} openTarget={openTarget?.collection === 'portfolio' ? openTarget : null} onOpenHandled={() => setOpenTarget(null)} />}
                  {tab === 'blog' && <BlogManager items={data.blog} notify={notify} reload={reload} openTarget={openTarget?.collection === 'blog' ? openTarget : null} onOpenHandled={() => setOpenTarget(null)} />}
                  {tab === 'offers' && <OfferManager items={data.offers} notify={notify} reload={reload} openTarget={openTarget?.collection === 'offers' ? openTarget : null} onOpenHandled={() => setOpenTarget(null)} />}
                </>
              )}
            </>
          )
        )}
      </div>

      {/* Bottom dock — mobile navigation (so logout isn't the only reachable control) */}
      <nav className="adm-dock">
        <button className="adm-dock-btn" aria-current={tab === 'home' ? 'true' : undefined} onClick={() => setTab('home')}>Acasă</button>
        {SECTIONS.map((s) => (
          <button key={s.id} className="adm-dock-btn" aria-current={tab === s.id ? 'true' : undefined} onClick={() => setTab(s.id)}>{s.short}</button>
        ))}
      </nav>

      {/* Floating pending changes button + panel */}
      {pending.length > 0 && (
        <>
          <button
            className="adm-pending-fab"
            onClick={() => setPendingPanelOpen((v) => !v)}
            title={`${pending.length} modificări nesalvate`}
            aria-label="Modificări nesalvate"
          >
            <span className="adm-pending-fab-icon">✎</span>
            <span className="adm-pending-fab-count">{pending.length}</span>
          </button>

          {pendingPanelOpen && (
            <div className="adm-pending-panel" onClick={() => setPendingPanelOpen(false)}>
              <div className="adm-pending-panel-box" onClick={(e) => e.stopPropagation()}>
                <div className="adm-pending-panel-head">
                  <h4>Modificări nesalvate ({pending.length})</h4>
                  <button className="adm-pending-panel-close" onClick={() => setPendingPanelOpen(false)} aria-label="Închide">✕</button>
                </div>
                <p className="adm-pending-panel-hint">Salvate doar în browser. Alege una pentru editare sau publică-le pe toate.</p>
                <div className="adm-pending-panel-body">
                  {Object.entries(grouped).map(([section, items]) => (
                    <div key={section} className="adm-pending-panel-group">
                      <div className="adm-pending-panel-section">{section}</div>
                      {items.map((it, idx) => {
                        const isDelete = it.kind.endsWith('-delete');
                        return (
                          <div key={idx} className="adm-pending-panel-row">
                            <span className="adm-pending-panel-title">
                              {it.kind.includes('new') && <span className="adm-pending-panel-new">Nou</span>}
                              {isDelete && <span className="adm-pending-panel-new" style={{ background: 'var(--danger)' }}>Șters</span>}
                              <span>{it.title}</span>
                            </span>
                            <div className="adm-pending-panel-row-actions">
                              {!isDelete && (
                                <button className="adm-btn ghost sm" onClick={() => { setPendingPanelOpen(false); openPending(it); }}>Editează</button>
                              )}
                              {isDelete ? (
                                <button
                                  className="adm-btn ghost sm"
                                  onClick={() => { removePendingDelete(it.collection, it.slug!); notify('Ștergere anulată — reîncarc lista', 'ok'); }}
                                  title="Anulează ștergerea"
                                >
                                  Anulează
                                </button>
                              ) : (
                                <button
                                  className="adm-btn danger sm"
                                  onClick={() => { if (window.confirm(`Ștergi modificările locale pentru „${it.title}"?`)) clearPendingDrafts([it]); }}
                                  title="Șterge draftul local"
                                >
                                  Șterge
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="adm-pending-panel-actions">
                  <button className="adm-btn ghost" onClick={() => setPendingPanelOpen(false)}>Închide</button>
                  <button className="adm-btn gold" onClick={publishAllPending} disabled={publishBusy}>
                    {publishBusy ? 'Se publică…' : `Publică toate (${pending.length})`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Toast msg={toast.msg} kind={toast.kind} />
    </div>
  );
}

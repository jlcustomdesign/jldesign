import React, { useEffect, useState, useCallback } from 'react';
import { fetchData, type AllData } from './api';
import { Toast } from './ui';
import PortfolioManager from './PortfolioManager';
import BlogManager from './BlogManager';
import OfferManager from './OfferManager';
import SiteContentManager from './SiteContentManager';

type Tab = 'home' | 'portfolio' | 'blog' | 'offers' | 'site';

const SECTIONS: { id: Exclude<Tab, 'home'>; label: string; short: string; desc: string }[] = [
  { id: 'portfolio', label: 'Portofoliu', short: 'Portofoliu', desc: 'Proiecte și categorii' },
  { id: 'blog', label: 'Blog', short: 'Blog', desc: 'Articole și noutăți' },
  { id: 'offers', label: 'Generator oferte', short: 'Oferte', desc: 'Prezentări de proiect (PDF)' },
  { id: 'site', label: 'Conținut site', short: 'Conținut', desc: 'Texte și imagini din site' },
];

export default function AdminApp({ user }: { user?: { name?: string | null; login?: string; avatar?: string } }) {
  const [tab, setTab] = useState<Tab>(() => {
    try { return (sessionStorage.getItem('jl-adm-tab') as Tab) || 'home'; } catch { return 'home'; }
  });
  useEffect(() => { try { sessionStorage.setItem('jl-adm-tab', tab); } catch {} }, [tab]);

  const [data, setData] = useState<AllData | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' | '' }>({ msg: '', kind: '' });

  const notify = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast({ msg: '', kind: '' }), 3200);
  }, []);
  const reload = useCallback(async () => {
    try { setData(await fetchData()); } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

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
            <a className="adm-cta" href="/api/admin/logout">Ieșire</a>
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
                  {tab === 'portfolio' && <PortfolioManager items={data.portfolio} categories={data.categories} notify={notify} reload={reload} />}
                  {tab === 'blog' && <BlogManager items={data.blog} notify={notify} reload={reload} />}
                  {tab === 'offers' && <OfferManager items={data.offers} notify={notify} reload={reload} />}
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

      <Toast msg={toast.msg} kind={toast.kind} />
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import { fetchData, type AllData } from './api';
import { Toast } from './ui';
import PortfolioManager from './PortfolioManager';
import BlogManager from './BlogManager';
import OfferManager from './OfferManager';
import SiteContentManager from './SiteContentManager';

type Tab = 'portfolio' | 'blog' | 'offers' | 'site';

export default function AdminApp({ user }: { user?: { name?: string | null; login?: string; avatar?: string } }) {
  const [tab, setTab] = useState<Tab>(() => {
    try { return (sessionStorage.getItem('jl-adm-tab') as Tab) || 'portfolio'; } catch { return 'portfolio'; }
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
    try {
      setData(await fetchData());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'portfolio', label: 'Portofoliu', count: data?.portfolio.length },
    { id: 'blog', label: 'Blog', count: data?.blog.length },
    { id: 'offers', label: 'Generator oferte', count: data?.offers.length },
    { id: 'site', label: 'Conținut site' },
  ];

  return (
    <div className="adm">
      <header className="adm-nav">
        <div className="adm-nav-in">
          <a className="adm-logo" href="/">JL <b>Custom Design</b></a>
          <nav className="adm-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className="adm-tab"
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {typeof t.count === 'number' && <span className="count">{t.count}</span>}
              </button>
            ))}
          </nav>
          <div className="adm-nav-right">
            {user && (
              <div className="adm-user">
                {user.avatar && <img src={user.avatar} alt="" />}
                <span>{user.name || user.login}</span>
              </div>
            )}
            <a className="adm-btn ghost sm" href="/api/admin/logout">Ieșire</a>
          </div>
        </div>
      </header>

      <div className="adm-shell">
        {error && <div className="adm-empty" style={{ color: 'var(--danger)' }}>Eroare: {error}</div>}

        {tab === 'site' ? (
          <SiteContentManager notify={notify} />
        ) : (
          <>
            {!data && !error && (
              <div className="adm-loading"><span className="adm-spin" /> Se încarcă conținutul…</div>
            )}
            {data && (
              <>
                {tab === 'portfolio' && (
                  <PortfolioManager items={data.portfolio} categories={data.categories} notify={notify} reload={reload} />
                )}
                {tab === 'blog' && <BlogManager items={data.blog} notify={notify} reload={reload} />}
                {tab === 'offers' && <OfferManager items={data.offers} notify={notify} reload={reload} />}
              </>
            )}
          </>
        )}
      </div>

      <Toast msg={toast.msg} kind={toast.kind} />
    </div>
  );
}

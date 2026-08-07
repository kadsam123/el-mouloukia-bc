import React from 'react';
import { Database, Globe, ShieldCheck, UserCircle } from 'lucide-react';

export function TopNav({
  t,
  authBadge,
  lang,
  setLang,
  view,
  setView,
  myProfile,
  setEditObject,
  setActiveHurdle,
  isAdminAuthenticated
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('directory'); setActiveHurdle(null); setEditObject(null); }}>
          <div className="w-10 h-10 bg-[#1f3a56] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter leading-none">{t.appName || t.brand}</h1>
            <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">{t.poweredByBrand || `${t.brand} ${t.subBrand}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.12em] ${authBadge.style}`}>
            {authBadge.text}
          </span>
          <div className="flex items-center gap-2 px-2 py-1 border border-stone-200 rounded-xl bg-white">
            <Globe size={16} className="text-stone-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-[10px] font-black uppercase tracking-wider text-stone-500 bg-transparent outline-none"
              aria-label={t.languageLabel}
            >
              <option value="en">{t.langEnglish}</option>
              <option value="fr">{t.langFrench}</option>
              <option value="ar">{t.langArabic}</option>
            </select>
          </div>
          <button onClick={() => setView('directory')} className={`text-[11px] font-black uppercase tracking-widest hidden sm:block ${view === 'directory' ? 'text-[#2f6ea8]' : 'text-stone-400'}`}>{t.navDirectory}</button>
          {!myProfile && (
            <button onClick={() => { setEditObject(null); setView('register'); }} className="bg-[#1f3a56] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 hover:bg-[#2b5c8f]">
              {t.navJoin}
            </button>
          )}
          <button onClick={() => setView('profile')} className={`p-2 rounded-full border transition-all ${view === 'profile' ? 'border-[#2f6ea8] text-[#2f6ea8]' : 'border-transparent text-stone-400'}`}><UserCircle size={22} /></button>
          <button onClick={() => setView('admin')} className={`p-2 rounded-full transition-colors ${isAdminAuthenticated ? 'bg-emerald-50 text-emerald-600' : 'text-stone-200 hover:text-stone-400'}`}><ShieldCheck size={18} /></button>
        </div>
      </div>
    </nav>
  );
}

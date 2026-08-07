import React from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  Coins,
  HelpCircle,
  Radio,
  Search,
  Share2,
  Zap,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { normalizeSectorKey } from '../../../shared/utils/sectorKeys';
import { NarrativeLedgerWidget } from '../../directory/components/NarrativeLedgerWidget.jsx';

export function DirectoryPage({
  t,
  lang,
  liveFeed,
  MARKET_CONFIG,
  marketHealth,
  setEditObject,
  setView,
  hurdles,
  activeHurdle,
  setActiveHurdle,
  CATEGORIES,
  getTopMatches,
  filter,
  setFilter,
  search,
  setSearch,
  filtered,
  copyFeedback,
  setCopyFeedback,
  analyzeExpert,
  myProfile,
  analyzingId
}) {
  const findCategory = (sector) => CATEGORIES.find((c) => c.id === normalizeSectorKey(sector));

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-[#2f6ea8] animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2f6ea8]">{t.newsroom}</h2>
          </div>
          <div className="space-y-2">
            {liveFeed.length > 0 ? liveFeed.map((item) => (
              <div key={item.id} className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-[#2f6ea8]/20 transition-all group">
                <span className="text-[8px] font-black uppercase bg-stone-50 px-2 py-0.5 rounded text-stone-400">{item.type}</span>
                <p className="text-[11px] font-bold text-stone-800 leading-tight mt-1 truncate">{item.label}</p>
              </div>
            )) : <p className="text-xs text-stone-300 italic px-2">{t.scanningFrequencies}</p>}
          </div>

          <NarrativeLedgerWidget lang={lang} />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#1c3148] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Radio size={16} className="text-[#7dd3fc]" /> {t.liveHurdles}</h3>
              <button onClick={() => { setEditObject(null); setView('submitHurdle'); }} className="text-[10px] bg-white/10 px-4 py-2 rounded-full font-bold hover:bg-white/20 transition-all border border-white/5">{t.submitHurdle} +</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {hurdles.slice(0, 3).length > 0 ? hurdles.slice(0, 3).map((h) => (
                <div key={h.id} onClick={() => setActiveHurdle(activeHurdle?.id === h.id ? null : h)} className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeHurdle?.id === h.id ? 'border-[#60a5fa] bg-white/5' : 'border-white/10 hover:border-white/20'}`}>
                  <p className="text-[9px] font-black text-[#93c5fd] mb-1 uppercase tracking-wider">
                    {findCategory(h.sector)?.label[lang] || t.generalSignal}
                  </p>
                  <p className="text-sm font-bold truncate mb-3">{h.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {getTopMatches(h).map((m) => (
                        <div key={m.id} className="w-6 h-6 rounded-full bg-stone-800 border-2 border-[#1c3148] flex items-center justify-center text-[8px] font-black text-white">{m.name?.[0] || 'N'}</div>
                      ))}
                    </div>
                    {h.frictionCost && <span className="text-[9px] font-black text-rose-400 tracking-tighter">-{parseInt(h.frictionCost, 10).toLocaleString()} {MARKET_CONFIG.currency}</span>}
                  </div>
                </div>
              )) : (
                <div className="col-span-3 py-6 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs text-white/20 font-serif italic">{t.noSystemicHurdles}</p>
                </div>
              )}
            </div>
          </div>

          <div className={lang === 'ar' ? 'text-right' : ''}>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-[#1a2d3f] leading-[0.9] mb-4">
              {t.heroTitle} <span className="text-[#2f6ea8] italic">{t.heroTitleItalic}</span> {t.heroTitleEnd}
            </h2>
            <p className="text-stone-400 font-serif italic text-lg max-w-xl">{t.heroSub}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-stone-300`} size={18} />
              <input type="text" placeholder={t.searchPlaceholder} className={`w-full ${lang === 'ar' ? 'pr-12' : 'pl-12'} py-4 bg-white border border-stone-100 rounded-2xl outline-none shadow-sm focus:border-[#2f6ea8]/30 transition-all`} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => { setFilter('all'); setActiveHurdle(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${filter === 'all' && !activeHurdle ? 'bg-[#1c3148] text-white border-[#1c3148]' : 'bg-white text-stone-400 border-stone-100'}`}>{t.allSectors}</button>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => { setFilter(cat.id); setActiveHurdle(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${filter === cat.id ? 'bg-[#2f6ea8] text-white border-[#2f6ea8]' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}>{cat.label[lang]}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.length > 0 ? filtered.map((expert) => (
              <div key={expert.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${findCategory(expert.sector)?.color || 'bg-stone-50'}`}>
                    {React.createElement(findCategory(expert.sector)?.icon || HelpCircle, { size: 24 })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const url = `${window.location.href.split('?')[0]}?q=${encodeURIComponent(expert.name || '')}`;
                        navigator.clipboard.writeText(url);
                        setCopyFeedback(expert.id);
                        setTimeout(() => setCopyFeedback(null), 2000);
                      }}
                      className={`p-2 rounded-xl border transition-all ${copyFeedback === expert.id ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'text-stone-300 border-transparent hover:border-stone-100'}`}
                    >
                      {copyFeedback === expert.id ? <Check size={18} /> : <Share2 size={18} />}
                    </button>
                  </div>
                </div>
                <h4 className="text-3xl font-serif font-black mb-1">{expert.name || t.anonymousExpert}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2f6ea8] mb-1">{expert.title || t.verifiedNode}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400 mb-6 italic">{findCategory(expert.sector)?.label[lang] || t.general}</p>
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-50">
                    <span className="text-[8px] font-black uppercase text-[#2f6ea8] block mb-1 flex items-center gap-1"><AlertTriangle size={10} /> {t.bottleneckLabel}</span>
                    <p className="text-sm text-stone-800 font-serif italic leading-relaxed">"{expert.bottleneck}"</p>
                    {expert.gainCreator && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <span className="text-[8px] font-black uppercase text-emerald-600 block mb-1 flex items-center gap-1"><Coins size={10} /> {t.gainCreatorLabel}</span>
                        <p className="text-xs text-stone-600 font-sans">{expert.gainCreator}</p>
                      </div>
                    )}
                  </div>
                  {expert.aiAnalysis && (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3 animate-in zoom-in-95">
                      <BrainCircuit size={16} className="text-emerald-600 shrink-0 mt-1" />
                      <p className="text-[11px] text-emerald-900 font-serif italic leading-relaxed">"{expert.aiAnalysis.refined_pitch}"</p>
                    </div>
                  )}
                  {!expert.aiAnalysis && myProfile?.id === expert.id && (
                    <button onClick={() => analyzeExpert(expert)} disabled={analyzingId === expert.id} className="bg-[#2f6ea8] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                      {analyzingId === expert.id ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} {t.aiAnalyze}
                    </button>
                  )}
                </div>
                <a href={`https://wa.me/${(expert.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#1c3148] text-white py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-[#2f6ea8] transition-all shadow-md active:scale-95">{t.waContact}</a>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem] flex flex-col items-center">
                <p className="text-stone-300 font-serif italic">{t.noNodesFound}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-100">
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{t.adminTotalFriction}</p>
        <p className="text-2xl font-serif font-black text-[#1a2d3f]">{(marketHealth?.totalFriction || 0).toLocaleString()} {MARKET_CONFIG.currency}</p>
      </div>
    </div>
  );
}

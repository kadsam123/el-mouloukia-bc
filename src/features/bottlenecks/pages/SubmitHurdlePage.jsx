import React from 'react';
import { ArrowRight } from 'lucide-react';

export function SubmitHurdlePage({
  t,
  lang,
  isAdminAuthenticated,
  setView,
  editObject,
  handleHurdleSubmit,
  CATEGORIES,
  MARKET_CONFIG
}) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-stone-100 shadow-2xl">
      <button onClick={() => setView(isAdminAuthenticated ? 'admin' : 'directory')} className="mb-6 text-stone-400 hover:text-[#8b4513] flex items-center gap-2 font-bold text-sm group">
        <ArrowRight className={`${lang === 'ar' ? '' : 'rotate-180'}`} size={16} /> {t.back}
      </button>
      <h2 className="text-4xl font-serif font-black mb-8">{editObject ? t.editHurdle : t.submitHurdle}</h2>
      <form onSubmit={handleHurdleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.hurdleIdentifier}</label>
          <input name="title" defaultValue={editObject?.title} placeholder={t.placeholderHurdleTitle} className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.marketSegment}</label>
            <select name="sector" defaultValue={editObject?.sector} className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all appearance-none" required>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label[lang]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelHurdleFriction} ({MARKET_CONFIG.currency})</label>
            <input name="frictionCost" type="number" defaultValue={editObject?.frictionCost} placeholder="e.g. 5000" className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" required />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.problemArchitecture}</label>
          <textarea name="description" defaultValue={editObject?.description} placeholder={t.placeholderHurdleDescription} className="w-full p-5 bg-stone-50 rounded-2xl min-h-[120px] outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" required />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8b4513] mb-2 block px-4">{t.labelHurdleInstance}</label>
          <textarea name="instance" defaultValue={editObject?.instance} placeholder={t.placeholderInstance} className="w-full p-5 bg-[#fcfaf7] border-dashed border-[#8b4513]/20 border-2 rounded-2xl min-h-[100px] outline-none focus:bg-white transition-all" required />
        </div>
        <button className="w-full bg-[#2d1e1a] text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#8b4513] transition-colors">{editObject ? t.saveChanges : t.broadcastSignal}</button>
      </form>
    </div>
  );
}

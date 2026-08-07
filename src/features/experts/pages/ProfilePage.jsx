import React from 'react';
import { ArrowRight, Edit3, Loader2, UserCircle, Zap } from 'lucide-react';

export function ProfilePage({
  t,
  setView,
  myProfile,
  setEditObject,
  analyzeExpert,
  analyzingId
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-end">
        <h2 className="text-6xl font-serif font-black">{t.profileTitle || t.navProfile}</h2>
        <button onClick={() => setView('directory')} className="text-[10px] font-black uppercase text-stone-400 hover:text-[#8b4513]">{t.back}</button>
      </div>
      {myProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-stone-100 text-center flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4"><UserCircle size={40} /></div>
              <h3 className="text-xl font-black leading-tight">{myProfile.name}</h3>
              <p className="text-[10px] font-black text-[#8b4513] uppercase tracking-widest mt-1">{myProfile.title || t.verifiedNode}</p>
              <span className="mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded-full tracking-widest border border-emerald-200">{t.activeNode}</span>
            </div>
            <button
              onClick={() => { setEditObject({ ...myProfile, type: 'expert' }); setView('register'); }}
              className="w-full bg-white border border-stone-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#8b4513] hover:text-white transition-all shadow-sm"
            >
              <Edit3 size={16} /> {t.editMyDossier}
            </button>
          </div>

          <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-stone-100 relative shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8b4513] mb-6 flex items-center gap-2"><Zap size={14} /> {t.intelReport}</h4>
            {!myProfile.aiAnalysis ? (
              <div className="py-12 text-center space-y-4">
                <p className="text-stone-300 font-serif italic text-sm">{t.analysisPending}</p>
                <button onClick={() => analyzeExpert(myProfile)} disabled={analyzingId === myProfile.id} className="mx-auto bg-[#8b4513] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                  {analyzingId === myProfile.id ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} {t.aiAnalyze}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-1000">
                <p className="text-3xl font-serif font-black text-[#2d1e1a] leading-tight italic">"{myProfile.aiAnalysis.refined_pitch}"</p>
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[8px] font-black uppercase text-[#8b4513] block mb-2 tracking-widest">{t.strategicMarketFit}</span>
                  <p className="text-xs font-serif text-stone-600 leading-relaxed italic">"{myProfile.aiAnalysis.market_fit}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-stone-100">
          <p className="text-stone-300 font-serif italic mb-6">{t.notRegisteredYet}</p>
          <button onClick={() => setView('register')} className="bg-[#8b4513] text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{t.navJoin}</button>
        </div>
      )}
    </div>
  );
}

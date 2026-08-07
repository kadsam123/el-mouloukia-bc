import React from 'react';
import { ArrowRight } from 'lucide-react';

export function RegisterPage({
  t,
  lang,
  isAdminAuthenticated,
  setView,
  editObject,
  handleRegister,
  CATEGORIES,
  formStatus
}) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 border border-stone-100 shadow-2xl">
      <button onClick={() => setView(isAdminAuthenticated ? 'admin' : 'directory')} className="mb-6 text-stone-400 flex items-center gap-2 font-bold text-sm group">
        <ArrowRight className={`${lang === 'ar' ? 'rotate-180' : ''}`} size={16} /> {t.back}
      </button>
      <h3 className="text-5xl font-serif font-black mb-8">{editObject ? t.editProfile : t.regTitle}</h3>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelName}</label>
            <input name="name" defaultValue={editObject?.name} required className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder={t.placeholderName} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelTitle}</label>
            <input name="title" defaultValue={editObject?.title} required className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder={t.placeholderTitle} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelSector}</label>
            <select name="sector" defaultValue={editObject?.sector} required className="w-full p-5 bg-stone-50 rounded-2xl outline-none appearance-none">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label[lang]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelPhone}</label>
            <input name="phone" defaultValue={editObject?.phone} required className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder="+... Link" dir="ltr" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8b4513] mb-2 block px-4">{t.labelBottleneck} (Pain Reliever)</label>
          <textarea name="bottleneck" defaultValue={editObject?.bottleneck} required className="w-full p-5 bg-stone-50 rounded-2xl min-h-[80px] outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder={t.placeholderCase} />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block px-4">{t.labelGain} (Gain Creator)</label>
          <textarea name="gainCreator" defaultValue={editObject?.gainCreator} required className="w-full p-5 bg-stone-50 rounded-2xl min-h-[80px] outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder={t.placeholderGain} />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">{t.labelBio}</label>
          <textarea name="bio" defaultValue={editObject?.bio} required className="w-full p-5 bg-stone-50 rounded-2xl min-h-[80px] outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" placeholder={t.placeholderBio} />
        </div>
        <button disabled={formStatus === 'submitting'} className="w-full bg-[#2d1e1a] text-white py-6 rounded-2xl font-black uppercase shadow-xl transition-all hover:scale-[1.01]">
          {formStatus === 'submitting' ? t.processing : (editObject ? t.updateDossier : t.navJoin)}
        </button>
      </form>
    </div>
  );
}

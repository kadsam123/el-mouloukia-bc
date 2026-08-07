import React from 'react';
import { X } from 'lucide-react';

export function ArchiveDrawer({
  showArchival,
  setShowArchival,
  SYSTEM_VERSION,
  MARKET_CONFIG,
  t
}) {
  if (!showArchival) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#2d1e1a]/40 backdrop-blur-sm z-[100] flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl p-10 h-full overflow-y-auto shadow-2xl border-l border-stone-100 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-xl font-serif font-black text-[#2d1e1a]">{t.archiveTitle}</h3>
              <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mt-1">{t.archiveSubtitle}</p>
            </div>
            <button onClick={() => setShowArchival(false)} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-50"><X size={20} /></button>
          </div>
          <div className="space-y-6 font-sans text-sm text-stone-600 leading-relaxed">
            <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
              <span className="text-[9px] font-black text-[#8b4513] block mb-1">{t.currentDeploymentTarget}</span>
              <p className="text-xs font-bold text-stone-800">{t.buildProtocol}: {SYSTEM_VERSION}</p>
              <p className="text-[11px] text-stone-500 mt-1">{t.activeMarketDomain}: {MARKET_CONFIG.name} Hub ({MARKET_CONFIG.focus})</p>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-stone-100 text-[10px] text-stone-400 font-bold uppercase tracking-widest text-center">
          {t.ventureArchiveFooter}
        </div>
      </div>
    </div>
  );
}

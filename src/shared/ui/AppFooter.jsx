import React from 'react';
import { FileText } from 'lucide-react';

export function AppFooter({ SYSTEM_VERSION, showArchival, setShowArchival, t }) {
  return (
    <footer className="mt-20 border-t border-stone-100 py-10 px-6 text-center">
      <div className="flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">
        <span>{SYSTEM_VERSION}</span>
        <span>•</span>
        <button onClick={() => setShowArchival(!showArchival)} className="hover:text-[#2f6ea8] transition-colors flex items-center gap-1">
          <FileText size={10} /> {t.ventureArchiveButton}
        </button>
      </div>
    </footer>
  );
}

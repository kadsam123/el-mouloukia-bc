import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ErrorToast({ errorMessage, clearError }) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white border border-stone-100 p-5 rounded-[2rem] flex items-center gap-4 shadow-2xl z-[100]">
      <div className="p-2 bg-rose-50 rounded-full text-rose-500"><AlertCircle size={20} /></div>
      <span className="text-xs font-bold text-stone-800">{errorMessage}</span>
      <button onClick={clearError} className="p-1 text-stone-300 hover:text-stone-500 transition-colors"><X size={18} /></button>
    </div>
  );
}

import React from 'react';

export function MarketTickerBar({ MARKET_CONFIG, marketHealth, t }) {
  return (
    <div className="bg-[#1c3148] text-white/75 border-b border-slate-700 py-2 px-6 text-[10px] uppercase font-black tracking-widest overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-6 items-center flex-wrap">
          <span className="flex items-center gap-2 text-white"><span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" /> {MARKET_CONFIG.name} {MARKET_CONFIG.focus} {t.pulseActive}</span>
          <span>{t.usdDzd}: <span className="text-white">134.42</span></span>
          <span>{t.brentCrude}: <span className="text-sky-300">$78.50 BBL</span></span>
        </div>
        <div>
          <span className="text-blue-200 font-bold">{t.adminTotalFriction}: {(marketHealth?.totalFriction || 0).toLocaleString()} {MARKET_CONFIG.currency}</span>
        </div>
      </div>
    </div>
  );
}

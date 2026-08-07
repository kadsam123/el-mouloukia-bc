import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, FileText, Loader2, RadioTower } from 'lucide-react';
import { subscribeToLatestBriefs } from '../../../services/repositories/briefsRepository.js';

function formatTimestamp(timestamp, lang = 'en') {
  if (!timestamp) return 'Awaiting timestamp';

  const date = typeof timestamp?.toDate === 'function'
    ? timestamp.toDate()
    : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Awaiting timestamp';
  }

  return new Intl.DateTimeFormat(lang, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function resolveTypeLabel(item) {
  if (typeof item?.type === 'string' && item.type.trim()) {
    return item.type.trim();
  }
  if (typeof item?.category === 'string' && item.category.trim()) {
    return item.category.trim();
  }
  return 'Field Note';
}

function resolveTitle(item) {
  if (typeof item?.title === 'string' && item.title.trim()) {
    return item.title.trim();
  }
  if (typeof item?.headline === 'string' && item.headline.trim()) {
    return item.headline.trim();
  }
  return 'Untitled Brief';
}

function resolveBody(item) {
  if (typeof item?.body === 'string' && item.body.trim()) {
    return item.body.trim();
  }
  if (typeof item?.content === 'string' && item.content.trim()) {
    return item.content.trim();
  }
  if (typeof item?.summary === 'string' && item.summary.trim()) {
    return item.summary.trim();
  }
  return 'No narrative has been published yet for this brief.';
}

export function NarrativeLedgerWidget({ lang = 'en', className = '' }) {
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLatestBriefs((rows) => {
      setBriefs(rows);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const items = useMemo(
    () => briefs.map((item) => ({
      id: item.id,
      type: resolveTypeLabel(item),
      title: resolveTitle(item),
      body: resolveBody(item),
      author: item.author || item.owner || 'Platform Editorial Desk',
      timestampLabel: formatTimestamp(item.timestamp || item.createdAt || item.timestampLabel, lang)
    })),
    [briefs, lang]
  );

  return (
    <aside className={`bg-white border border-stone-100 rounded-[2rem] shadow-sm p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RadioTower size={16} className="text-[#2f6ea8]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2f6ea8]">Narrative Ledger</h3>
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-stone-400">Realtime</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 px-2 py-6 text-stone-400 text-xs">
          <Loader2 size={14} className="animate-spin" />
          Syncing platform briefs...
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="px-2 py-8 rounded-2xl border border-dashed border-stone-200 text-center">
          <FileText size={18} className="mx-auto text-stone-300 mb-2" />
          <p className="text-xs text-stone-400 italic">No briefs published yet.</p>
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
          {items.map((item) => (
            <article key={item.id} className="relative p-4 rounded-2xl border border-stone-100 bg-[#fcfcfb]">
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-[#2f6ea8] to-[#65b890]" />
              <div className="pl-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-[#1c3148] text-white tracking-[0.12em]">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Clock3 size={12} />
                    {item.timestampLabel}
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#1a2d3f] mb-1 leading-snug">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.body}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">{item.author}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export default NarrativeLedgerWidget;

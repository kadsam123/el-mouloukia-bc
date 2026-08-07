import React from 'react';
import { AlertTriangle, Edit3, ExternalLink, Plus, Trash2, Wifi, WifiOff, Lightbulb } from 'lucide-react';

const STRESS_REPORT_URL = '/tools/reports/STRESS_TEST_VIEWER.html';

export function AdminPage({
  t,
  user,
  isAdminAuthenticated,
  adminKey,
  setAdminKey,
  handleAdminLogin,
  setIsAdminAuthenticated,
  marketHealth,
  MARKET_CONFIG,
  experts,
  hurdles,
  setEditObject,
  setView,
  removeItem,
  actionBusyId,
  actionError,
  approveWorkflowRunById,
  auditEvents,
  interactions,
  kpis,
  outcomes,
  pendingApprovalRuns,
  rejectWorkflowRunById,
  workflowRuns,
  actionsSummary
}) {
  const openStressViewer = () => {
    window.open(STRESS_REPORT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      {!isAdminAuthenticated ? (
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-stone-100 text-center">
          <div className="flex justify-center mb-8">
            {user ? <div className="p-4 bg-emerald-50 rounded-full text-emerald-500 shadow-sm"><Wifi /></div> : <WifiOff className="text-rose-500 animate-pulse" />}
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">{t.protocolActivation}</h3>
            <input type="password" placeholder={t.keyPlaceholder} className="w-full p-5 bg-stone-50 rounded-2xl text-center text-2xl font-serif outline-none border border-transparent focus:border-stone-100 transition-all" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} dir="ltr" />
            <button onClick={handleAdminLogin} className="w-full bg-[#2d1e1a] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">{t.activateSession}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl font-serif font-black">{t.adminManage}</h2>
            <button onClick={() => setIsAdminAuthenticated(false)} className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors">{t.terminateSession}</button>
          </div>

          <div className="bg-[#2d1e1a] p-8 rounded-[3rem] text-white grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-2"><AlertTriangle size={14} /> {t.adminTotalFriction}</span>
              <div className="text-5xl font-black font-serif">{(marketHealth?.totalFriction || 0).toLocaleString()} {MARKET_CONFIG.currency}</div>
            </div>
            <div className="space-y-2 border-l border-white/5 pl-8">
              <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-2"><Lightbulb size={14} /> {t.nodeDensity}</span>
              <div className="text-5xl font-black font-serif">{experts.length} {t.activeLabel}</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Evaluation dashboard</h4>
              <span className="text-[10px] font-black uppercase text-stone-400">KPIs</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[9px] uppercase font-black text-emerald-700">Approval rate</p>
                <p className="text-2xl font-serif font-black text-emerald-800">{kpis?.approvalRate || 0}%</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[9px] uppercase font-black text-amber-700">Correction rate</p>
                <p className="text-2xl font-serif font-black text-amber-800">{kpis?.correctionRate || 0}%</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-[9px] uppercase font-black text-sky-700">Response rate</p>
                <p className="text-2xl font-serif font-black text-sky-800">{kpis?.responseRate || 0}%</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-[9px] uppercase font-black text-violet-700">Avg time to match</p>
                <p className="text-2xl font-serif font-black text-violet-800">{kpis?.avgTimeToMatchHours || 0}h</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[9px] uppercase font-black text-stone-500">Interactions</p>
                <p className="text-2xl font-serif font-black text-[#2d1e1a]">{kpis?.interactionsCount || interactions?.length || 0}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[9px] uppercase font-black text-stone-500">Outcomes</p>
                <p className="text-2xl font-serif font-black text-[#2d1e1a]">{kpis?.outcomesCount || outcomes?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Actions Monitor</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={openStressViewer}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#2f6ea8]/20 bg-[#2f6ea8]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#2f6ea8] transition-colors hover:bg-[#2f6ea8]/15"
                >
                  <ExternalLink size={12} /> Stress Viewer
                </button>
                <span className="text-[10px] font-black uppercase text-stone-400">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[9px] uppercase font-black text-stone-400">Audit events</p>
                <p className="text-2xl font-serif font-black text-[#2d1e1a]">{actionsSummary?.totalEvents || 0}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[9px] uppercase font-black text-stone-400">Workflow runs</p>
                <p className="text-2xl font-serif font-black text-[#2d1e1a]">{actionsSummary?.totalRuns || 0}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[9px] uppercase font-black text-amber-600">Pending approval</p>
                <p className="text-2xl font-serif font-black text-amber-700">{actionsSummary?.pendingApprovals || 0}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[9px] uppercase font-black text-emerald-600">Completed</p>
                <p className="text-2xl font-serif font-black text-emerald-700">{actionsSummary?.completedRuns || 0}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-[9px] uppercase font-black text-rose-500">Failed</p>
                <p className="text-2xl font-serif font-black text-rose-600">{actionsSummary?.failedRuns || 0}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Pending approvals</h5>
                <span className="text-[10px] font-black uppercase text-amber-600">{(pendingApprovalRuns || []).length}</span>
              </div>

              {actionError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 text-rose-700 px-3 py-2 text-[11px] font-semibold">
                  {actionError}
                </div>
              )}

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(pendingApprovalRuns || []).length > 0 ? pendingApprovalRuns.map((run) => (
                  <div key={run.id} className="rounded-xl border border-amber-100 bg-amber-50/40 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-black text-[#2d1e1a]">{run.workflowType || 'workflow'}</p>
                        <p className="text-[9px] uppercase text-stone-500">{run.subjectType || 'subject'}: {run.subjectId || 'unspecified'}</p>
                        <p className="text-[9px] uppercase font-black text-amber-700">state: {run.state}</p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => approveWorkflowRunById(run.id)}
                          disabled={actionBusyId === run.id}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-emerald-600 text-white disabled:opacity-60"
                        >
                          {actionBusyId === run.id ? 'Working' : 'Approve'}
                        </button>
                        <button
                          onClick={() => rejectWorkflowRunById(run.id)}
                          disabled={actionBusyId === run.id}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-rose-600 text-white disabled:opacity-60"
                        >
                          {actionBusyId === run.id ? 'Working' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-stone-300 italic">No approvals pending right now.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Recent workflow runs</h5>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(workflowRuns || []).length > 0 ? workflowRuns.map((run) => (
                    <div key={run.id} className="rounded-xl border border-stone-100 px-3 py-2 bg-stone-50">
                      <p className="text-[10px] font-black text-[#2d1e1a]">{run.workflowType || 'workflow'}</p>
                      <p className="text-[9px] uppercase text-stone-400">{run.subjectType || 'subject'}: {run.subjectId || 'unspecified'}</p>
                      <p className="text-[9px] uppercase font-black text-[#8b4513]">state: {run.state || 'unknown'}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-stone-300 italic">No workflow runs yet.</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Recent audit events</h5>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(auditEvents || []).length > 0 ? auditEvents.map((event) => (
                    <div key={event.id} className="rounded-xl border border-stone-100 px-3 py-2 bg-stone-50">
                      <p className="text-[10px] font-black text-[#2d1e1a]">{event.action || 'unknown_action'}</p>
                      <p className="text-[9px] uppercase text-stone-400">{event.actorId || 'agent'} | {event.subjectType || 'workflow'}</p>
                      <p className="text-[9px] uppercase font-black text-[#8b4513]">status: {event.status || 'completed'}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-stone-300 italic">No audit events yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">{t.expertNodes} ({experts.length})</h4>
                <button onClick={() => { setEditObject(null); setView('register'); }} className="p-1 text-[#8b4513] hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"><Plus size={14} /> {t.addNode}</button>
              </div>
              <div className="space-y-3">
                {experts.map((e) => (
                  <div key={e.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center group">
                    <div>
                      <p className="text-[11px] font-bold">{e.name || t.untitled}</p>
                      <p className="text-[8px] text-stone-400 uppercase font-black">{e.title || t.expertLabel}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditObject({ ...e, type: 'expert' }); setView('register'); }} className="p-2 bg-stone-50 text-stone-400 hover:text-[#8b4513] rounded-lg transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => removeItem('expert', e.id)} className="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">{t.broadcastSignals} ({hurdles.length})</h4>
                <button onClick={() => { setEditObject(null); setView('submitHurdle'); }} className="p-1 text-[#8b4513] hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"><Plus size={14} /> {t.addHurdle}</button>
              </div>
              <div className="space-y-3">
                {hurdles.map((h) => (
                  <div key={h.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[11px] font-bold truncate">{h.title || t.untitled}</p>
                      <p className="text-[9px] text-rose-400 uppercase font-black">-{parseInt(h.frictionCost || 0, 10).toLocaleString()} {MARKET_CONFIG.currency}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditObject({ ...h, type: 'hurdle' }); setView('submitHurdle'); }} className="p-2 bg-stone-50 text-stone-400 hover:text-[#8b4513] rounded-lg transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => removeItem('hurdle', h.id)} className="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, Construction, Cpu, Factory, Sprout, Truck } from 'lucide-react';
import { useAuthSession } from '../services/firebase/useAuthSession';
import { ACTIONS, createActionRegistry } from '../services/orchestration/actionRegistry';
import { getFilteredExperts } from '../features/experts/experts.selectors';
import { getLiveFeed, getMarketHealth } from '../features/bottlenecks/bottlenecks.selectors';
import { getAuthBadge } from '../features/admin/admin.selectors';
import { useAdminSession } from '../features/admin/hooks/useAdminSession';
import { useAdminActionsMonitor } from '../features/admin/hooks/useAdminActionsMonitor';
import { useExpertsFlow } from '../features/experts/hooks/useExpertsFlow';
import { useHurdlesFlow } from '../features/bottlenecks/hooks/useHurdlesFlow';
import { TRANSLATIONS } from '../shared/constants/i18n/translations';
import { renderView } from './routes/viewRouter';
import { MarketTickerBar } from '../shared/ui/MarketTickerBar';
import { TopNav } from '../shared/ui/TopNav';
import { ArchiveDrawer } from '../shared/ui/ArchiveDrawer';
import { ErrorToast } from '../shared/ui/ErrorToast';
import { AppFooter } from '../shared/ui/AppFooter';

const SYSTEM_VERSION = '1.0.2-ARCHIVAL';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
const ADMIN_PASSWORD_ALIASES = (import.meta.env.VITE_ADMIN_PASSWORD_ALIAS || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

const MARKET_CONFIG = {
  name: 'Constantine',
  focus: 'Industrial',
  currency: 'DZD'
};

const CATEGORIES = [
  { id: 'agri', label: { en: 'Agri', fr: 'Agri', ar: 'الفلاحة' }, icon: Sprout, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'const', label: { en: 'Const', fr: 'Construction', ar: 'البناء' }, icon: Construction, color: 'bg-sky-50 text-sky-800 border-sky-100' },
  { id: 'manuf', label: { en: 'Manuf', fr: 'Industrie', ar: 'التصنيع' }, icon: Factory, color: 'bg-slate-100 text-slate-800 border-slate-200' },
  { id: 'biz', label: { en: 'Biz', fr: 'Business', ar: 'الأعمال' }, icon: Briefcase, color: 'bg-cyan-50 text-cyan-800 border-cyan-100' },
  { id: 'it', label: { en: 'IT', fr: 'Numerique', ar: 'الرقمنة' }, icon: Cpu, color: 'bg-indigo-50 text-indigo-800 border-indigo-100' },
  { id: 'log', label: { en: 'Logistics', fr: 'Logistique', ar: 'لوجستيك' }, icon: Truck, color: 'bg-blue-50 text-blue-800 border-blue-100' }
];

export default function AppShell() {
  const [view, setView] = useState('directory');
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const { user, isAuthReady, authError, setAuthError, ensureAuthUser } = useAuthSession({ messages: t });
  const [activeHurdle, setActiveHurdle] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [editObject, setEditObject] = useState(null);
  const [showArchival, setShowArchival] = useState(false);
  const allowedSectors = useMemo(() => CATEGORIES.map((category) => category.id), []);
  const actionRegistry = useMemo(() => createActionRegistry(), []);

  const {
    adminKey,
    setAdminKey,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    handleAdminLogin
  } = useAdminSession({
    adminPassword: ADMIN_PASSWORD,
    adminPasswordAliases: ADMIN_PASSWORD_ALIASES,
    setErrorMessage,
    t
  });

  const {
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
    summary: actionsSummary
  } = useAdminActionsMonitor(isAdminAuthenticated, user?.uid);

  const {
    experts,
    myProfile,
    formStatus,
    analyzingId,
    analyzeExpert,
    handleRegister,
    removeExpertById
  } = useExpertsFlow({
    user,
    ensureAuthUser,
    setErrorMessage,
    isAdminAuthenticated,
    setView,
    setEditObject,
    t,
    MARKET_CONFIG,
    SYSTEM_VERSION,
    allowedSectors
  });

  const {
    hurdles,
    handleHurdleSubmit,
    removeHurdleById
  } = useHurdlesFlow({
    user,
    ensureAuthUser,
    setErrorMessage,
    isAdminAuthenticated,
    setView,
    setEditObject,
    SYSTEM_VERSION,
    allowedSectors,
    t
  });

  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
      setAuthError('');
    }
  }, [authError, setAuthError]);

  const marketHealth = useMemo(() => getMarketHealth(hurdles), [hurdles]);
  const liveFeed = useMemo(() => getLiveFeed(experts, hurdles), [experts, hurdles]);

  const getTopMatches = (hurdle) => {
    const result = actionRegistry.executeSync(ACTIONS.SCORE_CANDIDATE_MATCHES, {
      experts,
      hurdle,
      options: { maxResults: 3, minimumResonance: 2 }
    }, {
      enableAudit: false
    });

    return result.output.candidates || [];
  };

  const removeItem = async (type, id) => {
    if (type === 'expert') {
      await removeExpertById(id);
      return;
    }

    await removeHurdleById(id);
  };

  const filtered = useMemo(() => getFilteredExperts({
    experts,
    filter,
    search,
    activeHurdle,
    getTopMatches
  }), [experts, filter, search, activeHurdle]);

  const authBadge = useMemo(() => getAuthBadge({ isAuthReady, user, lang }), [isAuthReady, user, lang]);

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#1a2d3f] font-sans" dir={t.dir}>
      <MarketTickerBar MARKET_CONFIG={MARKET_CONFIG} marketHealth={marketHealth} t={t} />
      <TopNav
        t={t}
        authBadge={authBadge}
        lang={lang}
        setLang={setLang}
        view={view}
        setView={setView}
        myProfile={myProfile}
        setEditObject={setEditObject}
        setActiveHurdle={setActiveHurdle}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {renderView(view, {
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
          analyzingId,
          isAdminAuthenticated,
          editObject,
          handleHurdleSubmit: (event) => handleHurdleSubmit(event, editObject),
          handleRegister: (event) => handleRegister(event, editObject),
          formStatus,
          user,
          adminKey,
          setAdminKey,
          handleAdminLogin,
          setIsAdminAuthenticated,
          experts,
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
        })}
      </main>

      <ArchiveDrawer
        showArchival={showArchival}
        setShowArchival={setShowArchival}
        SYSTEM_VERSION={SYSTEM_VERSION}
        MARKET_CONFIG={MARKET_CONFIG}
        t={t}
      />
      <ErrorToast errorMessage={errorMessage} clearError={() => setErrorMessage('')} />
      <AppFooter SYSTEM_VERSION={SYSTEM_VERSION} showArchival={showArchival} setShowArchival={setShowArchival} t={t} />
    </div>
  );
}

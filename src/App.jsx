import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  Search,
  ShieldCheck,
  Construction,
  Factory,
  Briefcase,
  Cpu,
  Truck,
  Sprout,
  HelpCircle,
  History,
  Wifi,
  WifiOff,
  ArrowRight,
  Share2,
  Check,
  AlertCircle,
  UserCircle,
  Radio,
  Activity,
  Globe,
  Database,
  Trash2,
  Edit3,
  Coins,
  AlertTriangle,
  Lightbulb,
  X,
  ChevronUp,
  Plus,
  FileText,
  Zap,
  Loader2,
  BrainCircuit
} from 'lucide-react';

const SYSTEM_VERSION = '1.0.2-ARCHIVAL';
const firebaseConfig = {
  apiKey: 'AIzaSyCcJw4bSXCBAf1xHsX9DyS2KfOXL-rqJxs',
  authDomain: 'el-mouloukia-bc-39f12.firebaseapp.com',
  projectId: 'el-mouloukia-bc-39f12',
  storageBucket: 'el-mouloukia-bc-39f12.firebasestorage.app',
  messagingSenderId: '576072990406',
  appId: '1:576072990406:web:2032c1b15162db5a2521c7',
  measurementId: 'G-C4KR0VMTX5'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'el-mouloukia-bc';
const apiKey = ""; // Insert your Google AI Studio Gemini API key here
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const MARKET_CONFIG = {
  name: 'Constantine',
  focus: 'Industrial',
  currency: 'DZD'
};

const TRANSLATIONS = {
  en: {
    dir: 'ltr',
    brand: 'El Mouloukia',
    subBrand: 'Business Centre',
    newsroom: 'Intelligence Pulse',
    navDirectory: 'Network',
    navJoin: 'Join',
    navProfile: 'My Dossier',
    heroTitle: 'Bridging the',
    heroTitleItalic: 'Future',
    heroTitleEnd: `of ${MARKET_CONFIG.name}.`,
    heroSub: `Decentralized expert network focused on systemic bottleneck elimination and ${MARKET_CONFIG.focus} orchestration.`,
    searchPlaceholder: 'Search signals...',
    bottleneckLabel: 'Solution Protocol',
    waContact: 'Connect',
    liveHurdles: 'Live Systemic Hurdles',
    submitHurdle: 'Submit Hurdle',
    back: 'Back',
    adminManage: 'System Management',
    addNode: 'Add Node',
    addHurdle: 'Add Hurdle',
    labelName: 'Full Name',
    labelTitle: 'Professional Title',
    labelSector: 'Industry Segment',
    labelPhone: 'Contact Link (WhatsApp)',
    labelBio: 'Career Trajectory',
    labelBottleneck: 'Pain Reliever (Specific Solve)',
    labelGain: 'Gain Creator (Economic Impact)',
    placeholderName: 'e.g. Salim Benmalek',
    placeholderTitle: 'e.g. Senior Logistics Architect',
    placeholderBio: 'Summarize your professional evolution...',
    placeholderCase: 'Describe exactly which systemic hurdle you eliminate...',
    placeholderGain: 'How much value or time do you save the client?',
    labelHurdleFriction: 'Cost of Friction (Estimate per Day/Month)',
    labelHurdleInstance: 'Specific Instance (The Mom Test)',
    placeholderInstance: 'Describe the last time this exact problem happened...',
    adminTotalFriction: 'Aggregate Market Friction',
    regTitle: 'Join The Network',
    processing: 'Processing...',
    allSectors: 'All',
    aiAnalyze: 'Generate Insight',
    intelReport: 'Intelligence Report',
    analysisPending: 'Strategic analysis available.'
  },
  ar: {
    dir: 'rtl',
    brand: 'الملوكية',
    subBrand: 'مركز الأعمال',
    newsroom: 'نبض الذكاء',
    navDirectory: 'الشبكة',
    navJoin: 'انضم',
    navProfile: 'ملفي الشخصي',
    heroTitle: 'جسر إلى',
    heroTitleItalic: 'المستقبل',
    heroTitleEnd: `في ${MARKET_CONFIG.name === 'Constantine' ? 'قسنطينة' : MARKET_CONFIG.name}.`,
    heroSub: `شبكة خبراء لامركزية تركز على القضاء على الاختناقات النظامية والتنسيق ${MARKET_CONFIG.focus === 'Industrial' ? 'الصناعي' : 'المهني'}.`,
    searchPlaceholder: 'ابحث في الإشارات...',
    bottleneckLabel: 'بروتوكول الحل',
    waContact: 'اتصال',
    liveHurdles: 'عقبات نظامية مباشرة',
    submitHurdle: 'تقديم عقبة',
    back: 'العودة',
    adminManage: 'إدارة النظام',
    addNode: 'إضافة عقدة',
    addHurdle: 'إضافة عقبة',
    labelName: 'الاسم الكامل',
    labelTitle: 'المسمى الوظيفي',
    labelSector: 'قطاع الصناعة',
    labelPhone: 'رابط التواصل (واتساب)',
    labelBio: 'المسار المهني',
    labelBottleneck: 'مخفف الألم (حل محدد)',
    labelGain: 'خالق المكاسب (الأثر الاقتصادي)',
    placeholderName: 'مثال: سليم بن مالك',
    placeholderTitle: 'مثال: خبير أول في الخدمات اللوجستية',
    placeholderBio: 'لخص مسارك المهني...',
    placeholderCase: 'صف بالضبط ما هي العقبة النظامية التي تقضي عليها...',
    placeholderGain: 'ما مقدار القيمة أو الوقت الذي توفره للعميل؟',
    labelHurdleFriction: 'تكلفة الاحتكاك (تقدير يومي/شهري)',
    labelHurdleInstance: 'مثال محدد (اختبار الأم)',
    placeholderInstance: 'صف آخر مرة حدثت فيها هذه المشكلة بالضبط...',
    adminTotalFriction: 'إجمالي الاحتكاك في السوق',
    regTitle: 'انضم إلى الشبكة',
    processing: 'جاري المعالجة...',
    allSectors: 'الكل',
    aiAnalyze: 'توليد بصيرة',
    intelReport: 'تقرير الذكاء',
    analysisPending: 'التحليل الاستراتيجي متاح.'
  }
};

const CATEGORIES = [
  { id: 'agri', label: { en: 'Agri', ar: 'الفلاحة' }, icon: Sprout, color: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
  { id: 'const', label: { en: 'Const', ar: 'البناء' }, icon: Construction, color: 'bg-orange-50 text-orange-800 border-orange-100' },
  { id: 'manuf', label: { en: 'Manuf', ar: 'التصنيع' }, icon: Factory, color: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 'biz', label: { en: 'Biz', ar: 'الأعمال' }, icon: Briefcase, color: 'bg-amber-100 text-amber-800 border-amber-100' },
  { id: 'it', label: { en: 'IT', ar: 'الرقمنة' }, icon: Cpu, color: 'bg-teal-50 text-teal-800 border-teal-100' },
  { id: 'log', label: { en: 'Logistics', ar: 'لوجستيك' }, icon: Truck, color: 'bg-slate-50 text-slate-800 border-slate-100' }
];

export default function App() {
  const [view, setView] = useState('directory');
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [experts, setExperts] = useState([]);
  const [hurdles, setHurdles] = useState([]);
  const [activeHurdle, setActiveHurdle] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [editObject, setEditObject] = useState(null);
  const [showArchival, setShowArchival] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  const handleAdminLogin = () => {
    if (!ADMIN_PASSWORD) {
      setErrorMessage('Admin password is not configured. Set VITE_ADMIN_PASSWORD in your environment.');
      return;
    }

    if (adminKey === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setErrorMessage('');
      return;
    }

    setErrorMessage('Invalid admin key.');
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });

    if (!auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        console.error('Anonymous sign-in failed:', err);
        setErrorMessage(err?.message || 'Authentication failed. Please refresh and try again.');
        setIsAuthReady(true);
      });
    } else {
      setIsAuthReady(true);
    }

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    if (user) return;

    signInAnonymously(auth).catch((err) => {
      console.error('Anonymous sign-in failed:', err);
      setErrorMessage(err?.message || 'Authentication failed. Please refresh and try again.');
    });
  }, [isAuthReady, user]);

  useEffect(() => {
    const expertsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'experts');
    const unsubscribeExperts = onSnapshot(expertsCollection, (snapshot) => {
      setExperts(snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
    });

    const hurdlesCollection = collection(db, 'artifacts', appId, 'public', 'data', 'hurdles');
    const unsubscribeHurdles = onSnapshot(hurdlesCollection, (snapshot) => {
      setHurdles(snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
    });

    return () => {
      unsubscribeExperts();
      unsubscribeHurdles();
    };
  }, [user]);

  const myProfile = useMemo(() => experts.find((e) => e.userId === user?.uid), [experts, user]);

  const marketHealth = useMemo(() => {
    const totalFriction = hurdles.reduce((acc, h) => acc + (parseFloat(h?.frictionCost) || 0), 0);
    return { totalFriction };
  }, [hurdles]);

  const liveFeed = useMemo(() => {
    const combined = [
      ...(experts || []).map((e) => ({ id: e.id, type: 'NODE', label: e.name || 'Anonymous Node', time: e.createdAt })),
      ...(hurdles || []).map((h) => ({ id: h.id, type: 'HURDLE', label: h.title || 'Signal detected', time: h.createdAt }))
    ];
    return combined.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 5);
  }, [experts, hurdles]);

  const getTopMatches = (hurdle) => {
    if (!hurdle) return [];
    return experts
      .map((expert) => {
        let score = 0;
        const expertTerms = `${expert.bottleneck || ''} ${expert.gainCreator || ''}`.toLowerCase();
        const hurdleTerms = `${hurdle.title || ''} ${hurdle.description || ''} ${hurdle.instance || ''}`.toLowerCase();
        if (expert.sector === hurdle.sector) score += 4;
        const keywords = hurdleTerms.split(' ').filter((w) => w.length > 4);
        keywords.forEach((word) => {
          if (expertTerms.includes(word)) score += 2;
        });
        return { ...expert, resonance: score };
      })
      .filter((e) => e.resonance > 2)
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, 3);
  };

  const ensureAuthUser = async () => {
    let activeUser = user?.uid ? user : auth.currentUser;
    if (!activeUser?.uid) {
      try {
        await signInAnonymously(auth);
        activeUser = auth.currentUser;
      } catch (authErr) {
        console.error('Authentication recovery failed:', authErr);
      }
    }
    return activeUser;
  };

  const analyzeExpert = async (expert) => {
    if (!expert || analyzingId) return;
    setAnalyzingId(expert.id);
    const systemPrompt = `You are the AI Orchestrator for ${t.brand} in ${MARKET_CONFIG.name}. Analyze this profile for ${MARKET_CONFIG.focus} alignment. JSON: score(1-10), refined_pitch(15 words), market_fit(10 words), badge(2 words).`;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: `Expert: ${expert.name}\nTitle: ${expert.title}\nBio: ${expert.bio}\nHurdle Solved: ${expert.bottleneck}\nEconomic Gain: ${expert.gainCreator}` }] }], 
          systemInstruction: { parts: [{ text: systemPrompt }] }, 
          generationConfig: { responseMimeType: "application/json" } 
        })
      });
      const data = await res.json();
      const result = JSON.parse(data.candidates[0].content.parts[0].text);
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'experts', expert.id), { aiAnalysis: result, analyzedAt: serverTimestamp() });
    } catch (err) {
      setErrorMessage("Intelligence Bridge offline. Check API key insertion.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    const activeUser = await ensureAuthUser();
    if (!activeUser?.uid) {
      setFormStatus('error');
      setErrorMessage('Authentication failed. Please refresh and try again.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get('name') || '').toString().trim(),
      title: (formData.get('title') || '').toString().trim(),
      sector: (formData.get('sector') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      bio: (formData.get('bio') || '').toString().trim(),
      bottleneck: (formData.get('bottleneck') || '').toString().trim(),
      gainCreator: (formData.get('gainCreator') || '').toString().trim()
    };

    const requiredFields = ['name', 'title', 'sector', 'phone', 'bio', 'bottleneck', 'gainCreator'];
    const missingFields = requiredFields.filter((key) => !payload[key]);
    if (missingFields.length > 0) {
      setFormStatus('error');
      setErrorMessage(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const data = {
        ...payload,
        status: 'active',
        userId: activeUser.uid,
        schemaVersion: SYSTEM_VERSION,
        marketOrigin: MARKET_CONFIG.name
      };

      if (editObject && editObject.type === 'expert') {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'experts', editObject.id), {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'experts'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      setFormStatus('success');
      setTimeout(() => {
        setView(isAdminAuthenticated ? 'admin' : 'directory');
        setEditObject(null);
        setFormStatus(null);
      }, 1500);
    } catch (err) {
      console.error('Registration submit failed:', err);
      setFormStatus('error');
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    }
  };

  const handleHurdleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const activeUser = await ensureAuthUser();
    if (!activeUser?.uid) {
      setErrorMessage('Authentication failed. Please refresh and try again.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: (formData.get('title') || '').toString().trim(),
      description: (formData.get('description') || '').toString().trim(),
      sector: (formData.get('sector') || '').toString().trim(),
      frictionCost: (formData.get('frictionCost') || '').toString().trim(),
      instance: (formData.get('instance') || '').toString().trim()
    };

    const requiredFields = ['title', 'description', 'sector', 'frictionCost', 'instance'];
    const missingFields = requiredFields.filter((key) => !payload[key]);
    if (missingFields.length > 0) {
      setErrorMessage(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      if (editObject && editObject.type === 'hurdle') {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'hurdles', editObject.id), {
          ...payload,
          updatedAt: serverTimestamp(),
          schemaVersion: SYSTEM_VERSION
        });
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'hurdles'), {
          ...payload,
          createdAt: serverTimestamp(),
          schemaVersion: SYSTEM_VERSION
        });
      }
      setView(isAdminAuthenticated ? 'admin' : 'directory');
      setEditObject(null);
    } catch (err) {
      console.error('Hurdle submit failed:', err);
      setErrorMessage(err?.message || 'Action failed.');
    }
  };

  const removeItem = async (type, id) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', type === 'expert' ? 'experts' : 'hurdles', id));
    } catch {
      setErrorMessage('Removal failed.');
    }
  };

  const filtered = useMemo(() => {
    return experts.filter((e) => {
      const matchCat = filter === 'all' || e.sector === filter;
      const matchSearch =
        (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.bottleneck || '').toLowerCase().includes(search.toLowerCase());
      const matchHurdle = activeHurdle
        ? e.sector === activeHurdle.sector || getTopMatches(activeHurdle).some((m) => m.id === e.id)
        : true;
      return matchCat && matchSearch && matchHurdle;
    });
  }, [experts, filter, search, activeHurdle]);

  const authBadge = useMemo(() => {
    if (!isAuthReady) {
      return {
        text: lang === 'ar' ? 'جارٍ التحقق' : 'Checking Auth',
        style: 'bg-stone-100 text-stone-600 border-stone-200'
      };
    }
    if (user) {
      return {
        text: lang === 'ar' ? 'جلسة مؤمنة' : 'Secure Session',
        style: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    }
    return {
      text: lang === 'ar' ? 'وضع الاستعادة' : 'Recovery Mode',
      style: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }, [isAuthReady, user, lang]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2d1e1a] font-sans" dir={t.dir}>
      {/* Dynamic Macroeconomic Ticker Bar */}
      <div className="bg-[#2d1e1a] text-white/70 border-b border-stone-800 py-2 px-6 text-[10px] uppercase font-black tracking-widest overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-6 items-center flex-wrap">
            <span className="flex items-center gap-2 text-white"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"/> {MARKET_CONFIG.name} {MARKET_CONFIG.focus} Pulse: ACTIVE</span>
            <span>USD / DZD: <span className="text-white">134.42</span></span>
            <span>Brent Crude: <span className="text-emerald-400">$78.50 BBL</span></span>
          </div>
          <div>
            <span className="text-rose-400 font-bold">{t.adminTotalFriction}: {(marketHealth?.totalFriction || 0).toLocaleString()} {MARKET_CONFIG.currency}</span>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('directory'); setActiveHurdle(null); setEditObject(null); }}>
            <div className="w-10 h-10 bg-[#2d1e1a] rounded-xl flex items-center justify-center text-white shadow-lg">
              <Database size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter leading-none">{t.brand}</h1>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">{t.subBrand}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.12em] ${authBadge.style}`}>
              {authBadge.text}
            </span>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="p-2 text-stone-400 hover:text-[#8b4513] transition-colors"><Globe size={18} /></button>
            <button onClick={() => setView('directory')} className={`text-[11px] font-black uppercase tracking-widest hidden sm:block ${view === 'directory' ? 'text-[#8b4513]' : 'text-stone-400'}`}>{t.navDirectory}</button>
            {!myProfile && (
              <button onClick={() => { setEditObject(null); setView('register'); }} className="bg-[#2d1e1a] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 hover:bg-[#8b4513]">
                {t.navJoin}
              </button>
            )}
            <button onClick={() => setView('profile')} className={`p-2 rounded-full border transition-all ${view === 'profile' ? 'border-[#8b4513] text-[#8b4513]' : 'border-transparent text-stone-400'}`}><UserCircle size={22} /></button>
            <button onClick={() => setView('admin')} className={`p-2 rounded-full transition-colors ${isAdminAuthenticated ? 'bg-emerald-50 text-emerald-600' : 'text-stone-200 hover:text-stone-400'}`}><ShieldCheck size={18} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {view === 'directory' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-[#8b4513] animate-pulse" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b4513]">{t.newsroom}</h2>
                </div>
                <div className="space-y-2">
                  {liveFeed.length > 0 ? liveFeed.map((item) => (
                    <div key={item.id} className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-[#8b4513]/20 transition-all group">
                      <span className="text-[8px] font-black uppercase bg-stone-50 px-2 py-0.5 rounded text-stone-400">{item.type}</span>
                      <p className="text-[11px] font-bold text-stone-800 leading-tight mt-1 truncate">{item.label}</p>
                    </div>
                  )) : <p className="text-xs text-stone-300 italic px-2">Scanning frequencies...</p>}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-8">
                <div className="bg-[#2d1e1a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b4513]/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Radio size={16} className="text-[#8b4513]" /> {t.liveHurdles}</h3>
                    <button onClick={() => { setEditObject(null); setView('submitHurdle'); }} className="text-[10px] bg-white/10 px-4 py-2 rounded-full font-bold hover:bg-white/20 transition-all border border-white/5">{t.submitHurdle} +</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    {hurdles.slice(0, 3).length > 0 ? hurdles.slice(0, 3).map((h) => (
                      <div key={h.id} onClick={() => setActiveHurdle(activeHurdle?.id === h.id ? null : h)} className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeHurdle?.id === h.id ? 'border-[#8b4513] bg-white/5' : 'border-white/10 hover:border-white/20'}`}>
                        <p className="text-[9px] font-black text-[#8b4513] mb-1 uppercase tracking-wider">
                          {CATEGORIES.find((c) => c.id === h.sector)?.label[lang] || 'General Signal'}
                        </p>
                        <p className="text-sm font-bold truncate mb-3">{h.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {getTopMatches(h).map((m) => (
                              <div key={m.id} className="w-6 h-6 rounded-full bg-stone-800 border-2 border-[#2d1e1a] flex items-center justify-center text-[8px] font-black text-white">{m.name?.[0] || 'N'}</div>
                            ))}
                          </div>
                          {h.frictionCost && <span className="text-[9px] font-black text-rose-400 tracking-tighter">-{parseInt(h.frictionCost).toLocaleString()} {MARKET_CONFIG.currency}</span>}
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-3 py-6 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-xs text-white/20 font-serif italic">No systemic hurdles active in this market.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={lang === 'ar' ? 'text-right' : ''}>
                  <h2 className="text-5xl md:text-7xl font-serif font-black text-[#2d1e1a] leading-[0.9] mb-4">
                    {t.heroTitle} <span className="text-[#8b4513] italic">{t.heroTitleItalic}</span> {t.heroTitleEnd}
                  </h2>
                  <p className="text-stone-400 font-serif italic text-lg max-w-xl">{t.heroSub}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-stone-300`} size={18} />
                    <input type="text" placeholder={t.searchPlaceholder} className={`w-full ${lang === 'ar' ? 'pr-12' : 'pl-12'} py-4 bg-white border border-stone-100 rounded-2xl outline-none shadow-sm focus:border-[#8b4513]/30 transition-all`} value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button onClick={() => { setFilter('all'); setActiveHurdle(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${filter === 'all' && !activeHurdle ? 'bg-[#2d1e1a] text-white border-[#2d1e1a]' : 'bg-white text-stone-400 border-stone-100'}`}>{t.allSectors}</button>
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id} onClick={() => { setFilter(cat.id); setActiveHurdle(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${filter === cat.id ? 'bg-[#8b4513] text-white border-[#8b4513]' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}>{cat.label[lang]}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.length > 0 ? filtered.map((expert) => (
                    <div key={expert.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${CATEGORIES.find((c) => c.id === expert.sector)?.color || 'bg-stone-50'}`}>
                          {React.createElement(CATEGORIES.find((c) => c.id === expert.sector)?.icon || HelpCircle, { size: 24 })}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const url = `${window.location.href.split('?')[0]}?q=${encodeURIComponent(expert.name || '')}`;
                              navigator.clipboard.writeText(url);
                              setCopyFeedback(expert.id);
                              setTimeout(() => setCopyFeedback(null), 2000);
                            }}
                            className={`p-2 rounded-xl border transition-all ${copyFeedback === expert.id ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'text-stone-300 border-transparent hover:border-stone-100'}`}
                          >
                            {copyFeedback === expert.id ? <Check size={18} /> : <Share2 size={18} />}
                          </button>
                        </div>
                      </div>
                      <h4 className="text-3xl font-serif font-black mb-1">{expert.name || 'Anonymous Expert'}</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b4513] mb-1">{expert.title || 'Verified Node'}</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400 mb-6 italic">{CATEGORIES.find((c) => c.id === expert.sector)?.label[lang] || 'General'}</p>
                      <div className="space-y-4 mb-6 flex-grow">
                        <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-50">
                          <span className="text-[8px] font-black uppercase text-[#8b4513] block mb-1 flex items-center gap-1"><AlertTriangle size={10} /> {t.bottleneckLabel}</span>
                          <p className="text-sm text-stone-800 font-serif italic leading-relaxed">"{expert.bottleneck}"</p>
                          {expert.gainCreator && (
                            <div className="mt-3 pt-3 border-t border-stone-100">
                              <span className="text-[8px] font-black uppercase text-emerald-600 block mb-1 flex items-center gap-1"><Coins size={10} /> Gain Creator</span>
                              <p className="text-xs text-stone-600 font-sans">{expert.gainCreator}</p>
                            </div>
                          )}
                        </div>
                        {expert.aiAnalysis && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3 animate-in zoom-in-95">
                             <BrainCircuit size={16} className="text-emerald-600 shrink-0 mt-1" />
                             <p className="text-[11px] text-emerald-900 font-serif italic leading-relaxed">"{expert.aiAnalysis.refined_pitch}"</p>
                          </div>
                        )}
                      </div>
                      <a href={`https://wa.me/${(expert.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#2d1e1a] text-white py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-[#8b4513] transition-all shadow-md active:scale-95">{t.waContact}</a>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem] flex flex-col items-center">
                      <p className="text-stone-300 font-serif italic">No nodes found in the current frequency.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'submitHurdle' && (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-stone-100 shadow-2xl">
            <button onClick={() => setView(isAdminAuthenticated ? 'admin' : 'directory')} className="mb-6 text-stone-400 hover:text-[#8b4513] flex items-center gap-2 font-bold text-sm group">
              <ArrowRight className={`${lang === 'ar' ? '' : 'rotate-180'}`} size={16} /> {t.back}
            </button>
            <h2 className="text-4xl font-serif font-black mb-8">{editObject ? 'Edit Hurdle' : t.submitHurdle}</h2>
            <form onSubmit={handleHurdleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">Hurdle Identifier</label>
                <input name="title" defaultValue={editObject?.title} placeholder="e.g. Production Line Sensor Delay" className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">Market Segment</label>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2 block px-4">Problem Architecture</label>
                <textarea name="description" defaultValue={editObject?.description} placeholder="Describe the systemic bottleneck in detail..." className="w-full p-5 bg-stone-50 rounded-2xl min-h-[120px] outline-none focus:bg-white border border-transparent focus:border-stone-100 transition-all" required />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#8b4513] mb-2 block px-4">{t.labelHurdleInstance}</label>
                <textarea name="instance" defaultValue={editObject?.instance} placeholder={t.placeholderInstance} className="w-full p-5 bg-[#fcfaf7] border-dashed border-[#8b4513]/20 border-2 rounded-2xl min-h-[100px] outline-none focus:bg-white transition-all" required />
              </div>
              <button className="w-full bg-[#2d1e1a] text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#8b4513] transition-colors">{editObject ? 'Save Changes' : 'Broadcast Signal'}</button>
            </form>
          </div>
        )}

        {view === 'register' && (
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 border border-stone-100 shadow-2xl">
            <button onClick={() => setView(isAdminAuthenticated ? 'admin' : 'directory')} className="mb-6 text-stone-400 flex items-center gap-2 font-bold text-sm group">
              <ArrowRight className={`${lang === 'ar' ? 'rotate-180' : ''}`} size={16} /> {t.back}
            </button>
            <h3 className="text-5xl font-serif font-black mb-8">{editObject ? 'Edit Profile' : t.regTitle}</h3>
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
                {formStatus === 'submitting' ? t.processing : (editObject ? 'Update Dossier' : t.navJoin)}
              </button>
            </form>
          </div>
        )}

        {view === 'profile' && (
           <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-end">
                <h2 className="text-6xl font-serif font-black">{t.profileTitle}</h2>
                <button onClick={() => setView('directory')} className="text-[10px] font-black uppercase text-stone-400 hover:text-[#8b4513]">{t.back}</button>
              </div>
              {myProfile ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white p-8 rounded-[3rem] border border-stone-100 text-center flex flex-col items-center shadow-sm">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4"><UserCircle size={40} /></div>
                        <h3 className="text-xl font-black leading-tight">{myProfile.name}</h3>
                        <p className="text-[10px] font-black text-[#8b4513] uppercase tracking-widest mt-1">{myProfile.title || 'Verified Node'}</p>
                        <span className="mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded-full tracking-widest border border-emerald-200">Active Node</span>
                      </div>
                      <button 
                        onClick={() => { setEditObject({ ...myProfile, type: 'expert' }); setView('register'); }}
                        className="w-full bg-white border border-stone-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#8b4513] hover:text-white transition-all shadow-sm"
                      >
                        <Edit3 size={16} /> Edit My Dossier
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
                               <span className="text-[8px] font-black uppercase text-[#8b4513] block mb-2 tracking-widest">Strategic Market Fit</span>
                               <p className="text-xs font-serif text-stone-600 leading-relaxed italic">"{myProfile.aiAnalysis.market_fit}"</p>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              ) : (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-stone-100">
                   <p className="text-stone-300 font-serif italic mb-6">You have not registered as a node in the registry yet.</p>
                   <button onClick={() => setView('register')} className="bg-[#8b4513] text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{t.navJoin}</button>
                </div>
              )}
           </div>
        )}

        {view === 'admin' && (
          <div className="max-w-4xl mx-auto py-10">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-stone-100 text-center">
                <div className="flex justify-center mb-8">
                  {user ? <div className="p-4 bg-emerald-50 rounded-full text-emerald-500 shadow-sm"><Wifi /></div> : <WifiOff className="text-rose-500 animate-pulse" />}
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Protocol Activation</h3>
                  <input type="password" placeholder="Key" className="w-full p-5 bg-stone-50 rounded-2xl text-center text-2xl font-serif outline-none border border-transparent focus:border-stone-100 transition-all" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} dir="ltr" />
                  <button onClick={handleAdminLogin} className="w-full bg-[#2d1e1a] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Activate Session</button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-5xl font-serif font-black">{t.adminManage}</h2>
                  <button onClick={() => setIsAdminAuthenticated(false)} className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors">Terminate Session</button>
                </div>

                <div className="bg-[#2d1e1a] p-8 rounded-[3rem] text-white grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-2"><AlertTriangle size={14} /> {t.adminTotalFriction}</span>
                    <div className="text-5xl font-black font-serif">{(marketHealth?.totalFriction || 0).toLocaleString()} {MARKET_CONFIG.currency}</div>
                  </div>
                  <div className="space-y-2 border-l border-white/5 pl-8">
                    <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-2"><Lightbulb size={14} /> Node Density</span>
                    <div className="text-5xl font-black font-serif">{experts.length} Active</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Expert Nodes ({experts.length})</h4>
                      <button onClick={() => { setEditObject(null); setView('register'); }} className="p-1 text-[#8b4513] hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"><Plus size={14} /> {t.addNode}</button>
                    </div>
                    <div className="space-y-3">
                      {experts.map((e) => (
                        <div key={e.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center group">
                          <div>
                            <p className="text-[11px] font-bold">{e.name || 'Untitled'}</p>
                            <p className="text-[8px] text-stone-400 uppercase font-black">{e.title || 'Expert'}</p>
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
                      <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Broadcast Signals ({hurdles.length})</h4>
                      <button onClick={() => { setEditObject(null); setView('submitHurdle'); }} className="p-1 text-[#8b4513] hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"><Plus size={14} /> {t.addHurdle}</button>
                    </div>
                    <div className="space-y-3">
                      {hurdles.map((h) => (
                        <div key={h.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center group">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[11px] font-bold truncate">{h.title || 'Untitled'}</p>
                            <p className="text-[9px] text-rose-400 uppercase font-black">-{parseInt(h.frictionCost || 0).toLocaleString()} {MARKET_CONFIG.currency}</p>
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
        )}
      </main>

      {/* Venture Archive Drawer for Investors/Incubator Trackers */}
      {showArchival && (
        <div className="fixed inset-0 bg-[#2d1e1a]/40 backdrop-blur-sm z-[100] flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl p-10 h-full overflow-y-auto shadow-2xl border-l border-stone-100 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-xl font-serif font-black text-[#2d1e1a]">Venture Chronicle & Ledger</h3>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mt-1">Immutable Portfolio & Pivot History</p>
                </div>
                <button onClick={() => setShowArchival(false)} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-50"><X size={20} /></button>
              </div>

              <div className="space-y-6 font-sans text-sm text-stone-600 leading-relaxed">
                <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                  <span className="text-[9px] font-black text-[#8b4513] block mb-1">CURRENT DEPLOYMENT TARGET</span>
                  <p className="text-xs font-bold text-stone-800">Build Protocol: {SYSTEM_VERSION}</p>
                  <p className="text-[11px] text-stone-500 mt-1">Active Market Domain: {MARKET_CONFIG.name} Hub ({MARKET_CONFIG.focus} Configuration)</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">Historical Strategic Pivots</h4>
                  
                  <div className="border-l-2 border-stone-200 pl-4 space-y-2 relative">
                    <div className="absolute w-2 h-2 bg-[#8b4513] rounded-full -left-[5px] top-1.5" />
                    <p className="text-xs font-black text-stone-800">v1.0.2 — Lean Value Canvas Integration</p>
                    <p className="text-xs text-stone-500">Transformed database architecture away from generic bios. Replaced onboarding models with explicit Pain Reliever and Gain Creator telemetry. Integrated The Mom Test verification fields.</p>
                  </div>

                  <div className="border-l-2 border-stone-200 pl-4 space-y-2 relative opacity-60">
                    <div className="absolute w-2 h-2 bg-stone-400 rounded-full -left-[5px] top-1.5" />
                    <p className="text-xs font-black text-stone-800">v1.0.1 — Market Decoupling</p>
                    <p className="text-xs text-stone-500">Decoupled hardcoded geographic nodes. Shifted platform to a multi-market flexible architecture under the dedication of the home country coffee branch brand identity.</p>
                  </div>

                  <div className="border-l-2 border-stone-200 pl-4 space-y-2 relative opacity-40">
                    <div className="absolute w-2 h-2 bg-stone-300 rounded-full -left-[5px] top-1.5" />
                    <p className="text-xs font-black text-stone-800">v1.0.0 — Basic MVP Directory</p>
                    <p className="text-xs text-stone-500">Initial directory rollout logging static professional contacts and simple categorical structural indexes for internal registry matching.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 text-[10px] text-stone-400 font-bold uppercase tracking-widest text-center">
              El Mouloukia Venture Architecture Ecosystem
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-white border border-stone-100 p-5 rounded-[2rem] flex items-center gap-4 shadow-2xl z-[100]">
          <div className="p-2 bg-rose-50 rounded-full text-rose-500"><AlertCircle size={20} /></div>
          <span className="text-xs font-bold text-stone-800">{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="p-1 text-stone-300 hover:text-stone-500 transition-colors"><X size={18} /></button>
        </div>
      )}

      <footer className="mt-20 border-t border-stone-100 py-10 px-6 text-center">
        <div className="flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">
          <span>{SYSTEM_VERSION}</span>
          <span>•</span>
          <button onClick={() => setShowArchival(!showArchival)} className="hover:text-[#8b4513] transition-colors flex items-center gap-1">
            <FileText size={10} /> Venture Archive
          </button>
        </div>
      </footer>
    </div>
  );
}
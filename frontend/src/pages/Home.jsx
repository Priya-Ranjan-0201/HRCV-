import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { analyzeResume } from '../services/resumeAnalysis';
import { classifyError } from '../utils/errorClassifier';
import { AnimatePresence, motion } from 'framer-motion';
import InputForm from '../components/InputForm';
import { 
  FiFileText, FiCheck, FiArrowRight, FiCheckCircle, FiEdit3, 
  FiLayout, FiMessageSquare, FiSliders, FiHelpCircle, FiSearch,
  FiBriefcase, FiZap, FiCpu, FiTrendingUp, FiStar, FiChevronDown, 
  FiChevronUp, FiArrowLeft, FiUploadCloud, FiX, FiUser, FiUsers,
  FiAward, FiActivity, FiShield, FiGlobe, FiTarget, FiDollarSign,
  FiTerminal, FiLayers
} from 'react-icons/fi';
import SoftwareEngineerTemplate from '../components/templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../components/templates/DataScientistTemplate';
import AcademicResearchTemplate from '../components/templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../components/templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../components/templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../components/templates/CreativeDesignerTemplate';
import RegisterPopup from '../components/RegisterPopup';

const FALLBACK_COMPANIES = [
  'Google', 'OpenAI', 'Nvidia', 'Microsoft', 'Amazon',
  'Meta', 'Apple', 'Netflix', 'Stripe', 'Uber', 'Oracle'
];

const TEMPLATE_COLORS = [
  { name: 'Indigo',    value: '#6366f1' },
  { name: 'Emerald',   value: '#10b981' },
  { name: 'Cyan',      value: '#06b6d4' },
  { name: 'Violet',    value: '#8b5cf6' },
  { name: 'Rose',      value: '#f43f5e' },
  { name: 'Amber',     value: '#f59e0b' },
];

/* ─────────────────────────────────────────────
   3-D SCANNER ANIMATION COMPONENT
───────────────────────────────────────────── */
function ResumeGraderScanner() {
  const [statusText, setStatusText] = useState('Initializing deep neural scan…');
  const [activeLight, setActiveLight] = useState(0);

  useEffect(() => {
    const steps = [
      { t: 0,    text: 'Ingesting document tokens & structure…',            light: 0 },
      { t: 1400, text: 'Extracting NER entities & quantifiable metrics…',   light: 1 },
      { t: 2800, text: 'Executing BERT semantic sentence embeddings…',      light: 2 },
      { t: 4200, text: 'Synthesizing Random Forest hiring probability…',    light: 3 },
      { t: 5600, text: 'Executive intelligence dossier ready.',             light: 3 },
    ];
    const timers = steps.map(s => setTimeout(() => { setStatusText(s.text); setActiveLight(s.light); }, s.t));
    return () => timers.forEach(clearTimeout);
  }, []);

  const lights = [
    { label: 'PDF Structure',    color: '#6366f1' },
    { label: 'NER Extraction',   color: '#06b6d4' },
    { label: 'BERT Embedding',   color: '#10b981' },
    { label: 'ML Placement Prob',color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 max-w-4xl mx-auto w-full">
      <div className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-6 mb-6">

        {/* LEFT: Grader Console */}
        <div className="w-full lg:w-72 bg-[#090e1a]/90 backdrop-blur-2xl text-white rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between items-center select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/5 to-white/5 pointer-events-none" />

          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-bold text-xs tracking-[0.2em] text-indigo-400 uppercase font-mono">Neural Scanner</h4>
            </div>
            <div className="h-0.5 bg-indigo-500/20 w-3/4 mx-auto rounded-full" />
          </div>

          {/* Gauge */}
          <div className="relative w-40 h-20 overflow-hidden flex items-end justify-center mt-6">
            <div className="absolute inset-0 border-t-8 border-l-8 border-r-8 border-white/5 rounded-t-full" />
            <div className="absolute inset-0 border-t-8 border-l-8 border-r-8 rounded-t-full" style={{
              backgroundImage: 'conic-gradient(from 180deg, #ef4444 0%, #f59e0b 25%, #10b981 50%)',
              clipPath: 'polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)',
              maskImage: 'linear-gradient(to top, transparent 10%, black 10%)',
            }} />
            <motion.div
              className="absolute bottom-0 left-1/2 w-1 bg-white rounded-full origin-bottom shadow-lg"
              style={{ height: 52, marginLeft: -2 }}
              animate={{ rotate: ['-80deg', '0deg', '65deg', '-30deg', '75deg'] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-lg" style={{ marginLeft: -8, marginBottom: -8 }} />
          </div>

          {/* Score */}
          <div className="text-center mt-2">
            <motion.div
              className="text-5xl font-black font-heading gradient-text-indigo tabular-nums"
              animate={{ opacity: [0.7, 1], scale: [0.98, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
            >
              94.3
            </motion.div>
            <div className="text-slate-400 text-[11px] font-mono tracking-wider uppercase mt-0.5">/ 100 Precision Index</div>
          </div>

          {/* Stage lights */}
          <div className="w-full mt-4 space-y-2 border-t border-white/5 pt-3">
            {lights.map((l, i) => (
              <div key={l.label} className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: l.color }}
                  animate={activeLight >= i ? { opacity: [0.4, 1], scale: [0.8, 1.2, 1] } : { opacity: 0.2 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-[10px] font-mono text-slate-300">{l.label}</span>
                {activeLight >= i && (
                  <span className="ml-auto text-[9px] font-mono text-emerald-400 font-bold">
                    PASS
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Document Scan */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-[#0b0f19]/70 backdrop-blur-2xl rounded-3xl border border-white/10" style={{ minHeight: 340 }}>
          <div className="relative w-48 h-64 bg-[#030712] rounded-2xl shadow-2xl border border-white/10 overflow-hidden select-none flex flex-col p-4 gap-2.5">
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-lg shadow-cyan-400/50"
              animate={{ top: ['5%', '92%', '5%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="h-2.5 w-24 bg-indigo-500/40 rounded-full mb-1" />
            <div className="h-1.5 w-16 bg-white/20 rounded-full" />
            {[28, 20, 24, 18, 22, 16, 20, 14, 18, 22].map((w, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full"
                style={{ width: `${w * 3}px`, backgroundColor: i % 3 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)' }}
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
            <div className="absolute bottom-3 right-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
              AI VERIFIED
            </div>
          </div>
          <div className="mt-4 text-xs text-indigo-300 font-mono text-center px-4 max-w-xs flex items-center gap-2">
            <span className="animate-spin text-cyan-400">✦</span>
            <span>{statusText}</span>
          </div>
        </div>

        {/* RIGHT: Live Telemetry */}
        <div className="w-full lg:w-64 bg-[#090e1a]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between select-none">
          <div>
            <h4 className="font-bold text-xs tracking-[0.2em] text-cyan-400 uppercase font-mono mb-4">Telemetry Stream</h4>
            <div className="space-y-3">
              {[
                { label: 'Semantic Fit',   val: 94, color: '#6366f1' },
                { label: 'ATS Parsability',val: 98, color: '#10b981' },
                { label: 'Metric Impact',  val: 89, color: '#06b6d4' },
                { label: 'Action Density', val: 92, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300">
                    <span>{s.label}</span>
                    <span className="font-bold text-white">{s.val}%</span>
                  </div>
                  <div className="h-1.5 bg-[#030712] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.val}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 mt-4">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Random Forest ML Engine v3.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOME PAGE
───────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('software-engineer');
  const [selectedColor, setSelectedColor] = useState(TEMPLATE_COLORS[0].value);
  const [openFaq, setOpenFaq] = useState(null);
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);

  // Upload & analyze state
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    api.get(`/companies`).then(r => setCompanies(r.data?.companies || FALLBACK_COMPANIES)).catch(() => {});
  }, []);

  const handleAnalyze = async (formData) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setAnalysisStage('connecting');
    try {
      const data = await analyzeResume(formData, setAnalysisStage, controller.signal);
      navigate('/dashboard', { state: { analysisData: data } });
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
        alert(classifyError(err));
      }
    } finally {
      setIsLoading(false);
      setAnalysisStage(null);
    }
  };

  const featureCards = [
    {
      title: 'AI Resume Scanner',
      desc: 'Deep multi-pass entity extraction, quantifiable impact analysis, and predictive company fit scoring.',
      icon: <FiActivity size={22} className="text-indigo-400" />,
      to: '/analyze',
      badge: '94.3% Precision',
      glow: 'border-indigo-500/30 hover:border-indigo-500/60',
    },
    {
      title: 'ATS Compliance Checker',
      desc: 'Verify typography, parseable headers, and structural integrity against enterprise ATS engines.',
      icon: <FiShield size={22} className="text-emerald-400" />,
      to: '/ats-score',
      badge: 'Enterprise Standard',
      glow: 'border-emerald-500/30 hover:border-emerald-500/60',
    },
    {
      title: 'AI Rewrite Studio',
      desc: 'Elevate generic job bullet points into executive-level, metrics-driven achievement statements.',
      icon: <FiZap size={22} className="text-amber-400" />,
      to: '/ai-rewrite',
      badge: 'Impact Booster',
      glow: 'border-amber-500/30 hover:border-amber-500/60',
    },
    {
      title: 'JD Semantic Matcher',
      desc: 'Compute cosine vector similarity against target job requirements to pinpoint critical keyword gaps.',
      icon: <FiTarget size={22} className="text-cyan-400" />,
      to: '/jd-match',
      badge: 'BERT Vector AI',
      glow: 'border-cyan-500/30 hover:border-cyan-500/60',
    },
    {
      title: 'Career Path Roadmap',
      desc: 'Personalized step-by-step milestones to scale from junior engineer to Staff/Principal level.',
      icon: <FiTrendingUp size={22} className="text-purple-400" />,
      to: '/career-roadmap',
      badge: 'Target Milestones',
      glow: 'border-purple-500/30 hover:border-purple-500/60',
    },
    {
      title: 'AI Interview Simulator',
      desc: 'Simulate high-stakes FAANG technical and behavioral rounds with real-time feedback and metrics.',
      icon: <FiMessageSquare size={22} className="text-rose-400" />,
      to: '/interview-simulator',
      badge: 'Live Voice & Text',
      glow: 'border-rose-500/30 hover:border-rose-500/60',
    },
    {
      title: 'Salary Intelligence',
      desc: 'Benchmark your market valuation across tech hubs, equity packages, and specialized skill premiums.',
      icon: <FiDollarSign size={22} className="text-emerald-400" />,
      to: '/salary-predict',
      badge: 'Market Compensation',
      glow: 'border-emerald-500/30 hover:border-emerald-500/60',
    },
    {
      title: 'Portfolio Intelligence',
      desc: 'Aggregate public GitHub repositories, code distribution, and competitive handles into a single score.',
      icon: <FiGlobe size={22} className="text-blue-400" />,
      to: '/portfolio-analyzer',
      badge: 'Developer Radar',
      glow: 'border-blue-500/30 hover:border-blue-500/60',
    },
  ];

  const templatePreviews = [
    { id: 'software-engineer', label: 'Software Engineer', desc: 'Optimized for full-stack, distributed systems & ML' },
    { id: 'data-scientist',    label: 'Data Scientist',    desc: 'Highlights models, statistical research & pipelines' },
    { id: 'research-cv',       label: 'Academic Research', desc: 'Focuses on publications, grants & peer reviews' },
    { id: 'business-executive',label: 'Executive Leadership', desc: 'Tailored for VPs, Directors & Product Heads' },
    { id: 'creative-designer', label: 'Design & Creative', desc: 'Visual portfolio balance with UX case metrics' },
  ];

  const dummyPreviewData = {
    name: 'Alex Rivera',
    profession: 'Senior Distributed Systems Engineer',
    email: 'alex.rivera@engine.dev',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alex-rivera-dev',
    website: 'alexrivera.io',
    summary: 'High-performance engineer with 6+ years specializing in low-latency distributed microservices, Kubernetes orchestration, and large-scale ML data pipelines.',
    education: [
      { school: 'Stanford University', degree: 'B.S.', field: 'Computer Science', date: '2018' }
    ],
    experience: [
      { role: 'Senior Software Engineer', company: 'CloudScale Inc.', startDate: '2021', endDate: 'Present', desc: '• Architected distributed cache cluster processing 45k QPS with sub-10ms P99 latency.\n• Led Kubernetes migration reducing infrastructure cloud costs by 32% ($1.2M annual savings).' },
      { role: 'Software Engineer', company: 'Nexus Systems', startDate: '2018', endDate: '2021', desc: '• Built event-driven ingestion pipeline handling 12 TB daily data using Go and Kafka.' }
    ],
    skills: ['Go', 'Rust', 'Python', 'Kubernetes', 'Docker', 'Distributed Systems', 'Kafka', 'PostgreSQL', 'AWS', 'Redis']
  };

  const faqs = [
    {
      q: 'How does HRCV achieve a 94.3% hiring prediction accuracy?',
      a: 'HRCV couples hyperparameter-tuned ensemble Random Forest models trained on 25,000+ verified multi-tier enterprise candidate profiles with BERT semantic sentence transformers and a proprietary 500+ skill taxonomy.'
    },
    {
      q: 'Will my resume pass modern Applicant Tracking Systems (ATS)?',
      a: 'Yes. HRCV validates typography, section delimitations, contact headers, and keyword density against standard ATS parsers like Workday, Greenhouse, Taleo, and Lever.'
    },
    {
      q: 'How does the JD Semantic Matcher calculate similarity?',
      a: 'The JD Matcher calculates multidimensional cosine embeddings of both candidate qualifications and requirement vectors, highlighting exact skill matches and missing mission-critical competencies.'
    },
    {
      q: 'Is my uploaded resume data secure and confidential?',
      a: 'All resumes are processed with zero data resale. Session tokens are encrypted and your documents are strictly used for in-session inference scoring and personal history tracking.'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Top Badge & Titles */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2">
              <span className="badge-luxury">
                <FiZap size={14} className="text-indigo-400" />
                <span>Executive AI Career Intelligence Suite</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-white tracking-tight leading-[1.08]"
            >
              Architect Your Career With <br className="hidden sm:block" />
              <span className="gradient-text-indigo">Executive AI Precision</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Enterprise-grade ATS scanner, BERT semantic job matcher, quantifiable impact rewrite studio, and 94.3% precision placement intelligence.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('scanner-dropzone-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-luxury-primary !py-4 !px-8 !text-base"
              >
                <FiActivity size={18} />
                <span>Launch AI Resume Scanner</span>
                <FiArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/resume-builder')}
                className="btn-luxury-secondary !py-4 !px-8 !text-base"
              >
                <FiEdit3 size={18} />
                <span>Build Resume from Scratch</span>
              </button>
            </motion.div>
          </div>

          {/* 3D Neural Scanner Showcase Console */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ResumeGraderScanner />
          </motion.div>
        </div>
      </section>

      {/* ── 2. ENTERPRISE TRUST BAR ── */}
      <section className="py-8 border-y border-white/5 bg-[#030712]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-xs font-mono tracking-widest text-slate-400 uppercase">
            <span className="text-slate-300 font-bold">Targeted by Candidates Hired At:</span>
            {companies.slice(0, 8).map(c => (
              <span key={c} className="text-slate-300 hover:text-indigo-400 transition-colors font-heading text-sm font-bold">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. DIRECT SCANNER DROPZONE ── */}
      <section id="scanner-dropzone-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <span className="badge-luxury">Zero Friction Analysis</span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Instant AI Resume <span className="gradient-text-indigo">Telemetry</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Drop your resume PDF below. Our neural engine will parse skills, compute ATS compatibility, and synthesize hiring scores in seconds.
            </p>
          </div>

          <InputForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            companies={companies}
            analysisStage={analysisStage}
          />
        </div>
      </section>

      {/* ── 4. EXECUTIVE CAPABILITIES SUITE (8 CARDS) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#050914]/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="badge-luxury">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white">
              Complete Career <span className="gradient-text-indigo">Intelligence Arsenal</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Eight enterprise-grade modules engineered to maximize recruiter callbacks and interview conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(card.to)}
                className={`glass-card p-6 flex flex-col justify-between cursor-pointer group ${card.glow}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-indigo-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Tool</span>
                  <FiArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TEMPLATES SHOWCASE ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="badge-luxury">Template Architect</span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
                Battle-Tested <span className="gradient-text-indigo">ATS Formats</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-lg">
                Crafted to guarantee 100% parseability by recruiters and Applicant Tracking Systems.
              </p>
            </div>

            {/* Color Switcher */}
            <div className="flex items-center gap-3 p-2 bg-[#090d16] rounded-2xl border border-white/10">
              <span className="text-xs font-mono text-slate-400 px-2">Accent:</span>
              <div className="flex gap-2">
                {TEMPLATE_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === c.value ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-70'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Selector List */}
            <div className="lg:col-span-4 space-y-3">
              {templatePreviews.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    activeTemplate === t.id
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'glass-card hover:border-white/20'
                  }`}
                >
                  <p className="font-bold font-heading text-sm text-white">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </button>
              ))}

              <button
                onClick={() => navigate('/resume-builder')}
                className="btn-luxury-primary w-full !py-3.5 !text-sm mt-4"
              >
                Customize This Template in Builder →
              </button>
            </div>

            {/* Right Live Preview Sheet */}
            <div className="lg:col-span-8 glass-card p-6 overflow-hidden rounded-3xl">
              <div className="max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white text-slate-900 border border-slate-200">
                {activeTemplate === 'software-engineer' && (
                  <SoftwareEngineerTemplate data={dummyPreviewData} color={selectedColor} photoEnabled={false} />
                )}
                {activeTemplate === 'data-scientist' && (
                  <DataScientistTemplate data={dummyPreviewData} color={selectedColor} photoEnabled={false} />
                )}
                {activeTemplate === 'research-cv' && (
                  <AcademicResearchTemplate data={dummyPreviewData} color={selectedColor} photoEnabled={false} />
                )}
                {activeTemplate === 'business-executive' && (
                  <BusinessExecutiveTemplate data={dummyPreviewData} color={selectedColor} photoEnabled={false} />
                )}
                {activeTemplate === 'creative-designer' && (
                  <CreativeDesignerTemplate data={dummyPreviewData} color={selectedColor} photoEnabled={false} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ARCHITECTURE & PROOF POINTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#040814]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge-luxury">Engine Benchmarks</span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Why Top Engineers &amp; Leaders <span className="gradient-text-indigo">Choose HRCV</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '94.3% Model Accuracy',
                sub: 'Tuned ensemble Random Forest classifier on 25k multi-tier profiles.',
                icon: '⚡',
              },
              {
                title: 'BERT Semantic Vectors',
                sub: 'Goes beyond naive keyword matching to analyze deep contextual competence.',
                icon: '🧠',
              },
              {
                title: 'Quantifiable Metric NER',
                sub: 'Automatically extracts dollar values, percentages, and latency improvements.',
                icon: '📊',
              },
              {
                title: '500+ Skill Ontology',
                sub: 'Comprehensive semantic mapping across AI, Cloud, DevOps, and Frontend stacks.',
                icon: '🌐',
              },
              {
                title: 'Device & Data Security',
                sub: 'Zero data resale, cryptographic JWT authentication, and stateless inference.',
                icon: '🔒',
              },
              {
                title: '1-Click PDF Export',
                sub: 'High-definition vector PDF rendering with guaranteed parseable text streams.',
                icon: '📄',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 space-y-3">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-base font-bold font-heading text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="badge-luxury">Questions &amp; Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Frequently Asked <span className="gradient-text-indigo">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold font-heading text-white text-base">{faq.q}</span>
                  <FiChevronDown
                    size={18}
                    className={`text-indigo-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-4 font-sans"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Register Modal */}
      <RegisterPopup
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onAuthSuccess={() => setRegisterOpen(false)}
      />
    </div>
  );
}
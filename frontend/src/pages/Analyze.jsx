import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { analyzeResume } from '../services/resumeAnalysis';
import { classifyError } from '../utils/errorClassifier';
import { AnimatePresence, motion } from 'framer-motion';
import InputForm from '../components/InputForm';
import {
  FiUploadCloud, FiEdit3, FiArrowRight, FiArrowLeft, FiX,
  FiUser, FiUsers, FiStar, FiCheck, FiBriefcase,
  FiAward, FiFileText, FiActivity, FiShield
} from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import SoftwareEngineerTemplate from '../components/templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../components/templates/DataScientistTemplate';
import AcademicResearchTemplate from '../components/templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../components/templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../components/templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../components/templates/CreativeDesignerTemplate';

const FALLBACK_COMPANIES = [
  'Google', 'OpenAI', 'Nvidia', 'Microsoft', 'Amazon',
  'Meta', 'Apple', 'Netflix', 'Stripe', 'Uber', 'Oracle'
];

const TEMPLATE_COLORS = [
  { name: 'Indigo',  value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan',    value: '#06b6d4' },
  { name: 'Violet',  value: '#8b5cf6' },
  { name: 'Rose',    value: '#f43f5e' },
  { name: 'Amber',   value: '#f59e0b' },
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

function LiveResumePreview({ data, color, photoEnabled, templateId }) {
  const tid = (templateId || '').toLowerCase().trim();

  let templateContent = null;
  if (tid === 'cascade' || tid === 'software-engineer') {
    templateContent = <SoftwareEngineerTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'cubic' || tid === 'data-scientist') {
    templateContent = <DataScientistTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'crisp' || tid === 'research-cv') {
    templateContent = <AcademicResearchTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'aria' || tid === 'healthcare') {
    templateContent = <HealthcareProfessionalTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'business-executive' || tid === 'apex') {
    templateContent = <BusinessExecutiveTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else {
    templateContent = <CreativeDesignerTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  }

  return (
    <div id="live-resume-preview" className="bg-white rounded-2xl shadow-xl overflow-hidden w-full h-full text-slate-900" style={{ minHeight: 520 }}>
      {templateContent}
    </div>
  );
}

async function saveAnalysisHistory(analysisData, resumeName) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('hrcv_user') || localStorage.getItem('tonycv_user'));
  } catch {
    user = null;
  }
  if (!user?.id || !analysisData) return;

  try {
    await api.post('/resume-history', {
      user_id: user.id,
      resume_name: resumeName || 'Resume analysis',
      analysis_result: analysisData,
    });
  } catch {
    // Non-blocking history save
  }
}

export default function Analyze() {
  const navigate = useNavigate();
  const [step, setStep] = useState('option_select');
  const [_experience, setExperience] = useState(null);
  const [photoEnabled, _setPhotoEnabled] = useState(false);
  const [appliedTemplate, _setAppliedTemplate] = useState('software-engineer');
  const [selectedColor, setSelectedColor] = useState(TEMPLATE_COLORS[0].value);

  // Resume form data
  const [resumeData, setResumeData] = useState({
    name: '', profession: '', email: '', phone: '', location: '',
    linkedin: '', website: '', summary: '', photoUrl: '',
    education: [{ school: '', degree: '', field: '', date: '' }],
    experience: [{ role: '', company: '', startDate: '', endDate: '', desc: '' }],
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [builderStep, setBuilderStep] = useState(0);

  // Upload & analyze state
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(null);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);
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
    setError('');
    try {
      const data = await analyzeResume(formData, setAnalysisStage, controller.signal);
      const uploadedFile = formData.get('cv_file');
      await saveAnalysisHistory(data, uploadedFile?.name || 'Uploaded resume');
      navigate('/dashboard', { state: { analysisData: data } });
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
        setError(classifyError(err));
      }
    } finally {
      setIsLoading(false);
      setAnalysisStage(null);
    }
  };

  const handleScratchAnalyze = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setAnalysisStage('connecting');
    setError('');
    try {
      const el = document.getElementById('live-resume-preview');
      const blob = await html2pdf().set({ margin: 0, filename: 'resume.pdf', image: { type: 'jpeg', quality: 0.98 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from(el).outputPdf('blob');
      const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
      const fd = new FormData();
      fd.append('cv_file', file);
      fd.append('target_company', FALLBACK_COMPANIES[0] || 'Google');
      fd.append('job_description', '');
      const data = await analyzeResume(fd, setAnalysisStage, controller.signal);
      await saveAnalysisHistory(data, resumeData.name ? `${resumeData.name} resume` : 'Built resume');
      navigate('/dashboard', { state: { analysisData: data } });
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
        setError(classifyError(err));
      }
    } finally {
      setIsLoading(false);
      setAnalysisStage(null);
    }
  };

  const updateEdu = (i, field, val) => setResumeData(p => {
    const ed = [...p.education]; ed[i] = { ...ed[i], [field]: val }; return { ...p, education: ed };
  });
  const addEdu = () => setResumeData(p => ({ ...p, education: [...p.education, { school: '', degree: '', field: '', date: '' }] }));
  const removeEdu = (i) => setResumeData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));

  const updateExp = (i, field, val) => setResumeData(p => {
    const ex = [...p.experience]; ex[i] = { ...ex[i], [field]: val }; return { ...p, experience: ex };
  });
  const addExp = () => setResumeData(p => ({ ...p, experience: [...p.experience, { role: '', company: '', startDate: '', endDate: '', desc: '' }] }));
  const removeExp = (i) => setResumeData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !resumeData.skills.includes(s)) {
      setResumeData(p => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setResumeData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const BUILDER_STEPS = [
    { id: 'contact',    label: 'Contact Info' },
    { id: 'summary',    label: 'Summary' },
    { id: 'education',  label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills',     label: 'Skills' },
    { id: 'preview',    label: 'Preview & Scan' },
  ];

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Top Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="badge-luxury">
            <FiActivity size={14} className="text-indigo-400" />
            <span>AI Neural Resume Scanner</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white">
            Evaluate Your Resume With <span className="gradient-text-indigo">Executive AI</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Upload your PDF for instant grading, or use the interactive builder to craft and score an ATS-compliant resume.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Option Select */}
          {step === 'option_select' && (
            <motion.div key="option_select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              
              <ResumeGraderScanner />

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('form_input')}
                  className="glass-card-glow p-8 text-left space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <FiUploadCloud size={28} />
                    </div>
                    <span className="badge-luxury">Most Direct</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading text-white group-hover:text-indigo-300 transition-colors">
                      Upload Existing PDF Resume
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Upload your current resume PDF for comprehensive ATS verification, skill gap extraction, and company fit matrix.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Scanner</span>
                    <FiArrowRight size={14} />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('wizard_experience')}
                  className="glass-card p-8 text-left space-y-4 cursor-pointer group hover:border-purple-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <FiEdit3 size={28} />
                    </div>
                    <span className="badge-luxury !bg-purple-500/10 !border-purple-500/30 !text-purple-300">
                      Step-by-Step
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading text-white group-hover:text-purple-300 transition-colors">
                      Build from Scratch &amp; Score
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Use our guided interactive builder to structure work history, format education, and compile a vector PDF instantly.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span>Start Guided Builder</span>
                    <FiArrowRight size={14} />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Form Input Mode */}
          {step === 'form_input' && (
            <motion.div key="form_input" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 max-w-3xl mx-auto">
              <button
                onClick={() => setStep('option_select')}
                className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                <FiArrowLeft size={14} /> Back to Options
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <InputForm
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                companies={companies}
                analysisStage={analysisStage}
              />
            </motion.div>
          )}

          {/* Guided Wizard Step 1: Experience */}
          {step === 'wizard_experience' && (
            <motion.div key="wizard_experience" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl mx-auto glass-card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('option_select')} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5">
                  <FiArrowLeft size={14} /> Back
                </button>
                <span className="text-xs font-mono text-indigo-400">Step 1 of 3</span>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading text-white">Select Your Career Stage</h2>
                <p className="text-xs text-slate-400">This helps calibrate your resume depth and section hierarchy.</p>
              </div>

              <div className="grid gap-4">
                {[
                  { label: 'No Experience / Student', desc: 'Graduating student or entry-level job seeker', icon: <FiUser size={20} /> },
                  { label: '1 to 4 Years Experience', desc: 'Mid-level engineer or professional with active track record', icon: <FiUsers size={20} /> },
                  { label: '5+ Years Senior / Staff', desc: 'Executive leadership, architect, or senior engineering manager', icon: <FiAward size={20} /> },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => { setExperience(opt.label); setStep('builder_form'); }}
                    className="p-5 rounded-2xl bg-[#030712]/60 border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.04] text-left flex items-center gap-4 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white font-heading">{opt.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    <FiArrowRight size={16} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Builder Form */}
          {step === 'builder_form' && (
            <motion.div key="builder_form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('option_select')} className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5">
                  <FiArrowLeft size={14} /> Exit Builder
                </button>
                <div className="flex gap-2">
                  {BUILDER_STEPS.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setBuilderStep(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        builderStep === idx
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}. {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Controls */}
                <div className="lg:col-span-6 glass-card p-8 space-y-6">
                  {builderStep === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold font-heading text-white">Contact &amp; Identity</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                          <input type="text" value={resumeData.name} onChange={e => setResumeData({...resumeData, name: e.target.value})} placeholder="Alex Rivera" className="input-luxury text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Job Title</label>
                          <input type="text" value={resumeData.profession} onChange={e => setResumeData({...resumeData, profession: e.target.value})} placeholder="Staff Engineer" className="input-luxury text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
                          <input type="email" value={resumeData.email} onChange={e => setResumeData({...resumeData, email: e.target.value})} placeholder="alex@domain.com" className="input-luxury text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Phone</label>
                          <input type="text" value={resumeData.phone} onChange={e => setResumeData({...resumeData, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="input-luxury text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                        <input type="text" value={resumeData.location} onChange={e => setResumeData({...resumeData, location: e.target.value})} placeholder="San Francisco, CA" className="input-luxury text-sm" />
                      </div>
                    </div>
                  )}

                  {builderStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold font-heading text-white">Executive Summary</h3>
                      <textarea rows={6} value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} placeholder="Proven technical leader specializing in high-throughput distributed systems..." className="input-luxury text-sm resize-none font-mono" />
                    </div>
                  )}

                  {builderStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold font-heading text-white">Education History</h3>
                        <button onClick={addEdu} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-bold">+ Add Degree</button>
                      </div>
                      {resumeData.education.map((edu, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#030712]/60 border border-white/10 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="University / School" className="input-luxury text-xs" />
                            <input type="text" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Degree (B.S., M.S.)" className="input-luxury text-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} placeholder="Field of Study" className="input-luxury text-xs" />
                            <input type="text" value={edu.date} onChange={e => updateEdu(i, 'date', e.target.value)} placeholder="Graduation Year" className="input-luxury text-xs" />
                          </div>
                          {resumeData.education.length > 1 && (
                            <button onClick={() => removeEdu(i)} className="text-[10px] font-mono text-rose-400 hover:underline">Remove</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {builderStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold font-heading text-white">Work Experience</h3>
                        <button onClick={addExp} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-bold">+ Add Role</button>
                      </div>
                      {resumeData.experience.map((exp, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#030712]/60 border border-white/10 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} placeholder="Role / Title" className="input-luxury text-xs" />
                            <input type="text" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company Name" className="input-luxury text-xs" />
                          </div>
                          <textarea rows={3} value={exp.desc} onChange={e => updateExp(i, 'desc', e.target.value)} placeholder="• Quantifiable achievements with metrics..." className="input-luxury text-xs resize-none font-mono" />
                          {resumeData.experience.length > 1 && (
                            <button onClick={() => removeExp(i)} className="text-[10px] font-mono text-rose-400 hover:underline">Remove</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {builderStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold font-heading text-white">Skills &amp; Technologies</h3>
                      <div className="flex gap-2">
                        <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="e.g. PyTorch, Kubernetes, Go" className="input-luxury text-xs" />
                        <button onClick={addSkill} className="btn-luxury-primary !px-4 !py-2 !text-xs shrink-0">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {resumeData.skills.map(s => (
                          <span key={s} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono flex items-center gap-1.5 border border-indigo-500/30">
                            {s}
                            <button onClick={() => removeSkill(s)} className="hover:text-rose-400">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {builderStep === 5 && (
                    <div className="space-y-6 text-center">
                      <h3 className="text-xl font-bold font-heading text-white">Ready for Neural Analysis</h3>
                      <p className="text-xs text-slate-400">Generate a high-definition ATS PDF and run real-time inference against company benchmarks.</p>
                      
                      <button
                        onClick={handleScratchAnalyze}
                        disabled={isLoading}
                        className="btn-luxury-primary w-full !py-4 !text-base"
                      >
                        <FiActivity size={18} />
                        <span>{isLoading ? 'Compiling PDF & Scoring…' : 'Compile & Analyze My Built Resume'}</span>
                        <FiArrowRight size={18} />
                      </button>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    {builderStep > 0 && (
                      <button onClick={() => setBuilderStep(s => s - 1)} className="btn-luxury-secondary !py-2 !px-4 !text-xs">
                        ← Previous Step
                      </button>
                    )}
                    {builderStep < BUILDER_STEPS.length - 1 && (
                      <button onClick={() => setBuilderStep(s => s + 1)} className="btn-luxury-primary !py-2 !px-5 !text-xs ml-auto">
                        Next Step →
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Live Sheet Preview */}
                <div className="lg:col-span-6 glass-card p-6 overflow-hidden sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-400 uppercase">Live Output Sheet</span>
                    <div className="flex gap-2">
                      {TEMPLATE_COLORS.map(c => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.value)}
                          className={`w-5 h-5 rounded-full transition-transform ${selectedColor === c.value ? 'scale-125 ring-2 ring-white' : 'opacity-60'}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>

                  <LiveResumePreview
                    data={resumeData}
                    color={selectedColor}
                    photoEnabled={photoEnabled}
                    templateId={appliedTemplate}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

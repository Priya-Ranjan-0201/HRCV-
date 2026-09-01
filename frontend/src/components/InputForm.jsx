import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiBriefcase, FiAward, FiArrowRight, FiCheck, FiSearch, FiUser, FiUsers, FiStar, FiChevronDown, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const COMPANY_META = {
  Google:    { color: '#4285F4', bg: 'rgba(66,133,244,0.15)',  icon: '🔵' },
  Amazon:    { color: '#FF9900', bg: 'rgba(255,153,0,0.15)',   icon: '📦' },
  Microsoft: { color: '#00A4EF', bg: 'rgba(0,164,239,0.15)',  icon: '🪟' },
  Meta:      { color: '#1877F2', bg: 'rgba(24,119,242,0.15)', icon: '🌐' },
  Apple:     { color: '#A2AAAD', bg: 'rgba(162,170,173,0.15)', icon: '🍎' },
  Netflix:   { color: '#E50914', bg: 'rgba(229,9,20,0.15)',   icon: '🎬' },
  Nvidia:    { color: '#76B900', bg: 'rgba(118,185,0,0.15)',   icon: '⚡' },
  OpenAI:    { color: '#10A37F', bg: 'rgba(16,163,127,0.15)', icon: '🤖' },
  Stripe:    { color: '#635BFF', bg: 'rgba(99,91,255,0.15)',  icon: '💳' },
  Uber:      { color: '#000000', bg: 'rgba(255,255,255,0.15)', icon: '🚗' },
  Adobe:     { color: '#FF0000', bg: 'rgba(255,0,0,0.15)',    icon: '🎨' },
  Oracle:    { color: '#F80000', bg: 'rgba(248,0,0,0.15)',    icon: '🔴' },
  IBM:       { color: '#1F70C1', bg: 'rgba(31,112,193,0.15)', icon: '🔷' },
  Infosys:   { color: '#007DC1', bg: 'rgba(0,125,193,0.15)', icon: '💼' },
  TCS:       { color: '#A100FF', bg: 'rgba(161,0,255,0.15)',  icon: '🏢' },
  Wipro:     { color: '#FF8A00', bg: 'rgba(255,138,0,0.15)',  icon: '🌐' },
  Accenture: { color: '#A100FF', bg: 'rgba(161,0,255,0.15)',  icon: '🎯' },
};

const CompanyDropdown = ({ value, onChange, companies }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = companies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const selected = companies.find(c => c === value);
  const meta = selected ? (COMPANY_META[selected] || { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '🏢' }) : null;

  return (
    <div ref={dropdownRef} className="relative w-full" style={{ zIndex: open ? 1000 : 1 }}>
      <button
        id="company-dropdown-trigger"
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-white/10 rounded-xl bg-[#030712]/70 text-left transition-all hover:border-indigo-500/40"
      >
        {selected ? (
          <>
            <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-base" style={{ background: meta.bg }}>
              {meta.icon}
            </span>
            <span className="flex-1 text-slate-100 font-bold truncate text-sm">{selected}</span>
          </>
        ) : (
          <>
            <FiBriefcase size={16} className="text-slate-400 shrink-0" />
            <span className="flex-1 text-slate-400 text-sm">Select Target Company</span>
          </>
        )}
        <FiChevronDown size={16} className={`shrink-0 transition-transform text-slate-400 ${open ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#090d16]/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden" style={{ zIndex: 1001 }}>
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tech company..."
                className="w-full rounded-lg py-2 pl-9 pr-3 text-sm text-slate-100 bg-[#030712]/60 border border-white/10 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-slate-500 text-sm">No companies found</div>
            ) : filtered.map(company => {
              const m = COMPANY_META[company] || { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '🏢' };
              const isSelected = company === value;
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => {
                    onChange(company);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-base" style={{ background: m.bg }}>
                    {m.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{company}</div>
                  </div>
                  {isSelected && <FiCheck size={16} className="text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ANALYSIS_STAGES = {
  connecting: {
    icon: '⚡',
    text: 'Connecting to HRCV AI Engine',
    sub: 'Waking ML server & initializing inference weights…',
    progress: 15,
  },
  waking: {
    icon: '⏳',
    text: 'Waking up AI Engine',
    sub: 'Spinning up GPU/CPU cluster for deep parsing…',
    progress: 30,
  },
  ready: {
    icon: '✓',
    text: 'Engine Ready',
    sub: 'Executing multi-pass document parsing…',
    progress: 50,
  },
  parsing: {
    icon: '📄',
    text: 'Extracting PDF Entities',
    sub: 'Scanning technical skills, career metrics, and ATS structure…',
    progress: 70,
  },
  analyzing: {
    icon: '🧠',
    text: 'Random Forest & BERT Matcher',
    sub: 'Computing company fit vectors and predictive probability…',
    progress: 85,
  },
  finishing: {
    icon: '📊',
    text: 'Generating 360° Radar',
    sub: 'Synthesizing report & actionable improvements…',
    progress: 95,
  },
  complete: {
    icon: '✓',
    text: 'Analysis Complete!',
    sub: 'Rendering executive intelligence dashboard…',
    progress: 100,
  },
  timeout: {
    icon: '⚠️',
    text: 'Server High Load',
    sub: 'Analysis taking a few moments longer — ready to retry.',
    progress: 0,
  },
};

const InputForm = ({ onAnalyze, isLoading, companies, analysisStage }) => {
  const [cvFile, setCvFile] = useState(null);
  const [cgpa, setCgpa] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [dragOver, setDragOver] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(elapsedRef.current);
    }
    return () => clearInterval(elapsedRef.current);
  }, [isLoading]);

  const activeStage = ANALYSIS_STAGES[analysisStage] || ANALYSIS_STAGES.connecting;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cvFile) {
      alert('Please upload your Resume/CV PDF file.');
      return;
    }
    if (!cvFile.name.toLowerCase().endsWith('.pdf') && cvFile.type !== 'application/pdf') {
      alert('Only PDF files are supported. Please upload a .pdf file.');
      return;
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      alert('File is too large. Please upload a PDF under 10 MB.');
      return;
    }

    const fd = new FormData();
    fd.append('cv_file', cvFile);
    if (cgpa) fd.append('cgpa', parseFloat(cgpa));
    if (targetCompany) fd.append('target_company', targetCompany);
    fd.append('experience_level', experienceLevel);

    onAnalyze(fd);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setCvFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const companyList = companies && companies.length > 0 ? companies : [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix",
    "Nvidia", "OpenAI", "Stripe", "Uber", "Adobe", "Oracle", "IBM"
  ];

  return (
    <div className="glass-card-glow p-8 md:p-10 max-w-3xl mx-auto text-left relative overflow-hidden">
      {/* Laser Scanning Line when Loading */}
      {isLoading && <div className="laser-beam" />}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <FiUploadCloud size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-white">AI Resume Intelligence Scanner</h2>
            <span className="badge-luxury">v3.0 Engine</span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Upload your resume PDF for instant ATS grading, skill gap analysis, and placement scoring.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Holographic Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
            1. Upload Resume / CV (PDF Only)
          </label>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              cvFile
                ? 'border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : dragOver
                ? 'border-indigo-400 bg-indigo-500/20'
                : 'border-white/10 hover:border-indigo-500/50 bg-[#030712]/50 hover:bg-[#030712]/70'
            }`}
            onClick={() => document.getElementById('cv-upload').click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              cvFile
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400'
            }`}>
              <FiUploadCloud size={28} />
            </div>
            <div className="text-center">
              <p className="text-slate-100 font-bold text-sm">
                {cvFile ? cvFile.name : 'Click to select or drag & drop resume PDF'}
              </p>
              <p className="text-slate-400 text-xs mt-1 font-mono">
                {cvFile ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Parse` : 'PDF format • Up to 10MB'}
              </p>
            </div>
            {cvFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline mt-1"
              >
                Remove / Change file
              </button>
            )}
          </div>
        </div>

        {/* CGPA & Company Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
              <FiAward size={14} className="text-indigo-400" /> Academic GPA / CGPA <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              className="input-luxury"
              placeholder="e.g. 8.8 / 10.0"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
              <FiBriefcase size={14} className="text-indigo-400" /> Target Company <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
            </label>
            <CompanyDropdown
              value={targetCompany}
              onChange={setTargetCompany}
              companies={companyList}
            />
          </div>
        </div>

        {/* Experience Level Selector */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
            <FiUsers size={14} className="text-indigo-400" /> Experience Tier
          </label>
          <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-[#030712]/60 border border-white/10">
            {[
              { id: 'fresher', label: 'Fresher / Grad', icon: <FiUser size={15} />, sub: '0–1 years', color: '#10b981' },
              { id: 'experienced', label: 'Mid-Level', icon: <FiUsers size={15} />, sub: '2–5 years', color: '#6366f1' },
              { id: 'highly_experienced', label: 'Senior / Lead', icon: <FiStar size={15} />, sub: '5+ years', color: '#f59e0b' },
            ].map(exp => {
              const active = experienceLevel === exp.id;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperienceLevel(exp.id)}
                  className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                    active
                      ? 'bg-white/10 border border-white/20 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div style={{ color: active ? exp.color : 'inherit' }}>
                    {exp.icon}
                  </div>
                  <span className="text-xs font-bold">{exp.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{exp.sub}</span>
                  {active && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Progress Bar Panel */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-300 flex items-center gap-2">
                <span className="animate-spin text-sm">✦</span> {activeStage.text}
              </span>
              <span className="text-slate-400">{elapsed}s elapsed</span>
            </div>
            <div className="w-full bg-[#030712] rounded-full h-2 overflow-hidden p-[1px] border border-indigo-500/20">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                initial={{ width: '5%' }}
                animate={{ width: `${activeStage.progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[11px] text-slate-400 italic">{activeStage.sub}</p>
          </motion.div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !cvFile}
          className="btn-luxury-primary w-full !py-4 !text-base !rounded-xl"
        >
          <FiActivity size={18} />
          <span>{isLoading ? 'Processing AI Analysis…' : 'Analyze & Score Resume Now'}</span>
          <FiArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default InputForm;

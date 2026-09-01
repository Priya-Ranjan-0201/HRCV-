import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiCheckCircle, FiAlertCircle, FiActivity, FiLayers, FiBarChart2, FiAward, FiArrowRight } from 'react-icons/fi';

function ScoreGauge({ score }) {
  const pct = score / 100;
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ * (1 - pct);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
        <circle
          cx={90} cy={90} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 12px ${color}88)` }}
        />
        <text x={90} y={85} textAnchor="middle" fill="white" fontSize={34} fontWeight="900" fontFamily="Outfit">{score}</text>
        <text x={90} y={108} textAnchor="middle" fill={color} fontSize={11} fontWeight="700" fontFamily="JetBrains Mono">/100 ATS SCORE</text>
      </svg>
      <span className={`text-sm font-black mt-2 font-mono uppercase tracking-wider ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
        {score >= 80 ? '✦ Optimal ATS Fit' : score >= 60 ? '◆ Moderate Alignment' : '▲ Action Required'}
      </span>
    </div>
  );
}

export default function AtsScorePage() {
  const [cvText, setCvText] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!cvText.trim()) { setError('Please paste your CV text.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/ats-score', {
        cv_text: cvText,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            📊 ATS Compliance Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            ATS Resume <span className="gradient-text-indigo">Score &amp; Health</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Scan your resume against automated applicant tracking systems (ATS) and discover high-priority keyword &amp; structure optimizations.
          </p>
        </motion.div>

        {/* Input Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              1. Paste Resume Content *
            </label>
            <textarea
              rows={8}
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Paste your full resume text (Work Experience, Skills, Education, Projects, Contact info)..."
              className="input-luxury !bg-[#030712]/70 resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              2. Target Keywords / Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, React, AWS, Docker, Microservices, System Design"
              className="input-luxury !bg-[#030712]/70"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !cvText.trim()}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiActivity size={18} />
            <span>{loading ? 'Evaluating ATS Scoring Vectors…' : 'Compute ATS Score & Recommendations'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="glass-card-glow p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 flex justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                  <ScoreGauge score={result.score} />
                </div>
                <div className="md:col-span-7 space-y-4">
                  <h2 className="text-xl font-bold font-heading text-white">Dimension Breakdown</h2>
                  {result.categories && Object.entries(result.categories).map(([cat, val]) => (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-300">
                        <span className="capitalize">{cat.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-indigo-400">{val}%</span>
                      </div>
                      <div className="w-full bg-[#030712] h-2 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Card */}
              {result.recommendations?.length > 0 && (
                <div className="glass-card p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <FiAward size={20} />
                    </div>
                    <h2 className="text-lg font-bold font-heading text-white">Actionable ATS Optimization Plan</h2>
                  </div>
                  <div className="grid gap-3 pt-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-200 leading-relaxed">
                        <FiCheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

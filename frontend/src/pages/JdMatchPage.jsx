import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiTarget, FiCheckCircle, FiXCircle, FiArrowRight, FiAlertCircle, FiLayers } from 'react-icons/fi';

export default function JdMatchPage() {
  const [cvText, setCvText] = useState('');
  const [jd, setJd] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMatch = async () => {
    if (!cvText.trim() || !jd.trim()) { setError('Please provide both your CV and the Job Description.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/jd-match', {
        cv_text: cvText,
        job_description: jd,
        candidate_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (pct) => pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400';
  const matchBg = (pct) => pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            🎯 Semantic Job Matching
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Job Description <span className="gradient-text-indigo">Semantic Alignment</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Compare your resume directly against any target job posting to uncover keyword gaps and qualification alignment.
          </p>
        </motion.div>

        {/* Dual Input Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CV Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }} className="glass-card p-6 space-y-4">
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              1. Your Resume / CV Content *
            </label>
            <textarea
              rows={9}
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="input-luxury !bg-[#030712]/70 resize-none font-mono text-xs leading-relaxed"
            />
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Extracted Candidate Skills (optional)</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. Python, React, SQL, AWS, Kubernetes"
                className="input-luxury !bg-[#030712]/70 text-xs"
              />
            </div>
          </motion.div>

          {/* JD Input */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }} className="glass-card p-6 space-y-4">
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              2. Target Job Description *
            </label>
            <textarea
              rows={13}
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the target job posting / requirements here..."
              className="input-luxury !bg-[#030712]/70 resize-none font-mono text-xs leading-relaxed"
            />
          </motion.div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 max-w-xl mx-auto">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Action CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleMatch}
            disabled={loading || !cvText.trim() || !jd.trim()}
            className="btn-luxury-primary !px-10 !py-4 !text-base"
          >
            <FiTarget size={18} />
            <span>{loading ? 'Evaluating Semantic Vectors & Overlap…' : 'Run JD Semantic Match'}</span>
            <FiArrowRight size={18} />
          </button>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Score Showcase */}
              <div className="glass-card-glow p-8 text-center space-y-4">
                <span className="badge-luxury">Vector Match Calculation</span>
                <p className={`text-6xl md:text-7xl font-black font-heading ${matchColor(result.match_percentage)}`}>
                  {result.match_percentage}%
                </p>
                <div className="max-w-md mx-auto h-2.5 bg-[#030712] rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.match_percentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full rounded-full ${matchBg(result.match_percentage)}`}
                  />
                </div>
                <p className="text-slate-400 font-mono text-xs">
                  Keyword Overlap: <span className="text-white font-bold">{result.keyword_overlap_percentage}%</span>
                </p>
              </div>

              {/* Skills Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4 border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
                    <FiCheckCircle size={18} />
                    <h3>Matching Requirements ({result.matching_skills?.length || 0})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matching_skills?.length > 0 ? result.matching_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/15 text-emerald-300 text-xs font-mono font-semibold rounded-lg border border-emerald-500/25">
                        {s}
                      </span>
                    )) : <p className="text-slate-500 text-xs">No direct skill matches detected.</p>}
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4 border-rose-500/20">
                  <div className="flex items-center gap-2 text-rose-400 font-bold font-heading">
                    <FiXCircle size={18} />
                    <h3>Missing Requirements ({result.missing_skills?.length || 0})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills?.length > 0 ? result.missing_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-rose-500/15 text-rose-300 text-xs font-mono font-semibold rounded-lg border border-rose-500/25">
                        {s}
                      </span>
                    )) : <p className="text-slate-400 text-xs">Full skill coverage achieved!</p>}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="glass-card p-8 space-y-3">
                  <h3 className="text-sm font-bold font-heading text-amber-300 flex items-center gap-2">
                    <span>💡</span> JD Alignment Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((sug, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-mono">→</span> {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiTrendingUp, FiCheckCircle, FiXCircle, FiBookOpen, FiArrowRight, FiAlertCircle, FiExternalLink } from 'react-icons/fi';

const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Cloud Architect'];

export default function SkillGapPage() {
  const [role, setRole] = useState('Data Scientist');
  const [candidateSkills, setCandidateSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!candidateSkills.trim()) { setError('Please enter your skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const params = new URLSearchParams({ target_role: role, candidate_skills: candidateSkills });
      const res = await api.get(`/features/skill-gap-recommendations?${params.toString()}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  const completePct = result && result.required_skills?.length > 0 
    ? Math.round((result.acquired_skills.length / result.required_skills.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            📈 Skill Gap Radar
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Target Role <span className="gradient-text-indigo">Readiness &amp; Skill Radar</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Identify exact missing technical proficiencies and unlock direct paths to mastery.
          </p>
        </motion.div>

        {/* Input Configuration Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Target Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-luxury !bg-[#030712]/70 text-sm"
              >
                {ROLES.map(r => <option key={r} className="bg-[#0b0f19] text-slate-200">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Your Current Skills</label>
              <input
                type="text"
                value={candidateSkills}
                onChange={e => setCandidateSkills(e.target.value)}
                placeholder="e.g. Python, SQL, Git, Pandas, Docker"
                className="input-luxury !bg-[#030712]/70 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !candidateSkills.trim()}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiTrendingUp size={18} />
            <span>{loading ? 'Evaluating Skill Graph & Gaps…' : 'Analyze Skill Gap & Recommendations'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Results Panel */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Readiness Card */}
            <div className="glass-card-glow p-8 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-heading text-white">Target Role Readiness</h3>
                <span className={`text-3xl font-black font-heading ${
                  completePct >= 80 ? 'text-emerald-400' : completePct >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {completePct}%
                </span>
              </div>
              <div className="h-2.5 bg-[#030712] rounded-full overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completePct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    completePct >= 80
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : completePct >= 50
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                />
              </div>
              <p className="text-slate-400 font-mono text-xs pt-1">
                {result.acquired_skills?.length} of {result.required_skills?.length} key industry proficiencies detected for {result.target_role}.
              </p>
            </div>

            {/* Skills Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 space-y-4 border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
                  <FiCheckCircle size={18} />
                  <h3>Acquired Skills ({result.acquired_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.acquired_skills?.length > 0 ? result.acquired_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500/15 text-emerald-300 text-xs font-mono font-semibold rounded-lg border border-emerald-500/25">
                      {s}
                    </span>
                  )) : <p className="text-slate-500 text-xs">No direct matches found.</p>}
                </div>
              </div>

              <div className="glass-card p-6 space-y-4 border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-heading">
                  <FiXCircle size={18} />
                  <h3>Skills to Acquire ({result.missing_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills?.length > 0 ? result.missing_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-500/15 text-rose-300 text-xs font-mono font-semibold rounded-lg border border-rose-500/25">
                      {s}
                    </span>
                  )) : <p className="text-emerald-400 text-xs font-mono font-bold">🎉 Complete Skill Mastery Achieved!</p>}
                </div>
              </div>
            </div>

            {/* Curated Resources */}
            {result.recommendations?.length > 0 && (
              <div className="glass-card p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FiBookOpen size={16} />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">Curated Learning Pathways</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {result.recommendations.map((rec, i) => (
                    <motion.a
                      key={i}
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-[#030712]/50 border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate block">
                          {rec.skill}
                        </span>
                        <p className="text-xs text-slate-400 font-mono">{rec.provider}</p>
                      </div>
                      <FiExternalLink size={16} className="text-slate-500 group-hover:text-indigo-400 shrink-0 mt-1 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

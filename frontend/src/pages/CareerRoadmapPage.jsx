import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiMap, FiCheckCircle, FiBookOpen, FiArrowRight, FiAlertCircle, FiClock } from 'react-icons/fi';

const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Cloud Architect', 'Product Manager'];
const EXP_LEVELS = [
  { id: 'fresher', label: 'Fresher / Entry' },
  { id: 'experienced', label: 'Mid-Level (2–5 yrs)' },
  { id: 'highly_experienced', label: 'Senior / Staff (5+ yrs)' }
];

export default function CareerRoadmapPage() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('Data Scientist');
  const [expLevel, setExpLevel] = useState('fresher');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!skills.trim()) { setError('Please enter your current skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/roadmap', {
        current_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        desired_role: role,
        experience_level: expLevel,
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
            🗺️ Career Navigation AI
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Personalized <span className="gradient-text-indigo">Career Path Roadmap</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Bridge your skill gap systematically to reach target senior roles with verified industry timelines and milestones.
          </p>
        </motion.div>

        {/* Input Configuration Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Target Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-luxury !bg-[#030712]/70 text-sm"
              >
                {ROLES.map(r => <option key={r} value={r} className="bg-[#0b0f19] text-slate-200">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Experience Tier</label>
              <select
                value={expLevel}
                onChange={e => setExpLevel(e.target.value)}
                className="input-luxury !bg-[#030712]/70 text-sm"
              >
                {EXP_LEVELS.map(e => <option key={e.id} value={e.id} className="bg-[#0b0f19] text-slate-200">{e.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Current Skills &amp; Stack (comma-separated) *
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, Pandas, SQL, Git, React, Docker"
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
            onClick={handleGenerate}
            disabled={loading || !skills.trim()}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiMap size={18} />
            <span>{loading ? 'Synthesizing Step-by-Step Milestones…' : 'Generate Interactive Career Roadmap'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Roadmap Visualization */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Timeline Header Badge */}
              <div className="text-center">
                <span className="badge-luxury !py-2 !px-6 !text-sm">
                  <FiClock size={16} className="text-cyan-400" />
                  <span>Target Runway: {result.estimated_timeline}</span>
                </span>
              </div>

              {/* Steps Vertical Timeline */}
              <div className="relative pl-4 sm:pl-8">
                <div className="absolute left-9 sm:left-13 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-400 to-transparent" />

                <div className="space-y-6">
                  {result.roadmap?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                      className="relative flex items-start gap-4 sm:gap-6"
                    >
                      {/* Step Number Circle */}
                      <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-mono font-black z-10 border shadow-lg ${
                        step.completed
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'
                          : 'bg-[#0b0f19] border-white/20 text-indigo-300'
                      }`}>
                        {step.completed ? '✓' : `0${step.step}`}
                      </div>

                      {/* Card Details */}
                      <div className={`flex-1 glass-card p-6 space-y-3 ${
                        step.completed ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : ''
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold font-heading text-white">{step.title}</h3>
                          {step.completed && (
                            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                              Acquired ✓
                            </span>
                          )}
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {step.required_skills?.map((sk, j) => {
                            const acquired = step.acquired_skills?.includes(sk);
                            return (
                              <span key={j} className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                                acquired
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : 'bg-white/5 text-slate-400 border-white/5'
                              }`}>
                                {acquired ? '✓ ' : ''}{sk}
                              </span>
                            );
                          })}
                        </div>

                        {/* Learning Resource */}
                        <div className="flex items-center gap-2 text-xs text-cyan-300 pt-1 font-mono">
                          <FiBookOpen size={14} className="shrink-0" />
                          <span>Curated Path: {step.learning_resource}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

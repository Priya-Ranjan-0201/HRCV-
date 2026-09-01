import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiDollarSign, FiMapPin, FiBriefcase, FiArrowRight, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Cloud Architect'];
const LOCATIONS = ['Bangalore', 'San Francisco', 'New York', 'London', 'Remote', 'Mumbai', 'Hyderabad', 'Singapore', 'Berlin'];

export default function SalaryPredictPage() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Bangalore');
  const [expYears, setExpYears] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!skills.trim()) { setError('Please enter at least a few skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/salary-predict', {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        role,
        location,
        experience_years: parseInt(expYears, 10),
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
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            💰 Compensation Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Market Compensation &amp; <span className="gradient-text-indigo">Salary Predictor</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Benchmark your market valuation accurately based on tech stack specialization, location cost-of-living, and years of experience.
          </p>
        </motion.div>

        {/* Input Card */}
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
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Location / Hub</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="input-luxury !bg-[#030712]/70 text-sm"
              >
                {LOCATIONS.map(l => <option key={l} className="bg-[#0b0f19] text-slate-200">{l}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-300">
              <span className="uppercase tracking-wider font-semibold">Experience Level:</span>
              <span className="text-indigo-400 font-bold">{expYears} Years</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={expYears}
              onChange={e => setExpYears(e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-[#030712] rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Fresher (0 yr)</span>
              <span>Mid (5 yrs)</span>
              <span>Staff / Principal (15+ yrs)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Key Skills &amp; Specialties (comma-separated) *
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, PyTorch, Kubernetes, React, System Design, Distributed Systems"
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
            onClick={handlePredict}
            disabled={loading || !skills.trim()}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiDollarSign size={18} />
            <span>{loading ? 'Computing Market Compensation Distribution…' : 'Predict Market Salary Range'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Prediction Results Card */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass-card-glow p-8 md:p-10 text-center space-y-5">
                <span className="badge-luxury">Estimated Market Compensation</span>
                
                <p className="text-5xl md:text-6xl font-black font-heading gradient-text-indigo py-2">
                  {result.predicted_range}
                </p>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Base + Equity Annualized</p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-[#030712]/70 border border-white/10 text-xs font-mono">
                  <span className="text-slate-400">Market Median:</span>
                  <span className="text-white font-bold">{result.average_market_median}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    result.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {result.confidence} Confidence
                  </span>
                </div>

                <p className="text-slate-500 text-[11px] max-w-md mx-auto pt-2">
                  * Benchmarked from live industry compensation disclosures across Tier-1 tech hubs.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

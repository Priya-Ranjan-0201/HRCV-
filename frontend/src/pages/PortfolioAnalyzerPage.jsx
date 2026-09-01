import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiGlobe, FiGithub, FiLinkedin, FiCode, FiAward, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export default function PortfolioAnalyzerPage() {
  const [form, setForm] = useState({ github_url: '', linkedin_url: '', leetcode_user: '', codeforces_user: '', hackerrank_user: '' });
  const [githubResult, setGithubResult] = useState(null);
  const [portfolioResult, setPortfolioResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAnalyze = async () => {
    if (!form.github_url && !form.leetcode_user && !form.linkedin_url) {
      setError('Please provide at least a GitHub URL or LeetCode username.');
      return;
    }
    setError('');
    setLoading(true);
    setGithubResult(null);
    setPortfolioResult(null);

    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }

      const [githubRes, portfolioRes] = await Promise.all([
        form.github_url
          ? api.post('/features/github-stats', { github_url: form.github_url })
          : Promise.resolve(null),
        api.post('/features/portfolio-analyze', form),
      ]);

      if (githubRes) setGithubResult(githubRes.data);
      if (portfolioRes) setPortfolioResult(portfolioRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'github_url', label: 'GitHub Profile URL', placeholder: 'https://github.com/username', icon: <FiGithub size={16} /> },
    { key: 'linkedin_url', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/username', icon: <FiLinkedin size={16} /> },
    { key: 'leetcode_user', label: 'LeetCode Handle', placeholder: 'leetcode_username', icon: <FiCode size={16} /> },
    { key: 'codeforces_user', label: 'Codeforces Handle', placeholder: 'cf_handle', icon: <FiAward size={16} /> },
  ];

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            🌐 Developer Portfolio Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Engineering Presence &amp; <span className="gradient-text-indigo">Portfolio Radar</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Connect your public code footprints and competitive programming profiles for a composite developer score.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {fields.map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  <span className="text-indigo-400">{f.icon}</span> {f.label}
                </label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="input-luxury !bg-[#030712]/70 text-sm"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiGlobe size={18} />
            <span>{loading ? 'Evaluating Developer Footprints & Repos…' : 'Synthesize Developer Portfolio Score'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {githubResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* GitHub Card */}
              <div className="glass-card-glow p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FiGithub size={24} className="text-white" />
                    <div>
                      <h3 className="text-xl font-bold font-heading text-white">GitHub Intelligence — @{githubResult.username}</h3>
                      <p className="text-xs font-mono text-slate-400">Open-source &amp; repository contribution metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-3xl font-black font-heading gradient-text-indigo">{githubResult.developer_score}</span>
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">/100 Index</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Public Repositories', value: githubResult.total_repositories },
                    { label: 'Estimated Commits', value: githubResult.total_commits },
                    { label: 'Pull Requests', value: githubResult.pull_requests_count },
                    { label: 'Issues Resolved', value: githubResult.issues_resolved },
                    { label: 'Stars Earned', value: githubResult.stars_received },
                    { label: 'Forks Created', value: githubResult.forks_created },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 rounded-2xl bg-[#030712]/60 border border-white/10 text-center space-y-1">
                      <p className="text-2xl font-black font-heading text-white">{value}</p>
                      <p className="text-[11px] font-mono text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                {githubResult.languages_distribution && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Repository Language Mix</p>
                    {Object.entries(githubResult.languages_distribution).map(([lang, pct]) => (
                      <div key={lang} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                          <span>{lang}</span>
                          <span className="text-indigo-400 font-bold">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#030712] rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {portfolioResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-5">
              <div className="glass-card p-6 space-y-3 border-emerald-500/20">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">💪 Key Strengths</h4>
                <ul className="space-y-2">
                  {portfolioResult.strengths?.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 space-y-3 border-rose-500/20">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">⚠️ Growth Areas</h4>
                <ul className="space-y-2">
                  {portfolioResult.weaknesses?.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">!</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 space-y-3 border-indigo-500/20">
                <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">🎯 Recommendations</h4>
                <ul className="space-y-2">
                  {portfolioResult.recommendations?.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { FiFolder, FiGitCommit, FiArrowRight, FiCheckCircle, FiXCircle, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('hrcv_user') || localStorage.getItem('tonycv_user'));
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkillList({ title, items, tone }) {
  const isGood = tone === 'good';
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {isGood ? <FiCheckCircle size={16} className="text-emerald-400" /> : <FiXCircle size={16} className="text-rose-400" />}
        <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
          {title} ({items?.length || 0})
        </h4>
      </div>
      {items?.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <span key={item} className={`text-xs font-mono font-semibold px-3 py-1 rounded-lg border ${
              isGood ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' : 'bg-rose-500/15 text-rose-300 border-rose-500/25'
            }`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-mono">No variance detected.</p>
      )}
    </div>
  );
}

export default function ResumeHistoryPage() {
  const user = getCurrentUser();
  const [versions, setVersions] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    ensureBackendReady()
      .then(isReady => {
        if (!isReady) throw new Error('Backend not ready');
        return api.get(`/resume-history/${user.id}`);
      })
      .then(res => {
        const items = res.data?.versions || [];
        setVersions(items);
        if (items[1]) setBaseId(String(items[1].id));
        if (items[0]) setTargetId(String(items[0].id));
      })
      .catch(() => setError('Could not load version history. Server may be initializing.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const compareVersions = async () => {
    if (!baseId || !targetId || baseId === targetId) {
      setError('Select two distinct resume versions to compare.');
      return;
    }

    setError('');
    setComparison(null);
    setLoading(true);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/resume-history/compare', {
        user_id: user.id,
        base_version_id: Number(baseId),
        target_version_id: Number(targetId),
      });
      setComparison(res.data);
    } catch {
      setError('Could not compute version delta.');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-md mx-auto glass-card p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
            <FiFolder size={24} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">Resume Version History</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Please sign in to track resume revisions, delta diffs, and score trajectory over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            📁 Version Control &amp; Diff Tracker
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Resume Version <span className="gradient-text-indigo">History &amp; Delta</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Compare past resume submissions side-by-side to track ATS score evolution, added keywords, and metric impact.
          </p>
        </motion.div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 max-w-xl mx-auto">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Saved Versions list */}
          <div className="lg:col-span-4 glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-heading text-lg">
              <FiFolder size={20} className="text-indigo-400" />
              <h2>Revision Logs</h2>
            </div>

            {loading && !versions.length ? (
              <p className="text-xs text-slate-500 font-mono py-4">Fetching revisions…</p>
            ) : versions.length ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                {versions.map(version => (
                  <div key={version.id} className="p-4 rounded-2xl bg-[#030712]/60 border border-white/5 space-y-2 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-slate-200 truncate">{version.resume_name}</p>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {Math.round(version.ats_score || 0)} ATS
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">{formatDate(version.created_at)}</p>
                    <p className="text-xs text-slate-400 truncate">{version.skills?.slice(0, 4).join(', ') || 'No skills captured'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed py-4">
                No saved revisions yet. Run an analysis to snapshot your first version.
              </p>
            )}
          </div>

          {/* Right: Compare console */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-lg font-bold font-heading text-white">Compare Revision Diffs</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Base Version (Older)</label>
                  <select
                    value={baseId}
                    onChange={e => setBaseId(e.target.value)}
                    className="input-luxury !bg-[#030712]/70 text-xs"
                  >
                    <option value="" className="bg-[#0b0f19]">Select older revision</option>
                    {versions.map(v => (
                      <option key={v.id} value={v.id} className="bg-[#0b0f19] text-slate-200">
                        {v.resume_name} ({formatDate(v.created_at)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Target Version (Newer)</label>
                  <select
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    className="input-luxury !bg-[#030712]/70 text-xs"
                  >
                    <option value="" className="bg-[#0b0f19]">Select newer revision</option>
                    {versions.map(v => (
                      <option key={v.id} value={v.id} className="bg-[#0b0f19] text-slate-200">
                        {v.resume_name} ({formatDate(v.created_at)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={compareVersions}
                disabled={loading || versions.length < 2}
                className="btn-luxury-primary !py-3 !px-6 !text-xs !rounded-xl"
              >
                <FiGitCommit size={15} />
                <span>Compute Version Diff</span>
              </button>
            </div>

            {/* Comparison Output */}
            {comparison && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card-glow p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Base ATS</span>
                      <p className="text-3xl font-black font-heading text-slate-300">
                        {Math.round(comparison.base_version?.ats_score || 0)}
                      </p>
                    </div>
                    <div className="space-y-1 border-x border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Score Delta</span>
                      <p className={`text-3xl font-black font-heading ${
                        comparison.score_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {comparison.score_delta > 0 ? `+${comparison.score_delta}` : comparison.score_delta}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Target ATS</span>
                      <p className="text-3xl font-black font-heading text-indigo-400">
                        {Math.round(comparison.target_version?.ats_score || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#030712]/60 border border-white/5 text-xs text-slate-300 leading-relaxed font-mono">
                    {comparison.summary}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 glass-card p-6">
                  <SkillList title="Added Keywords" items={comparison.added_skills} tone="good" />
                  <SkillList title="Removed Keywords" items={comparison.removed_skills} tone="bad" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

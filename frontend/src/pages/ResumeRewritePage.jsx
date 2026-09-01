import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiEdit3, FiCheckCircle, FiCopy, FiZap, FiAlertCircle } from 'react-icons/fi';

const SECTIONS = ['Summary', 'Experience', 'Projects', 'Skills', 'Achievements'];

export default function ResumeRewriteAssistant() {
  const [section, setSection] = useState('Summary');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleRewrite = async () => {
    if (!content.trim()) { setError('Please enter content to rewrite.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/rewrite', { section: section.toLowerCase(), content });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            ✨ Executive AI Rewrite Studio
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Transform Bullet Points into <span className="gradient-text-indigo">Quantifiable Impact</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Upgrade raw job descriptions and summaries into high-impact, ATS-optimized executive statements.
          </p>
        </motion.div>

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                section === s
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Original {section} Content *
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Paste your raw ${section.toLowerCase()} draft or bullet points here...`}
              className="input-luxury !bg-[#030712]/70 resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={loading || !content.trim()}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiZap size={18} />
            <span>{loading ? 'Synthesizing High-Impact Revisions…' : 'Generate AI-Enhanced Variations'}</span>
          </button>
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-card-glow p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FiCheckCircle size={18} />
                  </div>
                  <h2 className="text-xl font-bold font-heading text-white">AI-Enhanced Executive Variations</h2>
                </div>

                <div className="grid gap-3 pt-2">
                  {result.suggestions?.map((s, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#030712]/60 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <p className="text-sm text-slate-100 leading-relaxed font-sans">{s}</p>
                      <button
                        onClick={() => handleCopy(s, i)}
                        className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-indigo-300 transition-all"
                      >
                        <FiCopy size={13} />
                        <span>{copiedIndex === i ? 'Copied ✓' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Panel */}
              {result.tips?.length > 0 && (
                <div className="glass-card p-8 space-y-3">
                  <h3 className="text-sm font-bold font-heading text-amber-300 flex items-center gap-2">
                    <span>💡</span> Executive Framing Rules for {section}
                  </h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-mono">→</span> {tip}
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

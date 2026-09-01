import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';
import { FiMic, FiCheckCircle, FiArrowRight, FiAlertCircle, FiActivity, FiAward, FiMessageSquare } from 'react-icons/fi';

const STAGES = ['technical', 'hr', 'behavioral'];
const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Cloud Engineer'];

export default function InterviewSimulatorPage() {
  const [role, setRole] = useState('Software Engineer');
  const [stage, setStage] = useState('technical');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchQuestion = async () => {
    setLoadingQ(true);
    setEvaluation(null);
    setAnswer('');
    setError('');
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/interview/question', { role, stage, previous_answers: history });
      setQuestion(res.data.question);
      setSessionActive(true);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoadingQ(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { setError('Please type or dictate your response.'); return; }
    setLoadingE(true);
    setError('');
    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('HRCV server is initializing. Please try again in a few moments.');
        return;
      }
      const res = await api.post('/features/interview/evaluate', { question, answer, role, stage });
      const data = res.data;
      setEvaluation(data);
      setHistory(prev => [...prev, { question, answer, score: data.confidence_score }]);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoadingE(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'text-emerald-400' : s >= 65 ? 'text-amber-400' : 'text-rose-400';
  const scoreBar = (s) => s >= 80 ? 'from-emerald-500 to-teal-400' : s >= 65 ? 'from-amber-500 to-yellow-400' : 'from-rose-500 to-red-400';

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <span className="badge-luxury">
            🎤 Executive AI Interviewer
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
            Simulate High-Stakes <span className="gradient-text-indigo">FAANG Interviews</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Practice real technical, system design, and behavioral questions with instant AI scoring on clarity, relevance, and impact.
          </p>
        </motion.div>

        {/* Setup Configuration */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} className="glass-card p-8 space-y-6">
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
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">Round Type</label>
              <div className="flex gap-2 p-1 bg-[#030712]/60 rounded-xl border border-white/10">
                {STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold capitalize transition-all ${
                      stage === s
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={fetchQuestion}
            disabled={loadingQ}
            className="btn-luxury-primary w-full !py-4 !text-base"
          >
            <FiMic size={18} />
            <span>{loadingQ ? 'Synthesizing Industry Interview Question…' : sessionActive ? 'Generate Next Question' : 'Launch Interview Simulator'}</span>
            <FiArrowRight size={18} />
          </button>
        </motion.div>

        {/* Question + Answer Panel */}
        <AnimatePresence>
          {question && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Question Card */}
              <div className="glass-card-glow p-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FiMessageSquare size={16} />
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                    {stage} Interviewer Prompt
                  </span>
                </div>
                <p className="text-lg md:text-xl font-heading font-bold text-white leading-relaxed pt-1">
                  "{question}"
                </p>
              </div>

              {/* Answer Input */}
              {!evaluation && (
                <div className="glass-card p-8 space-y-4">
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    Your Response *
                  </label>
                  <textarea
                    rows={7}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Structure your answer clearly (STAR method for behavioral, architectural breakdown for technical)..."
                    className="input-luxury !bg-[#030712]/70 resize-none font-mono text-xs leading-relaxed"
                  />
                  {error && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={submitAnswer}
                      disabled={loadingE || !answer.trim()}
                      className="btn-luxury-primary !px-8 !py-3"
                    >
                      <FiActivity size={16} />
                      <span>{loadingE ? 'Evaluating Response Metrics…' : 'Submit for AI Evaluation'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* AI Evaluation */}
              {evaluation && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card-glow p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-heading text-white">AI Candidate Evaluation</h3>
                    <span className={`text-xs font-mono font-bold px-3.5 py-1 rounded-full border ${
                      evaluation.hiring_recommendation === 'Strong Hire'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {evaluation.hiring_recommendation}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Confidence Score', value: evaluation.confidence_score },
                      { label: 'Domain Relevance', value: evaluation.relevance_score },
                      { label: 'Clarity & Delivery', value: evaluation.grammar_score },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-4 rounded-2xl bg-[#030712]/60 border border-white/10 text-center space-y-2">
                        <p className={`text-3xl font-black font-heading ${scoreColor(value)}`}>{value}%</p>
                        <p className="text-slate-400 text-xs font-mono">{label}</p>
                        <div className="h-1.5 bg-[#030712] rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full bg-gradient-to-r ${scoreBar(value)} rounded-full`} style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                    <p className="text-indigo-300 text-xs font-mono font-bold">DELIVERY &amp; CONTENT REFINEMENT</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{evaluation.speaking_improvement}</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={fetchQuestion}
                      className="btn-luxury-secondary !py-2.5 !px-6 !text-xs"
                    >
                      Next Practice Question →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Stream */}
        {history.length > 0 && (
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              Session Progress ({history.length} Questions Completed)
            </h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#030712]/50 border border-white/5 flex items-center justify-between gap-4">
                  <p className="text-slate-300 text-xs font-sans truncate flex-1">{h.question}</p>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 ${scoreColor(h.score)}`}>
                    {h.score.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

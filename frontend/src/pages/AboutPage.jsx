import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu, FiArrowRight, FiUsers, FiStar, FiZap,
  FiShield, FiGlobe, FiTarget, FiTrendingUp, FiHeart
} from 'react-icons/fi';

const STATS = [
  { num: '2.4M+', label: 'Resumes Analyzed' },
  { num: '94.3%', label: 'Model Prediction Precision' },
  { num: '12+', label: 'Scoring Dimensions' },
  { num: '150+', label: 'Countries Supported' },
];

const TEAM = [
  { name: 'Marcus Rivera', role: 'Founder & Head of Product', initials: 'MR', color: '#6366f1', bio: 'Ex-Google recruiter with 10+ years in talent acquisition. Built HRCV to empower job seekers with true AI parity.' },
  { name: 'Dr. Priya Sharma', role: 'Head of AI Research', initials: 'PS', color: '#a855f7', bio: 'PhD in NLP. Leads our multi-tier ensemble Random Forest and BERT vector semantic pipeline.' },
  { name: 'David Vance', role: 'Lead Infrastructure Architect', initials: 'DV', color: '#10b981', bio: 'Specializing in low-latency FastAPI inference engines and high-concurrency cloud systems.' },
  { name: 'Aisha Thompson', role: 'Executive Career Advisor', initials: 'AT', color: '#f59e0b', bio: 'Coached 500+ engineering managers and executives into Staff and Director roles across FAANG.' },
];

const VALUES = [
  { icon: <FiTarget size={24} className="text-indigo-400" />, title: 'Results-Driven Precision', desc: 'Every model architecture is benchmarked against real-world hiring outcomes and callback conversion.' },
  { icon: <FiShield size={24} className="text-emerald-400" />, title: 'Zero Data Resale', desc: 'Your resume data is strictly confidential, encrypted with cryptographic JWT tokens, and never sold.' },
  { icon: <FiZap size={24} className="text-amber-400" />, title: 'Democratized Intelligence', desc: 'Enterprise-grade ATS telemetry shouldn\'t be exclusive to HR software vendors. Everyone deserves access.' },
  { icon: <FiHeart size={24} className="text-rose-400" />, title: 'Executive Polish', desc: 'We combine neural computation with human empathy to elevate every candidate to their highest tier.' },
];

const TIMELINE = [
  { year: '2022', event: 'HRCV founded to bridge the information asymmetry between enterprise ATS and candidates.' },
  { year: '2023', event: 'Deployed BERT-based semantic sentence vector matcher with 100k active users.' },
  { year: '2024', event: 'Introduced live vector PDF compilation and multi-tier company requirement maps.' },
  { year: '2025', event: 'Integrated AI interview simulator with real-time biometric and vocal telemetry.' },
  { year: '2026', event: 'Launched ML Engine v3.0: 94.3% precision, 25,000 multi-tier profile training set.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="badge-luxury">About HRCV Platform</span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
            Leveling the <span className="gradient-text-indigo">Hiring Arena</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Millions of brilliant engineers and leaders get filtered by black-box ATS algorithms before a human ever reads their resume. HRCV equips job seekers with executive-tier AI intelligence to guarantee fair evaluation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black font-heading gradient-text-indigo mb-1">{s.num}</div>
              <div className="text-slate-400 text-xs font-mono font-bold uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="badge-luxury">Core Philosophy</span>
            <h2 className="text-3xl font-black font-heading text-white">What Powers Our Platform</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="glass-card p-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-heading text-white">{v.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="badge-luxury">Engineering Milestones</span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">Our Journey</h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold shrink-0 border border-indigo-500/30">
                  {t.year}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{t.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="badge-luxury">Leadership</span>
            <h2 className="text-3xl font-black font-heading text-white">The Minds Behind HRCV</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="glass-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold font-heading text-base" style={{ backgroundColor: m.color }}>
                    {m.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-heading text-white">{m.name}</h4>
                    <p className="text-xs text-indigo-400 font-mono">{m.role}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-card-glow p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">Ready to Experience the AI Advantage?</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Analyze your resume in seconds with our 94.3% precision neural engine.</p>
          <button onClick={() => navigate('/analyze')} className="btn-luxury-primary !py-4 !px-8 !text-base">
            <span>Launch Resume Scanner</span>
            <FiArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText, FiArrowRight, FiEdit3, FiCheck, FiMessageSquare,
  FiDownload, FiZap, FiCopy, FiTarget, FiAward, FiShield
} from 'react-icons/fi';

const LETTER_TYPES = [
  { title: 'Executive Application', desc: 'Direct outreach for Senior, Staff, and Director-level roles.', icon: '🎯' },
  { title: 'Strategic Referral', desc: 'Framed around internal sponsor introductions & team synergy.', icon: '🤝' },
  { title: 'Cold Value Proposition', desc: 'Pitching high-ROI initiatives to hiring managers before roles open.', icon: '⚡' },
  { title: 'Technical Pivot', desc: 'Articulating cross-domain leverage and engineering versatility.', icon: '🔄' },
];

const TIPS = [
  { num: '01', title: 'Target Decision Makers', tip: 'Address specific hiring managers or VP leads. Targeted letters convert at 3.4x generic submissions.' },
  { num: '02', title: 'Lead with Metric Impact', tip: 'Open with your signature technical or financial achievement — never generic pleasantries.' },
  { num: '03', title: 'Mirror Strategic Priorities', tip: 'Reference the company\'s scaling challenges, tech migrations, or product initiatives.' },
  { num: '04', title: 'Keep to Three Concise Blocks', tip: 'Hook, Quantifiable Evidence, Call to Action. Respect executive reader bandwidth.' },
];

const TEMPLATE_SAMPLE = `Dear [Hiring Manager / VP of Engineering],

I am writing to express my strong interest in the [Target Role] position at [Target Company]. Having closely followed your recent work in [specific company initiative or tech stack], I believe my background in architecting [key technical domain or business capability] directly aligns with your team's mission.

In my current role as [Current Title] at [Current Company], I led the design and implementation of [core system/initiative], which delivered:
• [Quantifiable Metric #1: e.g., 40% reduction in query latency across 20M daily requests]
• [Quantifiable Metric #2: e.g., $1.4M annual cloud cost savings via automated orchestration]
• [Quantifiable Metric #3: e.g., Scaled team delivery velocity by 2.5x through CI/CD standardization]

[Target Company]'s focus on [specific technical principle or business objective] is what drew me to this role. I would welcome the opportunity to discuss how my experience can accelerate your roadmap.

Best regards,

[Your Full Name]
[LinkedIn Profile | Portfolio URL]`;

export default function CoverLetterPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TEMPLATE_SAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="badge-luxury">
            <FiMessageSquare size={14} className="text-indigo-400" />
            <span>Executive Outreach Studio</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
            High-Impact <span className="gradient-text-indigo">Cover Letters</span>
          </h1>
          <p className="text-slate-400 text-base">
            Craft compelling executive letters that establish authority, highlight quantifiable ROI, and capture recruiter attention.
          </p>
        </div>

        {/* Letter Archetypes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LETTER_TYPES.map((lt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 flex flex-col justify-between space-y-4 group hover:border-indigo-500/50"
            >
              <div className="space-y-2">
                <span className="text-3xl">{lt.icon}</span>
                <h3 className="text-base font-bold font-heading text-white group-hover:text-indigo-300 transition-colors">
                  {lt.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lt.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Studio Frame */}
        <div className="glass-card p-8 md:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Executive Value Proposition Template</h2>
              <p className="text-xs text-slate-400 mt-0.5">Engineered for senior engineering and leadership candidacies</p>
            </div>

            <button
              onClick={handleCopy}
              className="btn-luxury-primary !py-2.5 !px-5 !text-xs shrink-0"
            >
              {copied ? <><FiCheck size={14} /> Copied to Clipboard</> : <><FiCopy size={14} /> Copy Template</>}
            </button>
          </div>

          <pre className="p-6 rounded-2xl bg-[#030712] border border-white/10 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {TEMPLATE_SAMPLE}
          </pre>
        </div>

        {/* Strategy Framework */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="badge-luxury">Strategic Execution</span>
            <h2 className="text-2xl font-black font-heading text-white">Best Practices</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIPS.map((t, i) => (
              <div key={i} className="glass-card p-6 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">{t.num}</span>
                <h4 className="text-sm font-bold font-heading text-white">{t.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

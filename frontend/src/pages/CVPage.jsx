import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiFileText, FiArrowRight, FiCheck, FiEye,
  FiEdit3, FiGlobe, FiAward, FiUser, FiBriefcase, FiBookOpen,
  FiCode, FiBarChart2, FiBook, FiActivity, FiSettings, FiLayers,
  FiStar,
} from 'react-icons/fi';
import TemplateGalleryModal from '../components/TemplateGalleryModal';
import CVExamplePreview from '../components/CVExamplePreview';

const CV_VS_RESUME = [
  { aspect: 'Format Length', cv: '2+ pages (comprehensive track record)', resume: '1 page (targeted impact summary)' },
  { aspect: 'Target Domain', cv: 'Academic, research, clinical, global tech', resume: 'US/EU enterprise & corporate roles' },
  { aspect: 'Key Focus', cv: 'Publications, grants, architecture papers', resume: 'Direct metrics, business impact, stack' },
  { aspect: 'Geographic Standard', cv: 'UK, EMEA, APAC, Research Institutes', resume: 'North America, Silicon Valley tech' },
];

const CV_CATEGORIES = ['All', 'Tech & AI', 'Academic', 'Healthcare', 'Executive', 'Creative'];

const CV_EXAMPLES = [
  {
    id: 'software-engineer',
    title: 'Software Engineer CV',
    description: 'Designed for backend, full-stack, and distributed systems engineers targeting Tier-1 tech.',
    level: 'Mid to Principal',
    category: 'Tech & AI',
    color: '#6366f1',
    icon: <FiCode size={22} className="text-indigo-400" />,
    tags: ['Tech & AI', 'Distributed Systems', 'Go / Python'],
    features: [
      'Technical architecture highlights',
      'Quantifiable scale metrics (QPS, latency)',
      'Open source repositories & patents',
      'Production cluster accomplishments',
    ],
    popular: true,
  },
  {
    id: 'data-scientist',
    title: 'Machine Learning & Data CV',
    description: 'Highlights neural architectures, statistical pipelines, and commercial model deployments.',
    level: 'Staff / Research',
    category: 'Tech & AI',
    color: '#a855f7',
    icon: <FiBarChart2 size={22} className="text-purple-400" />,
    tags: ['Tech & AI', 'LLMs / NLP', 'PyTorch / CUDA'],
    features: [
      'Model evaluation & training metrics',
      'ArXiv publications & conference posters',
      'High-throughput vector data pipelines',
      'Compute optimization & distributed training',
    ],
    popular: true,
  },
  {
    id: 'research-cv',
    title: 'Academic Research CV',
    description: 'Structured for PhD candidates, postdocs, and university faculty positions.',
    level: 'Academic',
    category: 'Academic',
    color: '#06b6d4',
    icon: <FiBook size={22} className="text-cyan-400" />,
    tags: ['Academic', 'PhD', 'Peer Review', 'Grants'],
    features: [
      'Full peer-reviewed publications list',
      'Grant funding & research budgets',
      'Teaching fellowships & mentorship',
      'Academic conference keynote logs',
    ],
    popular: false,
  },
  {
    id: 'business-executive',
    title: 'Executive Leadership CV',
    description: 'Engineered for VPs, Engineering Directors, and Chief Technology Officers.',
    level: 'Executive',
    category: 'Executive',
    color: '#f59e0b',
    icon: <FiLayers size={22} className="text-amber-400" />,
    tags: ['Executive', 'P&L Management', 'Org Scaling'],
    features: [
      'P&L ownership & multimillion budget',
      'Org scaling (10 to 200+ engineers)',
      'Strategic M&A and vendor negotiation',
      'Executive board reporting metrics',
    ],
    popular: true,
  },
  {
    id: 'creative-designer',
    title: 'Product Design & UI CV',
    description: 'Balancing aesthetic polish with design system architecture and UX metrics.',
    level: 'Senior',
    category: 'Creative',
    color: '#f43f5e',
    icon: <FiActivity size={22} className="text-rose-400" />,
    tags: ['Creative', 'Design Systems', 'UX Research'],
    features: [
      'Design token system architecture',
      'Conversion & retention UX case studies',
      'Figma component library metrics',
      'User research methodology evidence',
    ],
    popular: false,
  },
  {
    id: 'healthcare',
    title: 'Clinical & Healthcare CV',
    description: 'Formatted for medical directors, surgeons, and healthcare clinical leads.',
    level: 'Clinical Lead',
    category: 'Healthcare',
    color: '#10b981',
    icon: <FiAward size={22} className="text-emerald-400" />,
    tags: ['Healthcare', 'Clinical', 'GMC Registered'],
    features: [
      'Medical board certifications & licenses',
      'Clinical rotation leadership',
      'Hospital department administration',
      'Clinical trial research protocols',
    ],
    popular: false,
  },
];

export default function CVPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewCV, setPreviewCV] = useState(null);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return CV_EXAMPLES;
    return CV_EXAMPLES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="badge-luxury">
            <FiFileText size={14} className="text-indigo-400" />
            <span>Curated Formats</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
            Enterprise <span className="gradient-text-indigo">Curriculum Vitae</span> Gallery
          </h1>
          <p className="text-slate-400 text-base">
            Battle-tested CV architectures tailored for engineering, ML research, leadership, and academia.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">CV vs. Resume: Key Differences</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 pr-4 font-bold uppercase">Dimension</th>
                  <th className="pb-3 pr-4 font-bold uppercase text-indigo-400">Curriculum Vitae (CV)</th>
                  <th className="pb-3 font-bold uppercase text-cyan-400">Standard Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {CV_VS_RESUME.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-bold text-white">{row.aspect}</td>
                    <td className="py-3 pr-4 text-slate-300">{row.cv}</td>
                    <td className="py-3 text-slate-300">{row.resume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CV_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ex => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 flex flex-col justify-between space-y-6 hover:border-indigo-500/50"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {ex.icon}
                  </div>
                  {ex.popular && (
                    <span className="badge-luxury !bg-amber-500/15 !border-amber-500/30 !text-amber-300">
                      ★ High Demand
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading text-white">{ex.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ex.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Architecture Highlights:</span>
                  {ex.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-slate-300">
                      <FiCheck size={14} className="text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setPreviewCV(ex)}
                  className="btn-luxury-secondary !py-2.5 !px-4 !text-xs flex-1"
                >
                  <FiEye size={14} /> Preview
                </button>
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="btn-luxury-primary !py-2.5 !px-4 !text-xs flex-1"
                >
                  <FiEdit3 size={14} /> Use Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Live Preview Modal */}
      {previewCV && (
        <CVExamplePreview
          example={previewCV}
          onClose={() => setPreviewCV(null)}
          onUseTemplate={() => { setPreviewCV(null); navigate('/resume-builder'); }}
        />
      )}
    </div>
  );
}
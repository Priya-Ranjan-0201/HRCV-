import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiTag, FiTrendingUp, FiSearch, FiBookOpen } from 'react-icons/fi';

const CATEGORIES = ['All', 'ATS Guide', 'Resume Engineering', 'Interview Prep', 'Career Growth', 'Salary Negotiation'];

const ARTICLES = [
  {
    id: 1, category: 'ATS Guide',
    title: 'How Modern Enterprise ATS Systems Parse & Score Candidate Profiles',
    excerpt: 'Applicant Tracking Systems filter 75% of resumes before a human recruiter ever sees them. Here is the technical breakdown of Workday and Greenhouse parsers — and how to achieve perfect score compliance.',
    readTime: '8 min read', date: 'Jul 2026', featured: true,
    color: '#6366f1',
  },
  {
    id: 2, category: 'Resume Engineering',
    title: 'High-Impact Quantifiable Metrics: Transforming Weak Bullet Points',
    excerpt: 'Passive verbs like "helped with" destroy your hiring probability. Replace them with XYZ-formula achievement statements with dollars, percentages, and latency metrics.',
    readTime: '5 min read', date: 'Jul 2026', featured: false,
    color: '#10b981',
  },
  {
    id: 3, category: 'Career Growth',
    title: 'Architecting a Staff Engineer Portfolio: From IC4 to Principal',
    excerpt: 'Technical depth alone is insufficient for senior levels. Discover how to document system architecture decisions, cross-team leverage, and executive sponsorship.',
    readTime: '12 min read', date: 'Jun 2026', featured: false,
    color: '#8b5cf6',
  },
  {
    id: 4, category: 'Interview Prep',
    title: 'FAANG Behavioral Systems: Perfecting the STAR Leadership Framework',
    excerpt: 'Situation, Task, Action, Result — master structured storytelling to convey leadership principles under high-pressure senior bar-raiser rounds.',
    readTime: '7 min read', date: 'Jun 2026', featured: false,
    color: '#f59e0b',
  },
  {
    id: 5, category: 'Salary Negotiation',
    title: 'Executive Compensation Strategy: RSU Grants, Bonuses, & Equity Packages',
    excerpt: 'How to negotiate multiple competing offers across Tier-1 tech firms and venture-backed scaleups without leaving six figures on the table.',
    readTime: '9 min read', date: 'May 2026', featured: false,
    color: '#06b6d4',
  },
  {
    id: 6, category: 'ATS Guide',
    title: 'BERT Semantic Similarity vs Keyword Stuffing in 2026',
    excerpt: 'Why old keyword stuffing hacks trigger anti-cheat penalties in modern ML resume checkers, and how context-rich semantic sentences win.',
    readTime: '6 min read', date: 'May 2026', featured: false,
    color: '#f43f5e',
  },
];

export default function CareerBlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="badge-luxury">
            <FiBookOpen size={14} className="text-indigo-400" />
            <span>Career Intelligence Journal</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
            Insights For High-Growth <span className="gradient-text-indigo">Careers</span>
          </h1>
          <p className="text-slate-400 text-base">
            Expert breakdowns on ATS algorithms, interview frameworks, executive resumes, and compensation negotiations.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-6">
          <div className="max-w-xl mx-auto relative">
            <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="input-luxury !pl-12 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'glass-card text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art, i) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col justify-between space-y-4 group hover:border-indigo-500/50 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <FiClock size={12} />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heading text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{art.date}</span>
                <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <FiArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiArrowUp, FiShield, FiActivity, FiZap, FiTarget, FiFileText, FiAward, FiHeart, FiGlobe } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Logo
import Logo from './components/Logo';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import CVPage from './pages/CVPage';
import CoverLetterPage from './pages/CoverLetterPage';
import CareerBlogPage from './pages/CareerBlogPage';
import AboutPage from './pages/AboutPage';
import RegisterPopup from './components/RegisterPopup';
// Feature Pages
import ResumeRewritePage from './pages/ResumeRewritePage';
import AtsScorePage from './pages/AtsScorePage';
import JdMatchPage from './pages/JdMatchPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import InterviewSimulatorPage from './pages/InterviewSimulatorPage';
import SalaryPredictPage from './pages/SalaryPredictPage';
import SkillGapPage from './pages/SkillGapPage';
import PortfolioAnalyzerPage from './pages/PortfolioAnalyzerPage';
import ResumeHistoryPage from './pages/ResumeHistoryPage';
import api from './services/api';

/* ── Scroll-to-top on route change ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ── Floating scroll-to-top button ── */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 400);
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-indigo-500/40 bg-[#090e1a]/90 text-indigo-400 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20 transition hover:-translate-y-1 hover:border-indigo-400 hover:text-white"
      aria-label="Scroll to top"
    >
      <FiArrowUp size={16} />
    </motion.button>
  );
}

/* ── Dropdown menu helper ── */
function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
          open ? 'text-white bg-white/10 border border-white/15' : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        <span>{label}</span>
        <FiChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[240px] z-50 p-2 space-y-1"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => { navigate(item.to); setOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/20 rounded-xl transition-all flex items-center justify-between group focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>}
                  <span className="font-semibold group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ user, onLogout, onOpenRegister }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { 
    setMobileOpen(false); 
  }, [location.pathname]);

  const resumeDropItems = [
    { label: 'AI Resume Scanner', to: '/analyze', icon: '⚡', badge: '94.3%' },
    { label: 'ATS Score Checker', to: '/ats-score', icon: '📊' },
    { label: 'AI Rewrite Studio', to: '/ai-rewrite', icon: '✨' },
    { label: 'Resume Builder', to: '/resume-builder', icon: '🛠️' },
    { label: 'Version History', to: '/resume-history', icon: '📁' },
  ];

  const cvDropItems = [
    { label: 'JD Semantic Matcher', to: '/jd-match', icon: '🎯', badge: 'BERT' },
    { label: 'CV Builder Studio', to: '/cv', icon: '📋' },
    { label: 'Cover Letter AI', to: '/cover-letter', icon: '✉️' },
  ];

  const careerDropItems = [
    { label: 'Career Roadmap', to: '/career-roadmap', icon: '🗺️' },
    { label: 'Skill Gap Radar', to: '/skill-gap', icon: '📈' },
    { label: 'Portfolio Intelligence', to: '/portfolio-analyzer', icon: '🌐' },
    { label: 'Interview Simulator', to: '/interview-simulator', icon: '🎤' },
    { label: 'Salary Predictor', to: '/salary-predict', icon: '💰' },
  ];

  return (
    <nav className="sticky top-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Dynamic Vector Logo */}
        <Logo size="md" />

        {/* Center Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Home
          </Link>
          <NavDropdown label="Resume Suite" items={resumeDropItems} />
          <NavDropdown label="Target Matching" items={cvDropItems} />
          <NavDropdown label="Intelligence" items={careerDropItems} />
          <Link to="/career-blog" className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Journal
          </Link>
          <Link to="/about" className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Platform
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* User auth state */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300 hidden md:inline px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                {user.name}
              </span>
              <button 
                onClick={onLogout}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenRegister}
              className="text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Primary Action Button */}
          <Link
            to="/analyze"
            className="btn-luxury-primary !py-2.5 !px-4 !text-xs !rounded-xl hidden sm:inline-flex"
          >
            <FiActivity size={14} />
            <span>Launch Scanner</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/10 bg-[#090d16] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2">Navigation Matrix</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '⚡ Resume Scanner', to: '/analyze' },
                  { label: '📊 ATS Compliance', to: '/ats-score' },
                  { label: '🎯 JD Matcher', to: '/jd-match' },
                  { label: '✨ AI Rewrite', to: '/ai-rewrite' },
                  { label: '🗺️ Career Roadmap', to: '/career-roadmap' },
                  { label: '📈 Skill Gap Radar', to: '/skill-gap' },
                  { label: '🎤 Interview AI', to: '/interview-simulator' },
                  { label: '💰 Salary Predictor', to: '/salary-predict' },
                  { label: '📁 Version History', to: '/resume-history' },
                  { label: 'ℹ️ About Platform', to: '/about' },
                ].map((item) => (
                  <button
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 rounded-xl transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => navigate('/analyze')}
                  className="w-full btn-luxury-primary !py-3 !text-xs"
                >
                  Launch Neural Scanner Free →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ── Modern Symmetrical Luxury Footer ── */
function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#030712] pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Grid: Brand + Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" to="/" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Enterprise-grade AI career intelligence suite engineered with ensemble Random Forest classifiers, BERT semantic vector embeddings, and multi-tier company placement matrices.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>94.3% Model Precision Active</span>
            </div>
          </div>

          {/* Col 1: Neural Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Neural Suite</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => navigate('/analyze')} className="hover:text-indigo-400 transition-colors">Resume Scanner</button></li>
              <li><button onClick={() => navigate('/ats-score')} className="hover:text-indigo-400 transition-colors">ATS Compliance</button></li>
              <li><button onClick={() => navigate('/ai-rewrite')} className="hover:text-indigo-400 transition-colors">Impact Rewrite Studio</button></li>
              <li><button onClick={() => navigate('/jd-match')} className="hover:text-indigo-400 transition-colors">JD Semantic Matcher</button></li>
              <li><button onClick={() => navigate('/resume-history')} className="hover:text-indigo-400 transition-colors">Version Diff Console</button></li>
            </ul>
          </div>

          {/* Col 2: Career Intelligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Career Radar</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => navigate('/career-roadmap')} className="hover:text-indigo-400 transition-colors">Target Roadmap</button></li>
              <li><button onClick={() => navigate('/skill-gap')} className="hover:text-indigo-400 transition-colors">Skill Gap Radar</button></li>
              <li><button onClick={() => navigate('/portfolio-analyzer')} className="hover:text-indigo-400 transition-colors">Portfolio Intelligence</button></li>
              <li><button onClick={() => navigate('/interview-simulator')} className="hover:text-indigo-400 transition-colors">AI Interview Simulator</button></li>
              <li><button onClick={() => navigate('/salary-predict')} className="hover:text-indigo-400 transition-colors">Compensation Benchmark</button></li>
            </ul>
          </div>

          {/* Col 3: Resources & Organization */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => navigate('/cv')} className="hover:text-indigo-400 transition-colors">CV Gallery</button></li>
              <li><button onClick={() => navigate('/cover-letter')} className="hover:text-indigo-400 transition-colors">Cover Letter AI</button></li>
              <li><button onClick={() => navigate('/resume-builder')} className="hover:text-indigo-400 transition-colors">Live PDF Builder</button></li>
              <li><button onClick={() => navigate('/career-blog')} className="hover:text-indigo-400 transition-colors">Intelligence Journal</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-indigo-400 transition-colors">About &amp; Architecture</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <span>© {new Date().getFullYear()} VIREONIQ HRCV. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Stateless Inference</span>
            <span>•</span>
            <span>Zero Data Resale</span>
            <span>•</span>
            <span>End-to-End Cryptography</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ── App ── */
function App() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('hrcv_user') || localStorage.getItem('tonycv_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('auth_code');
    if (!authCode) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await api.post('/auth/github/exchange', { auth_code: authCode });
        if (cancelled) return;
        localStorage.setItem('hrcv_token', res.data.access_token);
        localStorage.setItem('hrcv_user', JSON.stringify(res.data.user));
        localStorage.setItem('tonycv_token', res.data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      } catch (err) {
        console.error('GitHub auth exchange failed:', err);
      } finally {
        params.delete('auth_code');
        const next = params.toString();
        const cleanUrl = `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hrcv_token');
    localStorage.removeItem('hrcv_user');
    localStorage.removeItem('tonycv_token');
    localStorage.removeItem('tonycv_user');
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Ambient background mesh */}
      <div className="bg-ambient-mesh" />
      <div className="grid-overlay" />

      {/* Navbar always visible */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenRegister={() => setRegisterOpen(true)} 
      />

      {/* Main Content */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/career-blog" element={<CareerBlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Feature Routes */}
          <Route path="/ai-rewrite" element={<ResumeRewritePage />} />
          <Route path="/ats-score" element={<AtsScorePage />} />
          <Route path="/jd-match" element={<JdMatchPage />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="/interview-simulator" element={<InterviewSimulatorPage />} />
          <Route path="/salary-predict" element={<SalaryPredictPage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
          <Route path="/portfolio-analyzer" element={<PortfolioAnalyzerPage />} />
          <Route path="/resume-history" element={<ResumeHistoryPage />} />
          {/* Catch-all → Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTopButton />

      {/* Registration & Login Popup */}
      <RegisterPopup 
        isOpen={registerOpen} 
        onClose={() => setRegisterOpen(false)} 
        onAuthSuccess={(u) => setUser(u)}
      />
    </Router>
  );
}

export default App;

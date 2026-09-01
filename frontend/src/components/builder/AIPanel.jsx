import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiZap } from 'react-icons/fi';

export default function AIPanel() {
  return (
    <div className="h-full flex flex-col bg-[#090d16] text-white">
      <div className="px-6 py-4 border-b border-white/10 bg-[#090d16] sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
          <FiZap className="text-amber-400" /> AI Neural Co-Pilot
        </h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* ATS Score Card */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">ATS Compatibility</h3>
            <span className="text-2xl font-black font-heading gradient-text-emerald">92<span className="text-xs text-slate-400 font-mono">/100</span></span>
          </div>
          
          <div className="w-full bg-[#030712] rounded-full h-2 overflow-hidden border border-white/5">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
              <span>XYZ impact formula detected in Work Experience.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Contact and LinkedIn URLs formatted correctly.</span>
            </div>
          </div>
        </div>
        
        {/* Chat / Suggestions area */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Co-Pilot Suggestions</h3>
          <button className="w-full text-left p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all group">
            <p className="text-xs font-bold text-indigo-300 group-hover:text-white">Synthesize Executive Summary</p>
            <p className="text-[11px] text-slate-400 mt-1">Generate a high-converting opening statement tailored for Tier-1 engineering roles.</p>
          </button>
          
          <button className="w-full text-left p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all group">
            <p className="text-xs font-bold text-amber-300 group-hover:text-white">Audit High-Demand Keywords</p>
            <p className="text-[11px] text-slate-400 mt-1">Discover stack competencies missing from target job descriptions.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

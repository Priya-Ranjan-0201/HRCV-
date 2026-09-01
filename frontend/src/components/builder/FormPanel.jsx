import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';

export default function FormPanel() {
  const { resumeData, updatePersonalInfo, design, updateDesign } = useResumeStore();

  const handleTemplateChange = (e) => updateDesign('templateId', e.target.value);
  const handleColorChange = (color) => updateDesign('themeColor', color);

  return (
    <div className="h-full flex flex-col bg-[#090d16] text-white">
      <div className="px-6 py-4 border-b border-white/10 bg-[#090d16] sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-base font-bold font-heading text-white">Resume Specifications</h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Live Sync</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Design Settings */}
        <section className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Design &amp; Layout</h3>
          <div className="glass-card p-4 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Template</label>
              <select 
                value={design.templateId}
                onChange={handleTemplateChange}
                className="input-luxury text-xs !py-2 bg-[#030712]"
              >
                <option value="cascade">Software Engineer (Cascade)</option>
                <option value="cubic">Data Scientist (Cubic)</option>
                <option value="crisp">Academic / Research (Crisp)</option>
                <option value="aria">Healthcare (Aria)</option>
                <option value="nexus">Creative / Design (Nexus)</option>
                <option value="apex">Executive Leadership (Apex)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Accent Palette</label>
              <div className="flex items-center gap-2">
                {['#6366f1', '#10b981', '#06b6d4', '#8b5cf6', '#f43f5e', '#f59e0b', '#0f172a'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${design.themeColor === color ? 'border-white scale-125 ring-2 ring-indigo-500' : 'border-transparent hover:scale-110 opacity-70'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Identity &amp; Contact</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">First Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                className="input-luxury text-xs !py-2"
                placeholder="Alex"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Last Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                className="input-luxury text-xs !py-2"
                placeholder="Rivera"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Target Professional Title</label>
            <input
              type="text"
              value={resumeData.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              className="input-luxury text-xs !py-2"
              placeholder="Senior Distributed Systems Engineer"
            />
          </div>
        </section>
        
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />
      </div>
    </div>
  );
}

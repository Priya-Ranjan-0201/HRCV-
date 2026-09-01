import React, { useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import SoftwareEngineerTemplate from '../templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../templates/DataScientistTemplate';
import AcademicResearchTemplate from '../templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../templates/CreativeDesignerTemplate';
import html2pdf from 'html2pdf.js';
import { FiDownload } from 'react-icons/fi';

const TEMPLATES = {
  cascade: SoftwareEngineerTemplate,
  cubic: DataScientistTemplate,
  crisp: AcademicResearchTemplate,
  aria: HealthcareProfessionalTemplate,
  nexus: CreativeDesignerTemplate,
  apex: BusinessExecutiveTemplate,
};

export default function PreviewPanel() {
  const { resumeData, design } = useResumeStore();
  const resumeRef = useRef(null);

  const handleDownloadPdf = () => {
    if (!resumeRef.current) return;
    const opt = {
      margin:       0,
      filename:     `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Export'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  const adapterData = {
    name: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim() || 'Alex Rivera',
    profession: resumeData.personalInfo.jobTitle || 'Senior Software Engineer',
    email: resumeData.personalInfo.email || 'alex.rivera@example.com',
    phone: resumeData.personalInfo.phone || '+1 (555) 019-2834',
    location: resumeData.personalInfo.location || 'San Francisco, CA',
    linkedin: resumeData.personalInfo.linkedin,
    website: resumeData.personalInfo.website,
    summary: resumeData.personalInfo.summary || 'High-performance engineer with deep expertise in scalable distributed systems and cloud architecture.',
    photoUrl: resumeData.personalInfo.photoUrl,
    experience: resumeData.experience.map(exp => ({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.current ? 'Present' : exp.endDate,
      desc: exp.description
    })),
    education: resumeData.education.map(edu => ({
      degree: edu.degree,
      field: edu.field,
      school: edu.school,
      endDate: edu.endDate
    })),
    skills: [
      ...resumeData.skills.technical,
      ...resumeData.skills.soft,
      ...resumeData.skills.languages,
      ...resumeData.skills.tools
    ]
  };

  const SelectedTemplate = TEMPLATES[design.templateId] || SoftwareEngineerTemplate;

  return (
    <div className="h-full flex flex-col bg-[#030712]">
      <div className="px-6 py-4 border-b border-white/10 bg-[#090d16] sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-base font-bold font-heading text-white">Live PDF Canvas</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPdf}
            className="btn-luxury-primary !py-2 !px-4 !text-xs flex items-center gap-2"
          >
            <FiDownload size={14} />
            <span>Download Vector PDF</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#030712] flex justify-center">
        {/* A4 Paper Mockup Wrapper */}
        <div className="w-[850px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all origin-top scale-90 sm:scale-100 my-auto text-slate-900 border border-slate-200">
          <div ref={resumeRef} className="w-[850px] min-h-[1100px]">
            <SelectedTemplate 
              data={adapterData} 
              color={design.themeColor} 
              photoEnabled={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

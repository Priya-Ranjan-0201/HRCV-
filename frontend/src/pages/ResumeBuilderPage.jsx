import React from 'react';
import FormPanel from '../components/builder/FormPanel';
import PreviewPanel from '../components/builder/PreviewPanel';
import AIPanel from '../components/builder/AIPanel';

export default function ResumeBuilderPage() {
  return (
    <div className="h-screen w-full bg-[#030712] flex overflow-hidden">
      {/* LEFT PANEL: Forms */}
      <div className="w-[420px] h-full bg-[#090d16] border-r border-white/10 flex flex-col z-10 shrink-0">
        <FormPanel />
      </div>

      {/* CENTER PANEL: Live Preview */}
      <div className="flex-1 h-full bg-[#030712] overflow-hidden flex flex-col relative z-0">
        <PreviewPanel />
      </div>

      {/* RIGHT PANEL: AI Assistant & ATS */}
      <div className="w-[380px] h-full bg-[#090d16] border-l border-white/10 flex flex-col z-10 shrink-0">
        <AIPanel />
      </div>
    </div>
  );
}
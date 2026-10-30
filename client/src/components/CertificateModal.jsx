import React from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function CertificateModal({ isOpen, onClose, certificate, userName }) {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just earned my official NexLearn verified certificate for ${certificate.courseTitle}! Credential ID: ${certificate.certificateId}`
      );
      alert('Certificate credential copied to clipboard! You can share it on LinkedIn or your portfolio.');
    }
  };

  const formattedDate = certificate.completedAt
    ? new Date(certificate.completedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 p-6 sm:p-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="relative border-4 border-double border-[#102A43] p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-white via-slate-50/50 to-blue-50/20 text-center space-y-6">
          {/* Top Brand Header */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <Logo size="large" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#64748B]">
              NexLearn Global Academic Credentials
            </span>
          </div>

          {/* Certificate Title */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#102A43] tracking-tight">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              This is to formally certify that
            </p>
          </div>

          {/* Recipient Name */}
          <div className="py-2 border-b-2 border-slate-300 max-w-md mx-auto">
            <h3 className="text-xl sm:text-3xl font-black text-[#2563EB] tracking-normal font-sans">
              {userName || 'NexLearn Scholar'}
            </h3>
          </div>

          {/* Course Name Description */}
          <div className="space-y-1 max-w-xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-600">
              has successfully fulfilled all curriculum requirements, hands-on modules, and practical assessments for
            </p>
            <h4 className="text-base sm:text-xl font-bold text-[#102A43]">
              {certificate.courseTitle}
            </h4>
            <p className="text-xs text-slate-500">
              Curriculum Category: {certificate.category || 'Professional Skills'} • Completed {formattedDate}
            </p>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-6 grid grid-cols-3 items-end gap-4 text-center">
            {/* Instructor Signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-slate-700 font-semibold border-b border-slate-300 pb-1">
                {certificate.instructorName || 'Dr. Angela Mercer'}
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Course Lead Instructor
              </p>
            </div>

            {/* NexLearn Official Embossed Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-500 bg-amber-50/80 flex flex-col items-center justify-center text-amber-700 shadow-md">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">VERIFIED</span>
              </div>
            </div>

            {/* Academic Director Signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-slate-700 font-semibold border-b border-slate-300 pb-1">
                Dr. Marcus Chen
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Dean of Academic Affairs
              </p>
            </div>
          </div>

          {/* Credential ID */}
          <div className="pt-2 text-[10px] font-mono text-slate-400">
            Credential ID: {certificate.certificateId || 'NEX-CERT-SAMPLE-990'} • Verify online at nexlearn.org/verify
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={handleShare}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy Credential Link</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

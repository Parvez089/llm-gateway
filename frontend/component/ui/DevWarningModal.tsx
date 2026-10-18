// frontend/components/ui/DevWarningModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Construction, X } from "lucide-react";

export function DevWarningModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // চেক করা হচ্ছে ইউজার আগে পপআপটি ডিসমিস করেছে কিনা
    const hasSeen = localStorage.getItem("dev_warning_seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("dev_warning_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Construction className="h-6 w-6" />
        </div>

        {/* Content */}
        <h2 className="mb-2 text-xl font-bold text-slate-900">
          Project in Development
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          Welcome to LLM Gateway! Please note that this project is currently in its early development stage. 
          Some features may be incomplete, experimental, or subject to change as we continue to improve the platform.
        </p>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          I Understand, Continue
        </button>
      </div>
    </div>
  );
}
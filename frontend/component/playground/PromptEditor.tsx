// component/playground/PromptEditor.tsx
"use client";

import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  prompt: string;
  setPrompt: (val: string) => void;
};

const PLACEHOLDERS = [
  "Enter your prompt here...",
  "What is quantum computing?",
  "Write a TypeScript function to reverse a string.",
  "Explain the two-pointer technique.",
  "Draft an email asking for a deadline extension."
];

export function PromptEditor({ prompt, setPrompt }: Props) {
  // state for typing animation
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // placeholder typing logic
  useEffect(() => {
    const currentText = PLACEHOLDERS[placeholderIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        setPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        // text wait
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex]);

  // token calculation
  const charCount = prompt.length;
  const tokenEstimate = Math.ceil(charCount / 4);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-500" /> Prompt Editor
          </span>
        </div>
      </div>

      <div className="p-4 relative">
        <textarea 
          className="w-full h-32 resize-none bg-transparent text-sm text-slate-800 focus:outline-none relative z-10"
          // placeholder animated text
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs text-slate-400 font-mono pointer-events-none">
          <span>{charCount} chars</span>
          <span>~{tokenEstimate} tokens</span>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
        >
          IsaiahAIhub
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('catalogue')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeSection === 'catalogue' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => onNavigate('guide')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeSection === 'guide' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Install Guide
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeSection === 'about' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeSection === 'privacy' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeSection === 'support' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Support
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('catalogue')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Browse Apps</span>
          </button>
        </div>
      </div>
    </header>
  );
};

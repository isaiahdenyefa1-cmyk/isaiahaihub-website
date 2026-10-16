import React from 'react';
import { Github, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#06090f] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Brand & Wordmark */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-base font-bold text-white tracking-tight">IsaiahAIhub</span>
            <p className="text-slate-400 text-xs">
              Automatic Android APK catalogue and digital tools distribution.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 flex-wrap justify-center font-medium">
            <button
              onClick={() => onNavigate('catalogue')}
              className="hover:text-white transition-colors"
            >
              Catalogue
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="hover:text-white transition-colors"
            >
              Install Guide
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy & Security
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="hover:text-white transition-colors"
            >
              Support
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legal & Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px] font-mono">
          <span>
            © {new Date().getFullYear()} IsaiahAIhub. Built for independent Android app distribution.
          </span>
          <span>
            Binary storage: GitHub Releases CDN · Zero telemetry cookies
          </span>
        </div>
      </div>
    </footer>
  );
};

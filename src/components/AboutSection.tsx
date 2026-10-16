import React from 'react';
import { Github, Code, Sparkles, Terminal } from 'lucide-react';
import avatarImg from '../assets/images/creator_avatar_1792048379260.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#080c14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Creator Avatar */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl">
                <img
                  src={avatarImg}
                  alt="Isaiah - Creator of IsaiahAIhub"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-base font-bold text-white">Isaiah</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Software Developer & Creator</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Principles */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <span>Creator Mission</span>
              <span aria-hidden="true">·</span>
              <span>Open Tooling</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Building Pragmatic Digital Tools
            </h2>

            <blockquote className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-sm sm:text-base text-slate-200 italic mb-6">
              "I build practical digital tools and resources that help developers, AI users and content creators work smarter."
            </blockquote>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              IsaiahAIhub was founded on a simple premise: software should solve real daily friction without cumbersome subscriptions, invasive trackers, or walled-garden approval delays. Every Android utility published here is engineered for offline reliability, performance, and immediate utility.
            </p>

            {/* Principles Bento Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center mb-3">
                  <Code className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">Developer-Centric</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast token calculators, prompt testing utilities, and local log managers tailored to modern dev stacks.
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">AI Productivity</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focused interfaces for structuring prompts, estimating inference latency, and organizing prompt templates.
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center mb-3">
                  <Terminal className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">Direct GitHub Storage</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Publicly auditable releases stored exclusively on GitHub with verifiable file hashes and release notes.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com/isaiahdenyefa1-cmyk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile (@isaiahdenyefa1-cmyk)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

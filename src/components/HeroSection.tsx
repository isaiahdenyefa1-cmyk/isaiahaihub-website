import React from 'react';
import { ArrowDown, Github, Smartphone, Sparkles, RefreshCw } from 'lucide-react';
import heroImg from '../assets/images/isaiahaihub_hero_1792048377938.jpg';

interface HeroSectionProps {
  totalApps: number;
  isLiveRepo: boolean;
  onExplore: () => void;
  onOpenGuide: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalApps,
  isLiveRepo,
  onExplore,
  onOpenGuide,
  onRefresh,
  isRefreshing,
  searchQuery,
  onSearchChange
}) => {
  return (
    <section id="hero" className="relative border-b border-slate-800/80 bg-[#080c14] overflow-hidden pt-8 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet metadata line */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
              <span>Automatic Android Distribution</span>
              <span aria-hidden="true">·</span>
              <a
                href="https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>isaiahdenyefa1-cmyk/isaiahaihub-apps</span>
              </a>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6"
              style={{ textWrap: 'balance' }}
            >
              Practical Android Tools for Creators & Developers.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              I build practical digital tools and resources that help developers, AI users and content creators work smarter.
              All apps are published directly via GitHub Releases for instant, verified, and transparent distribution.
            </p>

            {/* Quick Search & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search tools, AI utilities, packages..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={onExplore}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
              >
                <span>View Catalogue</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Live Repository Status Strip */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-300">
                  <span className="text-white font-semibold tabular-nums">{totalApps}</span> APK releases available
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">Zero manual website redeployments</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors disabled:opacity-50"
                  title="Check GitHub for newly published releases"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Sync Releases</span>
                </button>
                <button
                  onClick={onOpenGuide}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors"
                >
                  <Smartphone className="w-3 h-3 text-blue-400" />
                  <span>Install Guide</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/60 shadow-2xl">
              <img
                src={heroImg}
                alt="IsaiahAIhub Android app developer workstation with live device testing"
                className="w-full h-auto object-cover aspect-16/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-60 pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-200 font-medium truncate">Continuous GitHub Release Discovery</span>
                </div>
                <span className="text-blue-400 font-mono text-[11px] shrink-0">v1.0 Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

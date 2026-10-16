import React from 'react';
import { Download, ShieldCheck, Settings, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import showcaseImg from '../assets/images/android_showcase_1792048378226.jpg';

interface InstallGuideSectionProps {
  onBrowseCatalogue: () => void;
}

export const InstallGuideSection: React.FC<InstallGuideSectionProps> = ({ onBrowseCatalogue }) => {
  const steps = [
    {
      num: '01',
      title: 'Download the APK',
      desc: 'Tap "Download APK" on any tool card in the catalogue. Your browser will download the verified release directly from GitHub Releases.',
      icon: Download
    },
    {
      num: '02',
      title: 'Permit Unknown App Sources',
      desc: 'When prompted by Android, tap "Settings" and toggle "Allow from this source" for your browser (Chrome/Brave) or Files app.',
      icon: Settings
    },
    {
      num: '03',
      title: 'Confirm Installation',
      desc: 'Tap "Install" on the package installer prompt. If Google Play Protect displays a prompt, tap "Install anyway" or let it scan the package.',
      icon: ShieldCheck
    },
    {
      num: '04',
      title: 'Ready to Run',
      desc: 'The app icon appears on your Android launcher. You can open and use it immediately without cloud account requirements.',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="guide" className="py-16 bg-[#090e18] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Detailed Guide */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <span>Android Sideloading Walkthrough</span>
              <span aria-hidden="true">·</span>
              <span>Simple 4-Step Process</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
              How to Install APKs on Your Android Device
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl">
              Android allows users to install applications directly without relying exclusively on the Google Play Store. Here is how to complete the standard installation safely.
            </p>

            {/* Steps List */}
            <div className="space-y-4 mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-900/60 flex items-center justify-center shrink-0 text-blue-400 font-mono font-bold text-xs">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                        <span>{step.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safety & Play Protect Note */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block mb-0.5">
                  About the "File might be harmful" Warning
                </span>
                Android automatically displays this warning for any APK downloaded outside the Play Store. Because IsaiahAIhub APKs are compiled from public repositories and delivered directly via GitHub Releases, they do not carry Google Play certifications. Always check the SHA-256 hash in the release notes to verify integrity.
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 shadow-2xl mb-6">
              <img
                src={showcaseImg}
                alt="IsaiahAIhub mobile Android tools interface showcase"
                className="w-full h-auto object-cover aspect-4/3"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e18] via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-white block mb-0.5">
                  Direct GitHub Release Downloads
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  No intermediaries · Pure APK binaries · Verifiable hashes
                </span>
              </div>
            </div>

            <button
              onClick={onBrowseCatalogue}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Available Tools</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

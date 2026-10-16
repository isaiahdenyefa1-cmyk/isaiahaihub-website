import React, { useState } from 'react';
import { Mail, Github, Check, Copy, Shield, HelpCircle, AlertCircle } from 'lucide-react';

export const PrivacySupportSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const supportEmail = 'isaiahdenyefa1@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="privacy" className="py-16 bg-[#090d16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Privacy & Transparency */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Security & Privacy Policy</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
              Commitment to Transparency
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <h4 className="font-semibold text-white mb-1">Zero Analytics & Tracking Cookies</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  IsaiahAIhub does not load third-party analytics trackers, fingerprinting scripts, advertising pixels, or telemetry beacons. Browsing the catalogue is completely anonymous.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <h4 className="font-semibold text-white mb-1">Direct GitHub Releases Storage</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  All APK binaries are hosted directly in the public GitHub release repository <code className="text-blue-300">isaiahdenyefa1-cmyk/isaiahaihub-apps</code>. Download buttons trigger direct browser downloads from GitHub's verified CDN.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <h4 className="font-semibold text-white mb-1">Independent Verification & Safety</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  These applications are built independently by Isaiah and have not been reviewed, tested, or endorsed by Google LLC. Each release provides an optional SHA-256 checksum so users can verify the binary against the author's published hash.
                </p>
              </div>
            </div>
          </div>

          {/* Support & Contact */}
          <div id="support">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Contact & Support</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
              Get in Touch or Report an Issue
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Encountered a bug, have an app idea, or need help with installation? Reach out directly via email or submit an issue to the public APK repository.
            </p>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5">
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1.5">Direct Developer Email</span>
                <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-mono text-white truncate">{supportEmail}</span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="ml-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1.5">Public Bug Tracker</span>
                <a
                  href="https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white font-medium">
                      GitHub Issues (isaiahaihub-apps)
                    </span>
                  </div>
                  <span className="text-xs text-blue-400 font-mono">Open Tracker →</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  Please include your Android version (e.g. Android 13) and device model when reporting app crashes or compatibility issues.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

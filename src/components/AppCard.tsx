import React from 'react';
import {
  Download,
  ExternalLink,
  Cpu,
  Sparkles,
  Smartphone,
  FileText,
  Settings,
  Headphones,
  ShieldCheck,
  Star,
  ArrowDownToLine
} from 'lucide-react';
import type { NormalizedApp } from '../types/app.js';

interface AppCardProps {
  app: NormalizedApp;
  onSelect: (app: NormalizedApp) => void;
  onDownloadClick?: (app: NormalizedApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelect, onDownloadClick }) => {
  const renderAppIcon = () => {
    if (app.iconUrl) {
      return (
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="w-12 h-12 rounded-xl object-cover border border-slate-700/80"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    let Icon = Cpu;
    if (app.category === 'AI Utilities') Icon = Sparkles;
    else if (app.category === 'Developer Tools') Icon = Cpu;
    else if (app.category === 'Creator Tools') Icon = Smartphone;
    else if (app.category === 'Productivity') Icon = FileText;
    else if (app.category === 'System & Utilities') Icon = Settings;
    else if (app.category === 'Media & Audio') Icon = Headphones;
    else if (app.category === 'Security & Privacy') Icon = ShieldCheck;

    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 text-blue-400">
        <Icon className="w-6 h-6" />
      </div>
    );
  };

  const formattedDate = new Date(app.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownload = () => {
    if (onDownloadClick) {
      onDownloadClick(app);
    }
  };

  return (
    <div className="flex flex-col justify-between p-6 bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 rounded-xl transition-all duration-200 group">
      <div>
        {/* Top Header: Icon + Name + Version */}
        <div className="flex items-start gap-4 mb-4">
          {renderAppIcon()}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                {app.name}
              </h3>
              {app.isNew && (
                <span className="text-[11px] font-mono text-blue-400 font-semibold shrink-0">
                  NEW
                </span>
              )}
            </div>

            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 flex-wrap">
              <span className="text-slate-300 font-medium">v{app.version}</span>
              <span aria-hidden="true">·</span>
              <span>{app.apkSizeFormatted}</span>
              <span aria-hidden="true">·</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Rating and Download metrics strip */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-200 tabular-nums">
              {app.rating && app.rating > 0 ? app.rating.toFixed(1) : 'Unrated'}
            </span>
            {app.reviewCount && app.reviewCount > 0 ? (
              <span className="text-slate-500">({app.reviewCount})</span>
            ) : null}
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div className="flex items-center gap-1 text-slate-400">
            <ArrowDownToLine className="w-3.5 h-3.5 text-blue-400" />
            <span className="tabular-nums font-medium text-slate-300">
              {app.downloadCount || 0}
            </span>
            <span className="text-slate-500">downloads</span>
          </div>
        </div>

        {/* App Description */}
        <p className="text-sm text-slate-300 line-clamp-3 mb-5 leading-relaxed">
          {app.description}
        </p>
      </div>

      {/* Bottom Actions & Compatibility */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{app.category}</span>
          {app.minAndroidVersion && <span>{app.minAndroidVersion}</span>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Direct GitHub Download Button */}
          <a
            href={app.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap shrink-0"
            title={`Download ${app.apkFileName} directly from GitHub Release`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </a>

          {/* Details & Reviews Button */}
          <button
            onClick={() => onSelect(app)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 whitespace-nowrap shrink-0"
          >
            <span>Reviews & Specs</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

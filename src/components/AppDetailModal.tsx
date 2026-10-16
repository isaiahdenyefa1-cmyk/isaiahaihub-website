import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Cpu,
  Sparkles,
  Terminal,
  FileText,
  ExternalLink,
  Hash,
  Star,
  ArrowDownToLine,
  Settings,
  Headphones,
  ShieldCheck
} from 'lucide-react';
import type { NormalizedApp, AppRatingSummary } from '../types/app.js';
import { ReviewSection } from './ReviewSection.js';

interface AppDetailModalProps {
  app: NormalizedApp | null;
  onClose: () => void;
  onOpenGuide: () => void;
  onDownloadClick?: (app: NormalizedApp) => void;
  onAppMetricsUpdated?: (appId: string, summary: AppRatingSummary) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onOpenGuide,
  onDownloadClick,
  onAppMetricsUpdated
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | undefined>(app?.rating);
  const [currentReviewCount, setCurrentReviewCount] = useState<number | undefined>(app?.reviewCount);

  if (!app) return null;

  const copyToClipboard = (text: string, type: 'hash' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownload = () => {
    if (onDownloadClick) {
      onDownloadClick(app);
    }
  };

  const formattedDate = new Date(app.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  let CategoryIcon = Terminal;
  if (app.category === 'AI Utilities') CategoryIcon = Sparkles;
  else if (app.category === 'Developer Tools') CategoryIcon = Cpu;
  else if (app.category === 'Productivity') CategoryIcon = FileText;
  else if (app.category === 'System & Utilities') CategoryIcon = Settings;
  else if (app.category === 'Media & Audio') CategoryIcon = Headphones;
  else if (app.category === 'Security & Privacy') CategoryIcon = ShieldCheck;

  const displayRating = currentRating ?? app.rating ?? 0;
  const displayReviewCount = currentReviewCount ?? app.reviewCount ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-blue-400">
            <CategoryIcon className="w-7 h-7" />
          </div>

          <div className="min-w-0 pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {app.name}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1 flex-wrap">
              <span className="text-blue-400 font-semibold">v{app.version}</span>
              <span aria-hidden="true">·</span>
              <span>{app.apkSizeFormatted}</span>
              <span aria-hidden="true">·</span>
              <span>Published {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Specs & Community Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-xl mb-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 block mb-0.5">Rating</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{displayRating > 0 ? displayRating.toFixed(1) : 'Unrated'}</span>
              <span className="text-slate-500 text-[10px] font-normal">
                ({displayReviewCount})
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Downloads</span>
            <div className="flex items-center gap-1 text-slate-200 font-bold">
              <ArrowDownToLine className="w-3.5 h-3.5 text-blue-400" />
              <span className="tabular-nums">{app.downloadCount || 0}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Category</span>
            <span className="text-slate-200 font-medium truncate block">{app.category}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Target OS</span>
            <span className="text-slate-200 font-medium truncate block">
              {app.minAndroidVersion || 'Android 8.0+'}
            </span>
          </div>
        </div>

        {/* Description & Release Notes */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Release Notes
          </h4>
          <div className="max-h-52 overflow-y-auto p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm leading-relaxed text-slate-300 whitespace-pre-line font-mono text-xs">
            {app.releaseNotes}
          </div>
        </div>

        {/* Package & Verification */}
        {app.sha256 && (
          <div className="mb-6 p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
            <div className="min-w-0 flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400 block text-[10px]">SHA-256 Checksum</span>
                <span className="text-slate-300 truncate block text-[11px]">{app.sha256}</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(app.sha256!, 'hash')}
              className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors shrink-0 flex items-center gap-1"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        {/* Android Installation Notice */}
        <div className="mb-6 p-3.5 bg-blue-950/30 border border-blue-900/40 rounded-xl flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Android Installation Notice</span>
            When installing directly from browser, Android may prompt: <em className="text-slate-200">"File might be harmful"</em> or require enabling <em className="text-slate-200">"Install Unknown Apps"</em> in settings. This is standard security behavior for all applications installed outside Google Play.
            <button
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="text-blue-400 hover:text-blue-300 underline font-medium ml-1.5 inline-block"
            >
              View Step-by-Step Guide
            </button>
          </div>
        </div>

        {/* Primary Download Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <button
            onClick={() => copyToClipboard(app.downloadUrl, 'link')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700/80"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Download Link'}</span>
          </button>

          <a
            href={app.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Download className="w-4 h-4" />
            <span>Download APK ({app.apkSizeFormatted})</span>
          </a>
        </div>

        {/* Community Reviews & Ratings Section */}
        <ReviewSection
          appId={app.id}
          appVersion={app.version}
          appName={app.name}
          onReviewAdded={(newSummary) => {
            setCurrentRating(newSummary.averageRating);
            setCurrentReviewCount(newSummary.totalReviews);
            if (onAppMetricsUpdated) {
              onAppMetricsUpdated(app.id, newSummary);
            }
          }}
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, RefreshCw, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import type { AppsApiResponse } from '../types/app.js';

interface ApiDiagnosticsDrawerProps {
  apiResponse: AppsApiResponse | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ApiDiagnosticsDrawer: React.FC<ApiDiagnosticsDrawerProps> = ({
  apiResponse,
  onRefresh,
  isRefreshing
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const meta = apiResponse?.meta;

  const resetTimeFormatted = meta?.rateLimitReset
    ? new Date(meta.rateLimitReset * 1000).toLocaleTimeString()
    : 'Unknown';

  return (
    <aside aria-label="System Diagnostics" className="border-t border-slate-800 bg-[#070a10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Developer Diagnostics & API Inspector</span>
            <span aria-hidden="true">·</span>
            <span className={apiResponse?.success ? 'text-emerald-400' : 'text-amber-400'}>
              {apiResponse?.success ? 'HTTP 200 Live' : 'Offline/Warning'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-500">
              Rate Limit: {meta?.rateLimitRemaining !== null ? `${meta?.rateLimitRemaining}/60` : 'N/A'}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Drawer Content */}
        {isOpen && (
          <div className="py-5 border-t border-slate-800/80 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block mb-1">Target Repository</span>
                <a
                  href={meta?.repoUrl || 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 truncate"
                >
                  <span>{meta?.repository || 'isaiahdenyefa1-cmyk/isaiahaihub-apps'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block mb-1">Cache Status</span>
                <span className="text-slate-200 font-medium">
                  {meta?.cached ? `Cached (${meta.cacheAgeSeconds}s old)` : 'Fresh Fetch'}
                  {meta?.isStaleFallback && ' · Fallback Active'}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block mb-1">GitHub API Rate Quota</span>
                <span className="text-slate-200 font-medium">
                  {meta?.rateLimitRemaining !== null ? `${meta?.rateLimitRemaining} remaining` : '60/hr public'}
                  <span className="text-slate-500 block text-[10px] mt-0.5">Resets at {resetTimeFormatted}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block mb-1">Release Discovery Audit</span>
                <span className="text-slate-200 font-medium">
                  {meta?.totalApps ?? 0} valid apps · {meta?.excludedReleasesCount ?? 0} excluded
                </span>
              </div>
            </div>

            {/* Ambiguous Releases Warning if any */}
            {meta?.ambiguousReleases && meta.ambiguousReleases.length > 0 && (
              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ambiguous Releases Excluded ({meta.ambiguousReleases.length})</span>
                </div>
                {meta.ambiguousReleases.map((rep) => (
                  <div key={rep.releaseId} className="text-[11px] text-amber-300/80 mt-1">
                    Release <code className="text-white">{rep.releaseName}</code> ({rep.tag}): {rep.reason}. Candidates: {rep.candidateAssets.join(', ')}
                  </div>
                ))}
              </div>
            )}

            {/* Test Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Force Re-fetch (/api/apps?refresh=true)</span>
                </button>

                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
                >
                  {showRawJson ? 'Hide Raw JSON Payload' : 'Inspect Raw /api/apps Payload'}
                </button>
              </div>

              <span className="text-slate-500 text-[11px]">
                Endpoint: <code className="text-slate-300">GET /api/apps</code>
              </span>
            </div>

            {/* Raw JSON View */}
            {showRawJson && (
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg max-h-72 overflow-y-auto text-[11px] text-blue-300">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

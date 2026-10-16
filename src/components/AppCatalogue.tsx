import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Github,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  ArrowDownToLine,
  Calendar,
  Filter
} from 'lucide-react';
import type { NormalizedApp, AppCategory } from '../types/app.js';
import { AppCard } from './AppCard.js';

interface AppCatalogueProps {
  apps: NormalizedApp[];
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onSelectApp: (app: NormalizedApp) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onDownloadClick?: (app: NormalizedApp) => void;
}

export const AppCatalogue: React.FC<AppCatalogueProps> = ({
  apps,
  isLoading,
  error,
  onRefresh,
  isRefreshing,
  onSelectApp,
  searchQuery,
  onSearchChange,
  isPreviewMode,
  onTogglePreviewMode,
  onDownloadClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'rating' | 'downloads' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc'
  >('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Advanced Filter Drawer State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [versionFilter, setVersionFilter] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d' | '365d'>('all');
  const [minRating, setMinRating] = useState<number>(0);

  const categories: (AppCategory | 'All')[] = [
    'All',
    'Developer Tools',
    'AI Utilities',
    'Creator Tools',
    'Productivity',
    'System & Utilities',
    'Media & Audio',
    'Security & Privacy'
  ];

  // Reset advanced filters
  const resetFilters = () => {
    onSearchChange('');
    setSelectedCategory('All');
    setNameFilter('');
    setKeywordFilter('');
    setVersionFilter('');
    setDateRange('all');
    setMinRating(0);
    setSortBy('newest');
  };

  const hasActiveAdvancedFilters =
    nameFilter.trim() !== '' ||
    keywordFilter.trim() !== '' ||
    versionFilter.trim() !== '' ||
    dateRange !== 'all' ||
    minRating > 0;

  const filteredApps = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return apps
      .filter((app) => {
        // 1. Category Filter
        if (selectedCategory !== 'All' && app.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // 2. Minimum Rating Filter
        if (minRating > 0 && (app.rating || 0) < minRating) {
          return false;
        }

        // 3. Release Date Filter
        if (dateRange !== 'all') {
          const pubTime = new Date(app.publishedAt).getTime();
          const ageDays = (now - pubTime) / dayMs;
          if (dateRange === '7d' && ageDays > 7) return false;
          if (dateRange === '30d' && ageDays > 30) return false;
          if (dateRange === '90d' && ageDays > 90) return false;
          if (dateRange === '365d' && ageDays > 365) return false;
        }

        // 4. Granular Advanced Filters
        if (nameFilter.trim()) {
          if (!app.name.toLowerCase().includes(nameFilter.toLowerCase().trim())) {
            return false;
          }
        }

        if (keywordFilter.trim()) {
          const kw = keywordFilter.toLowerCase().trim();
          const matchesDesc = app.description.toLowerCase().includes(kw);
          const matchesNotes = app.releaseNotes.toLowerCase().includes(kw);
          if (!matchesDesc && !matchesNotes) return false;
        }

        if (versionFilter.trim()) {
          const ver = versionFilter.toLowerCase().trim().replace(/^v/, '');
          if (!app.version.toLowerCase().includes(ver) && !app.tag.toLowerCase().includes(ver)) {
            return false;
          }
        }

        // 5. Query string with syntax support (e.g. "name:prompt" or general keywords)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();

          // Check for syntax tokens
          if (q.startsWith('name:')) {
            const target = q.replace('name:', '').trim();
            return app.name.toLowerCase().includes(target);
          }
          if (q.startsWith('ver:') || q.startsWith('version:')) {
            const target = q.replace(/^(ver:|version:)/, '').trim().replace(/^v/, '');
            return app.version.toLowerCase().includes(target) || app.tag.toLowerCase().includes(target);
          }
          if (q.startsWith('desc:') || q.startsWith('keyword:')) {
            const target = q.replace(/^(desc:|keyword:)/, '').trim();
            return (
              app.description.toLowerCase().includes(target) ||
              app.releaseNotes.toLowerCase().includes(target)
            );
          }
          if (q.startsWith('cat:')) {
            const target = q.replace('cat:', '').trim();
            return app.category.toLowerCase().includes(target);
          }

          // General multi-field keyword search
          const matchesGeneral =
            app.name.toLowerCase().includes(q) ||
            app.description.toLowerCase().includes(q) ||
            app.version.toLowerCase().includes(q) ||
            (app.packageName && app.packageName.toLowerCase().includes(q)) ||
            app.category.toLowerCase().includes(q) ||
            app.releaseNotes.toLowerCase().includes(q);

          if (!matchesGeneral) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        if (sortBy === 'rating') {
          const rA = a.rating || 0;
          const rB = b.rating || 0;
          if (rB !== rA) return rB - rA;
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'downloads') {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'size-desc') {
          return b.apkSize - a.apkSize;
        }
        if (sortBy === 'size-asc') {
          return a.apkSize - b.apkSize;
        }
        return 0;
      });
  }, [
    apps,
    selectedCategory,
    searchQuery,
    sortBy,
    nameFilter,
    keywordFilter,
    versionFilter,
    dateRange,
    minRating
  ]);

  return (
    <section id="catalogue" className="py-16 bg-[#080c14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>APK Distribution Feed</span>
              <span aria-hidden="true">·</span>
              <span>{filteredApps.length} apps match criteria</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Application Catalogue
            </h2>
          </div>

          {/* Mode Switch & Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePreviewMode}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1.5 ${
                isPreviewMode
                  ? 'bg-blue-950/60 border-blue-600/60 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle between Live GitHub Feed and UI Preview Sample Apps"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPreviewMode ? 'Preview Mode Active' : 'Show Preview Apps'}</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing || isLoading}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh release feed"
              aria-label="Refresh catalogue"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Tabs (Segmented control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Search & Sort Bar */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, keyword, version (e.g. 'smart', 'v1.4', 'name:prompt')..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Criteria Dropdown */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              >
                <option value="newest">Release: Newest First</option>
                <option value="oldest">Release: Oldest First</option>
                <option value="rating">Rating: Highest Rated ★</option>
                <option value="downloads">Downloads: Most Downloaded</option>
                <option value="name-asc">App Name: A to Z</option>
                <option value="name-desc">App Name: Z to A</option>
                <option value="size-desc">APK Size: Largest First</option>
                <option value="size-asc">APK Size: Smallest First</option>
              </select>
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-10 px-3 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                showAdvancedFilters || hasActiveAdvancedFilters
                  ? 'bg-blue-950/60 border-blue-600/70 text-blue-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Advanced Queries</span>
              {hasActiveAdvancedFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              )}
              {showAdvancedFilters ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 shrink-0 h-10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Query & Filter Panel */}
        {showAdvancedFilters && (
          <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-xl mb-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">Advanced Search & Multi-Field Query Builder</span>
              </div>
              {hasActiveAdvancedFilters && (
                <button
                  onClick={resetFilters}
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              {/* App Name Filter */}
              <div>
                <label className="block text-slate-400 mb-1">Filter by App Name</label>
                <input
                  type="text"
                  placeholder="e.g. SmartPrompt"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full h-8 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Keyword in Description Filter */}
              <div>
                <label className="block text-slate-400 mb-1">Description Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. offline, markdown, token"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="w-full h-8 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Version Filter */}
              <div>
                <label className="block text-slate-400 mb-1">Target Version</label>
                <input
                  type="text"
                  placeholder="e.g. 1.0 or 1.4"
                  value={versionFilter}
                  onChange={(e) => setVersionFilter(e.target.value)}
                  className="w-full h-8 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Date Range Selector */}
              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Release Date Range</span>
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="365d">Past Year (365d)</option>
                </select>
              </div>
            </div>

            {/* Minimum Rating Selector & Quick Query Syntax Tips */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Minimum Rating:</span>
                {[0, 4.0, 4.5, 4.8].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setMinRating(score)}
                    className={`px-2 py-1 rounded text-[11px] border transition-colors flex items-center gap-1 ${
                      minRating === score
                        ? 'bg-amber-950/80 border-amber-600/70 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {score === 0 ? (
                      'Any'
                    ) : (
                      <>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{score}+</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-500">
                Tip: Search supports prefix syntax: <code className="text-blue-400">name:tool</code>, <code className="text-blue-400">ver:1.0</code>, <code className="text-blue-400">cat:ai</code>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification if any */}
        {error && (
          <div className="mb-8 p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">GitHub Sync Notice</span>
              {error}
            </div>
            <button
              onClick={onRefresh}
              className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 border border-amber-700/80 rounded font-medium text-[11px] shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl animate-pulse flex flex-col justify-between h-64"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-850 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-800 rounded" />
                  <div className="h-3 bg-slate-800 rounded w-5/6" />
                </div>
                <div className="h-9 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State: When no apps match */}
        {!isLoading && filteredApps.length === 0 && (
          <div className="p-10 border border-slate-800 rounded-2xl bg-slate-900/30 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Github className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {apps.length === 0 ? 'No Releases in GitHub Repository Yet' : 'No Matching Applications Found'}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {apps.length === 0 ? (
                <>
                  The dedicated APK repository <code className="text-blue-400">isaiahdenyefa1-cmyk/isaiahaihub-apps</code> is currently empty or preparing its first release. When a release with an eligible <code className="text-blue-300">.apk</code> asset is published, it will automatically populate here!
                </>
              ) : (
                'No applications match your active search criteria, version constraint, or category filters. Try clearing some query parameters or resetting filters.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {apps.length === 0 ? (
                <button
                  onClick={onTogglePreviewMode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Show Sample Preview Apps</span>
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              )}

              <a
                href="https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Visit GitHub Releases</span>
              </a>
            </div>
          </div>
        )}

        {/* Apps Grid or List */}
        {!isLoading && filteredApps.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onSelect={onSelectApp}
                onDownloadClick={onDownloadClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

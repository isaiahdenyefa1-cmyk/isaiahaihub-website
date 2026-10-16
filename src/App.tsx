import React, { useState, useEffect, useCallback } from 'react';
import type { NormalizedApp, AppsApiResponse, AppRatingSummary } from './types/app.js';
import { SAMPLE_PREVIEW_APPS } from './data/mockPreviewApps.js';
import { Header } from './components/Header.js';
import { HeroSection } from './components/HeroSection.js';
import { AppCatalogue } from './components/AppCatalogue.js';
import { AppDetailModal } from './components/AppDetailModal.js';
import { InstallGuideSection } from './components/InstallGuideSection.js';
import { AboutSection } from './components/AboutSection.js';
import { PrivacySupportSection } from './components/PrivacySupportSection.js';
import { ApiDiagnosticsDrawer } from './components/ApiDiagnosticsDrawer.js';
import { Footer } from './components/Footer.js';

export default function App() {
  const [liveApps, setLiveApps] = useState<NormalizedApp[]>([]);
  const [previewApps, setPreviewApps] = useState<NormalizedApp[]>(SAMPLE_PREVIEW_APPS);
  const [apiResponse, setApiResponse] = useState<AppsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedApp, setSelectedApp] = useState<NormalizedApp | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const fetchCatalog = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const url = forceRefresh ? '/api/apps?refresh=true' : '/api/apps';
      const res = await fetch(url);
      const data: AppsApiResponse = await res.json();

      setApiResponse(data);
      if (data.success) {
        setLiveApps(data.apps);
        setError(data.error);
      } else {
        setError(data.error || 'Failed to fetch application catalogue from GitHub.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(`Unable to connect to catalogue API: ${msg}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog(false);
  }, [fetchCatalog]);

  // Track download clicks & increment counter
  const handleDownloadClick = async (app: NormalizedApp) => {
    // Optimistic UI update for both lists
    const updater = (item: NormalizedApp) =>
      item.id === app.id
        ? { ...item, downloadCount: (item.downloadCount || 0) + 1 }
        : item;

    setLiveApps((prev) => prev.map(updater));
    setPreviewApps((prev) => prev.map(updater));
    if (selectedApp && selectedApp.id === app.id) {
      setSelectedApp((prev) => prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : null);
    }

    try {
      await fetch(`/api/apps/${encodeURIComponent(app.id)}/download`, {
        method: 'POST'
      });
    } catch (err) {
      console.warn('Could not record download metric:', err);
    }
  };

  // Sync ratings and reviews submitted by user
  const handleAppMetricsUpdated = (appId: string, summary: AppRatingSummary) => {
    const updater = (item: NormalizedApp) =>
      item.id === appId
        ? {
            ...item,
            rating: summary.averageRating,
            reviewCount: summary.totalReviews,
            downloadCount: summary.downloadCount
          }
        : item;

    setLiveApps((prev) => prev.map(updater));
    setPreviewApps((prev) => prev.map(updater));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              rating: summary.averageRating,
              reviewCount: summary.totalReviews,
              downloadCount: summary.downloadCount
            }
          : null
      );
    }
  };

  // Displayed apps: if preview mode is explicitly toggled, or if live repo has 0 apps and user activates preview
  const displayedApps = isPreviewMode
    ? [...liveApps, ...previewApps]
    : liveApps;

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Header onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          totalApps={displayedApps.length}
          isLiveRepo={!isPreviewMode}
          onExplore={() => handleNavigate('catalogue')}
          onOpenGuide={() => handleNavigate('guide')}
          onRefresh={() => fetchCatalog(true)}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Searchable App Catalogue */}
        <AppCatalogue
          apps={displayedApps}
          isLoading={isLoading}
          error={error}
          onRefresh={() => fetchCatalog(true)}
          isRefreshing={isRefreshing}
          onSelectApp={(app) => setSelectedApp(app)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isPreviewMode={isPreviewMode}
          onTogglePreviewMode={() => setIsPreviewMode((prev) => !prev)}
          onDownloadClick={handleDownloadClick}
        />

        {/* Android Sideloading & Installation Walkthrough */}
        <InstallGuideSection onBrowseCatalogue={() => handleNavigate('catalogue')} />

        {/* About IsaiahAIhub & Creator Principles */}
        <AboutSection />

        {/* Privacy, Security & Support */}
        <PrivacySupportSection />
      </main>

      {/* Developer Diagnostics & API Live Inspector */}
      <ApiDiagnosticsDrawer
        apiResponse={apiResponse}
        onRefresh={() => fetchCatalog(true)}
        isRefreshing={isRefreshing}
      />

      {/* Quiet Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modal: App Detail View */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onOpenGuide={() => handleNavigate('guide')}
        onDownloadClick={handleDownloadClick}
        onAppMetricsUpdated={handleAppMetricsUpdated}
      />
    </div>
  );
}

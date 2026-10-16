export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  html_url: string;
  assets: GitHubAsset[];
}

export type AppCategory =
  | 'Developer Tools'
  | 'AI Utilities'
  | 'Creator Tools'
  | 'Productivity'
  | 'System & Utilities'
  | 'Media & Audio'
  | 'Security & Privacy'
  | 'General';

export interface NormalizedApp {
  id: string; // unique slug or tag e.g. "app-1001" or "smartprompt"
  releaseId: number;
  name: string;
  tag: string;
  version: string;
  publishedAt: string;
  description: string;
  releaseNotes: string;
  apkFileName: string;
  apkSize: number;
  apkSizeFormatted: string;
  downloadUrl: string;
  category: AppCategory;
  minAndroidVersion?: string;
  packageName?: string;
  sha256?: string;
  iconUrl?: string;
  screenshots?: string[];
  isNew: boolean;
  isUpdated: boolean;
  // Community metrics
  rating?: number;
  reviewCount?: number;
  downloadCount?: number;
}

export interface AppReview {
  id: string;
  appId: string;
  reviewerName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  version: string;
  createdAt: string;
}

export interface AppRatingSummary {
  appId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  downloadCount: number;
}

export interface AmbiguousReleaseReport {
  releaseId: number;
  releaseName: string;
  tag: string;
  reason: string;
  candidateAssets: string[];
}

export interface AppsApiResponse {
  success: boolean;
  apps: NormalizedApp[];
  meta: {
    totalApps: number;
    repository: string;
    repoUrl: string;
    fetchedAt: string;
    cached: boolean;
    cacheAgeSeconds: number;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
    isStaleFallback?: boolean;
    ambiguousReleases?: AmbiguousReleaseReport[];
    excludedReleasesCount: number;
  };
  error?: string;
}

export interface ReviewsApiResponse {
  success: boolean;
  appId: string;
  summary: AppRatingSummary;
  reviews: AppReview[];
  error?: string;
}

export interface SearchFilterState {
  query: string;
  nameOnly?: string;
  keyword?: string;
  version?: string;
  category: string;
  dateRange: 'all' | '7d' | '30d' | '90d' | '365d';
  minRating: number;
  sortBy: 'newest' | 'oldest' | 'rating' | 'downloads' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
}

import type {
  GitHubRelease,
  GitHubAsset,
  NormalizedApp,
  AmbiguousReleaseReport,
  AppsApiResponse
} from '../src/types/app.js';
import { getAllSummaries } from './reviewService.js';

export const GITHUB_REPO_OWNER = 'isaiahdenyefa1-cmyk';
export const GITHUB_REPO_NAME = 'isaiahaihub-apps';
export const CANONICAL_REPO_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
export const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
export const EXPECTED_DOWNLOAD_PREFIX = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/download/`;

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
const MIN_REFRESH_INTERVAL_MS = 15 * 1000; // 15 seconds rate throttle for manual refresh

interface CacheEntry {
  data: AppsApiResponse;
  timestamp: number;
}

let memoryCache: CacheEntry | null = null;
let lastFetchAttemptTimestamp = 0;

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validates an APK asset according to strict release-ready criteria.
 * Excludes debug, unsigned, unaligned, test, and snapshot builds.
 */
export function isEligibleApkAsset(asset: GitHubAsset): { eligible: boolean; reason?: string } {
  const name = asset.name.trim();

  // Must end with .apk
  if (!name.toLowerCase().endsWith('.apk')) {
    return { eligible: false, reason: 'Not an .apk file extension' };
  }

  // Must not contain banned keywords indicating non-production builds
  const nonProdPattern = /(-|_|\.)(debug|unsigned|unaligned|test|androidTest|snapshot|dev|staging)($|-|_|\.)/i;
  if (nonProdPattern.test(name)) {
    return { eligible: false, reason: 'Non-production build marker (debug/unsigned/unaligned/test)' };
  }

  // Validate size (> 0 and < 500 MB)
  if (asset.size <= 0) {
    return { eligible: false, reason: 'Invalid file size (0 bytes)' };
  }
  const maxBytes = 500 * 1024 * 1024; // 500 MB
  if (asset.size > maxBytes) {
    return { eligible: false, reason: 'File size exceeds 500 MB sanity limit' };
  }

  // Validate download URL structure against official GitHub release asset pattern
  if (!asset.browser_download_url || !asset.browser_download_url.startsWith(EXPECTED_DOWNLOAD_PREFIX)) {
    return { eligible: false, reason: 'Download URL does not match canonical GitHub release asset domain' };
  }

  return { eligible: true };
}

/**
 * Deterministic APK selection rule for a release.
 * If multiple production APK assets exist, checks for unambiguous priority or reports ambiguity.
 */
export function selectReleaseApk(
  release: GitHubRelease
): { asset: GitHubAsset | null; error?: string; candidateNames?: string[] } {
  if (!release.assets || release.assets.length === 0) {
    return { asset: null, error: 'No assets found in release' };
  }

  const eligibleAssets = release.assets.filter((a) => isEligibleApkAsset(a).eligible);

  if (eligibleAssets.length === 0) {
    return { asset: null, error: 'No eligible production APK assets found' };
  }

  if (eligibleAssets.length === 1) {
    return { asset: eligibleAssets[0] };
  }

  // Multiple eligible APKs found: check if one exactly matches the standard convention:
  // e.g. <AppName>-v<tag>.apk or <AppName>-release.apk
  const tagClean = release.tag_name.replace(/^v/i, '');
  const exactTagMatches = eligibleAssets.filter((a) =>
    a.name.toLowerCase().includes(tagClean.toLowerCase()) ||
    a.name.toLowerCase().endsWith('-release.apk')
  );

  if (exactTagMatches.length === 1) {
    return { asset: exactTagMatches[0] };
  }

  // Multiple plausible production APKs with no deterministic winner
  return {
    asset: null,
    error: 'Ambiguous release: multiple production APK assets detected without deterministic match',
    candidateNames: eligibleAssets.map((a) => a.name)
  };
}

/**
 * Parses optional metadata from release markdown body
 */
export function parseReleaseMetadata(body: string | null) {
  const result: {
    cleanDescription: string;
    category: NormalizedApp['category'];
    minAndroidVersion?: string;
    packageName?: string;
    sha256?: string;
    iconUrl?: string;
    screenshots?: string[];
  } = {
    cleanDescription: '',
    category: 'Developer Tools'
  };

  if (!body) {
    result.cleanDescription = 'No detailed release notes provided.';
    return result;
  }

  const lines = body.split('\n');
  const contentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check key-value headers
    const categoryMatch = trimmed.match(/^(?:Category|Type):\s*(.+)$/i);
    if (categoryMatch) {
      const cat = categoryMatch[1].trim().toLowerCase();
      if (cat.includes('ai')) result.category = 'AI Utilities';
      else if (cat.includes('dev') || cat.includes('code')) result.category = 'Developer Tools';
      else if (cat.includes('creator') || cat.includes('content')) result.category = 'Creator Tools';
      else if (cat.includes('productiv') || cat.includes('task')) result.category = 'Productivity';
      else if (cat.includes('system') || cat.includes('util')) result.category = 'System & Utilities';
      else if (cat.includes('media') || cat.includes('audio') || cat.includes('video')) result.category = 'Media & Audio';
      else if (cat.includes('security') || cat.includes('privacy')) result.category = 'Security & Privacy';
      continue;
    }

    const minAndroidMatch = trimmed.match(/^(?:Min(?:imum)?\s*Android|Android\s*Req(?:uired)?):\s*(.+)$/i);
    if (minAndroidMatch) {
      result.minAndroidVersion = minAndroidMatch[1].trim();
      continue;
    }

    const packageMatch = trimmed.match(/^(?:Package(?:\s*Name)?|App\s*ID):\s*([a-zA-Z0-9._]+)$/i);
    if (packageMatch) {
      result.packageName = packageMatch[1].trim();
      continue;
    }

    const sha256Match = trimmed.match(/^(?:SHA-?256|Checksum):\s*([a-fA-F0-9]{64})$/i);
    if (sha256Match) {
      result.sha256 = sha256Match[1].trim();
      continue;
    }

    const iconMatch = trimmed.match(/^(?:Icon):\s*(https:\/\/[^\s]+)$/i);
    if (iconMatch) {
      result.iconUrl = iconMatch[1].trim();
      continue;
    }

    contentLines.push(line);
  }

  const rawClean = contentLines.join('\n').trim();
  // Provide a concise 1-2 sentence description if available
  const firstParagraph = rawClean.split(/\n\s*\n/)[0]?.replace(/^[#*>\s]+/, '').trim();
  result.cleanDescription = firstParagraph && firstParagraph.length > 5
    ? firstParagraph.slice(0, 240)
    : 'Android productivity tool published by IsaiahAIhub.';

  return result;
}

/**
 * Normalizes a raw GitHub release into a stable NormalizedApp object.
 * Returns null if the release should be excluded (draft, prerelease, or no APK).
 */
export function normalizeRelease(
  release: GitHubRelease
): { app: NormalizedApp | null; ambiguousReport?: AmbiguousReleaseReport } {
  // Exclude drafts and prereleases
  if (release.draft || release.prerelease) {
    return { app: null };
  }

  // APK Selection
  const apkSelection = selectReleaseApk(release);

  if (apkSelection.error && apkSelection.candidateNames && apkSelection.candidateNames.length > 1) {
    return {
      app: null,
      ambiguousReport: {
        releaseId: release.id,
        releaseName: release.name || release.tag_name,
        tag: release.tag_name,
        reason: apkSelection.error,
        candidateAssets: apkSelection.candidateNames
      }
    };
  }

  if (!apkSelection.asset) {
    return { app: null };
  }

  const asset = apkSelection.asset;
  const metadata = parseReleaseMetadata(release.body);

  // App name extraction: Prefer release name without version suffix, or fallback to tag/asset
  let appName = (release.name || '').trim();
  if (!appName) {
    // Derive from asset name
    appName = asset.name.replace(/\.apk$/i, '').replace(/[-_]v?\d+(\.\d+)*.*$/i, '');
    if (!appName) appName = release.tag_name;
  }

  const version = release.tag_name.replace(/^v/i, '');
  const publishedAt = release.published_at || release.created_at;

  const publishedDate = new Date(publishedAt).getTime();
  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  const isNew = now - publishedDate <= fourteenDaysMs;

  const app: NormalizedApp = {
    id: `app-${release.id}`,
    releaseId: release.id,
    name: appName,
    tag: release.tag_name,
    version,
    publishedAt,
    description: metadata.cleanDescription,
    releaseNotes: release.body || 'No release notes specified.',
    apkFileName: asset.name,
    apkSize: asset.size,
    apkSizeFormatted: formatBytes(asset.size),
    downloadUrl: asset.browser_download_url,
    category: metadata.category,
    minAndroidVersion: metadata.minAndroidVersion,
    packageName: metadata.packageName,
    sha256: metadata.sha256,
    iconUrl: metadata.iconUrl,
    isNew,
    isUpdated: false
  };

  return { app };
}

/**
 * Fetches releases from GitHub API with caching, validation and error handling.
 */
export async function getAppsCatalog(forceRefresh = false): Promise<AppsApiResponse> {
  const now = Date.now();

  // Return cached data if fresh and refresh not forced
  if (!forceRefresh && memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    const ageSeconds = Math.round((now - memoryCache.timestamp) / 1000);
    return {
      ...memoryCache.data,
      meta: {
        ...memoryCache.data.meta,
        cached: true,
        cacheAgeSeconds: ageSeconds
      }
    };
  }

  // Rate-limiting throttle for forceRefresh to prevent hammering GitHub API
  if (forceRefresh && now - lastFetchAttemptTimestamp < MIN_REFRESH_INTERVAL_MS && memoryCache) {
    const ageSeconds = Math.round((now - memoryCache.timestamp) / 1000);
    return {
      ...memoryCache.data,
      meta: {
        ...memoryCache.data.meta,
        cached: true,
        cacheAgeSeconds: ageSeconds
      }
    };
  }

  lastFetchAttemptTimestamp = now;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'IsaiahAIhub-Website/1.0.0'
  };

  // Optional authenticated token for higher rate limits if configured in .env
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      method: 'GET',
      headers
    });

    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
      ? parseInt(response.headers.get('x-ratelimit-remaining')!, 10)
      : null;
    const rateLimitReset = response.headers.get('x-ratelimit-reset')
      ? parseInt(response.headers.get('x-ratelimit-reset')!, 10)
      : null;

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError = `GitHub API HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 403 || response.status === 429) {
        parsedError = 'GitHub API rate limit exceeded. Please wait a moment or configure GITHUB_TOKEN.';
      } else if (response.status === 404) {
        parsedError = `Repository ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME} not found or is private.`;
      }

      // If we have stale cache, serve it as safe fallback
      if (memoryCache) {
        return {
          ...memoryCache.data,
          meta: {
            ...memoryCache.data.meta,
            cached: true,
            isStaleFallback: true,
            rateLimitRemaining,
            rateLimitReset
          },
          error: parsedError
        };
      }

      return {
        success: false,
        apps: [],
        meta: {
          totalApps: 0,
          repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
          repoUrl: CANONICAL_REPO_URL,
          fetchedAt: new Date().toISOString(),
          cached: false,
          cacheAgeSeconds: 0,
          rateLimitRemaining,
          rateLimitReset,
          excludedReleasesCount: 0
        },
        error: parsedError
      };
    }

    const rawReleases: GitHubRelease[] = await response.json();
    if (!Array.isArray(rawReleases)) {
      throw new Error('Unexpected GitHub API response structure: expected array of releases');
    }

    const apps: NormalizedApp[] = [];
    const ambiguousReports: AmbiguousReleaseReport[] = [];
    let excludedCount = 0;

    for (const release of rawReleases) {
      const { app, ambiguousReport } = normalizeRelease(release);
      if (app) {
        apps.push(app);
      } else {
        excludedCount++;
        if (ambiguousReport) {
          ambiguousReports.push(ambiguousReport);
        }
      }
    }

    // Attach community metrics (ratings & downloads)
    const summaries = getAllSummaries();
    for (const app of apps) {
      const summary = summaries[app.id] || summaries[app.tag] || summaries[app.name.toLowerCase()];
      if (summary) {
        app.rating = summary.averageRating;
        app.reviewCount = summary.totalReviews;
        app.downloadCount = summary.downloadCount;
      } else {
        app.rating = 0;
        app.reviewCount = 0;
        app.downloadCount = 0;
      }
    }

    // Sort apps by publication date descending (newest first)
    apps.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const result: AppsApiResponse = {
      success: true,
      apps,
      meta: {
        totalApps: apps.length,
        repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
        repoUrl: CANONICAL_REPO_URL,
        fetchedAt: new Date().toISOString(),
        cached: false,
        cacheAgeSeconds: 0,
        rateLimitRemaining,
        rateLimitReset,
        ambiguousReleases: ambiguousReports.length > 0 ? ambiguousReports : undefined,
        excludedReleasesCount: excludedCount
      }
    };

    memoryCache = {
      data: result,
      timestamp: now
    };

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error fetching GitHub releases';

    if (memoryCache) {
      return {
        ...memoryCache.data,
        meta: {
          ...memoryCache.data.meta,
          cached: true,
          isStaleFallback: true
        },
        error: `Temporary GitHub connection failure. Showing safe cached catalogue: ${message}`
      };
    }

    return {
      success: false,
      apps: [],
      meta: {
        totalApps: 0,
        repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
        repoUrl: CANONICAL_REPO_URL,
        fetchedAt: new Date().toISOString(),
        cached: false,
        cacheAgeSeconds: 0,
        rateLimitRemaining: null,
        rateLimitReset: null,
        excludedReleasesCount: 0
      },
      error: message
    };
  }
}

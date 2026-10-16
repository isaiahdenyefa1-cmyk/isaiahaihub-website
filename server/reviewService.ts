import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AppReview, AppRatingSummary } from '../src/types/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const DOWNLOADS_FILE = path.join(DATA_DIR, 'downloads.json');

// In-memory cache & fallback storage
let inMemoryReviews: AppReview[] = [];
let inMemoryDownloads: Record<string, number> = {};

// Initial seed reviews for rich user experience and test verification
const SEED_REVIEWS: AppReview[] = [
  {
    id: 'rev-seed-1',
    appId: 'preview-smartprompt',
    reviewerName: 'Marcus T. (Android Dev)',
    rating: 5,
    title: 'Indispensable for prompt testing',
    comment: 'The offline token estimation and prompt diffing save me tons of API trial costs. UI is super smooth on Android 14.',
    version: '1.4.0',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-seed-2',
    appId: 'preview-smartprompt',
    reviewerName: 'Aisha K.',
    rating: 5,
    title: 'Fast and zero bloat',
    comment: 'Exactly what I wanted: no sign-in wall, clean markdown exports, and works without an internet connection.',
    version: '1.3.0',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-seed-3',
    appId: 'preview-smartprompt',
    reviewerName: 'Devon G.',
    rating: 4,
    title: 'Great utility, would love widgets',
    comment: 'Solid tool. Hope to see homescreen quick-prompt capture widgets in the next update.',
    version: '1.4.0',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-seed-4',
    appId: 'preview-devtoken',
    reviewerName: 'Elena R.',
    rating: 5,
    title: 'Precise multi-model costs',
    comment: 'Very helpful when architecting multi-agent flows with mixed token windows.',
    version: '2.0.1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-seed-5',
    appId: 'preview-mediaforge',
    reviewerName: 'Julian C. (Creator)',
    rating: 5,
    title: 'Local AVIF conversion is lightning fast',
    comment: 'Batch converting images directly on device without uploading sensitive unreleased media is a gamechanger.',
    version: '1.1.0',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_DOWNLOADS: Record<string, number> = {
  'preview-smartprompt': 284,
  'preview-devtoken': 195,
  'preview-mediaforge': 142,
  'preview-quicklog': 89
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create data directory, using in-memory store:', err);
  }
}

function loadData() {
  ensureDataDir();

  // Load Reviews
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const content = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      inMemoryReviews = JSON.parse(content);
    } else {
      inMemoryReviews = [...SEED_REVIEWS];
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(inMemoryReviews, null, 2), 'utf-8');
    }
  } catch {
    inMemoryReviews = [...SEED_REVIEWS];
  }

  // Load Downloads
  try {
    if (fs.existsSync(DOWNLOADS_FILE)) {
      const content = fs.readFileSync(DOWNLOADS_FILE, 'utf-8');
      inMemoryDownloads = JSON.parse(content);
    } else {
      inMemoryDownloads = { ...SEED_DOWNLOADS };
      fs.writeFileSync(DOWNLOADS_FILE, JSON.stringify(inMemoryDownloads, null, 2), 'utf-8');
    }
  } catch {
    inMemoryDownloads = { ...SEED_DOWNLOADS };
  }
}

// Initialize on module load
loadData();

function persistReviews() {
  try {
    ensureDataDir();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(inMemoryReviews, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Persisting reviews to disk failed (operating in memory):', err);
  }
}

function persistDownloads() {
  try {
    ensureDataDir();
    fs.writeFileSync(DOWNLOADS_FILE, JSON.stringify(inMemoryDownloads, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Persisting downloads to disk failed (operating in memory):', err);
  }
}

function sanitizeText(str: string, maxLength: number): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // strip dangerous tags
    .trim()
    .slice(0, maxLength);
}

export function getAppReviews(appId: string): { summary: AppRatingSummary; reviews: AppReview[] } {
  // Normalize app ID match
  const appReviews = inMemoryReviews
    .filter((r) => r.appId.toLowerCase() === appId.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalScore = 0;

  for (const rev of appReviews) {
    const star = Math.min(5, Math.max(1, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star]++;
    totalScore += rev.rating;
  }

  const totalReviews = appReviews.length;
  const averageRating = totalReviews > 0 ? parseFloat((totalScore / totalReviews).toFixed(1)) : 0;
  const downloadCount = inMemoryDownloads[appId] || 0;

  return {
    summary: {
      appId,
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
      downloadCount
    },
    reviews: appReviews
  };
}

export function getAllSummaries(): Record<string, AppRatingSummary> {
  const result: Record<string, AppRatingSummary> = {};

  // Group all reviews
  const appIds = new Set<string>();
  inMemoryReviews.forEach((r) => appIds.add(r.appId));
  Object.keys(inMemoryDownloads).forEach((id) => appIds.add(id));

  for (const appId of appIds) {
    result[appId] = getAppReviews(appId).summary;
  }

  return result;
}

export function addAppReview(params: {
  appId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  version?: string;
  title?: string;
}): { success: boolean; review?: AppReview; error?: string } {
  const appId = sanitizeText(params.appId, 100);
  const reviewerName = sanitizeText(params.reviewerName, 60);
  const comment = sanitizeText(params.comment, 2000);
  const title = sanitizeText(params.title || '', 120);
  const version = sanitizeText(params.version || '1.0.0', 30);
  const rating = Number(params.rating);

  if (!appId) {
    return { success: false, error: 'App ID is required' };
  }
  if (!reviewerName || reviewerName.length < 2) {
    return { success: false, error: 'Reviewer name must be at least 2 characters' };
  }
  if (!comment || comment.length < 5) {
    return { success: false, error: 'Review comment must be at least 5 characters' };
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be an integer between 1 and 5' };
  }

  const newReview: AppReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    appId,
    reviewerName,
    rating: Math.round(rating),
    title: title || undefined,
    comment,
    version,
    createdAt: new Date().toISOString()
  };

  inMemoryReviews.unshift(newReview);
  persistReviews();

  return { success: true, review: newReview };
}

export function trackDownload(appId: string): number {
  const cleanId = sanitizeText(appId, 100);
  const current = inMemoryDownloads[cleanId] || 0;
  const updated = current + 1;
  inMemoryDownloads[cleanId] = updated;
  persistDownloads();
  return updated;
}

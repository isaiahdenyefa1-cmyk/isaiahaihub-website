import {
  isEligibleApkAsset,
  selectReleaseApk,
  normalizeRelease,
  parseReleaseMetadata,
  formatBytes,
  EXPECTED_DOWNLOAD_PREFIX
} from '../server/githubService.js';
import type { GitHubRelease, GitHubAsset } from '../src/types/app.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('--- RUNNING RELEASE PARSER & NORMALIZATION TEST SUITE ---');

// Test 1: Normalized release data
console.log('\n[Test 1] Normalized release data');
const validAsset: GitHubAsset = {
  id: 101,
  name: 'IsaiahAIhub-v1.0.0.apk',
  size: 15 * 1024 * 1024,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/IsaiahAIhub-v1.0.0.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};

const validRelease: GitHubRelease = {
  id: 1001,
  tag_name: 'v1.0.0',
  name: 'IsaiahAIhub Toolkit v1.0.0',
  body: 'Category: Developer Tools\nMin Android: Android 8.0 (API 26)\nPackage: com.isaiahaihub.toolkit\nSHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\nHigh-performance productivity utility for developers and AI creators.',
  draft: false,
  prerelease: false,
  created_at: '2026-10-01T12:00:00Z',
  published_at: '2026-10-01T12:00:00Z',
  html_url: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/tag/v1.0.0',
  assets: [validAsset]
};

const normResult = normalizeRelease(validRelease);
assert(normResult.app !== null, 'Valid release normalizes successfully');
assert(normResult.app?.name === 'IsaiahAIhub Toolkit v1.0.0', 'App name extracted from release name');
assert(normResult.app?.version === '1.0.0', 'Version tag normalized (leading v stripped)');
assert(normResult.app?.category === 'Developer Tools', 'Category extracted from release body');
assert(normResult.app?.minAndroidVersion === 'Android 8.0 (API 26)', 'Min Android version parsed');
assert(normResult.app?.packageName === 'com.isaiahaihub.toolkit', 'Package name parsed');
assert(normResult.app?.sha256 === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'SHA-256 checksum extracted');
assert(normResult.app?.apkFileName === 'IsaiahAIhub-v1.0.0.apk', 'APK file name captured');
assert(normResult.app?.apkSizeFormatted === '15 MB', 'APK size correctly formatted');

// Test 2: Draft and Prerelease exclusion
console.log('\n[Test 2] Draft and Prerelease exclusion');
const draftRelease: GitHubRelease = { ...validRelease, id: 1002, draft: true };
const prerelease: GitHubRelease = { ...validRelease, id: 1003, prerelease: true };

assert(normalizeRelease(draftRelease).app === null, 'Draft release is strictly excluded');
assert(normalizeRelease(prerelease).app === null, 'Prerelease is strictly excluded');

// Test 3: Releases without APKs
console.log('\n[Test 3] Releases without APKs');
const noAssetRelease: GitHubRelease = { ...validRelease, id: 1004, assets: [] };
const zipOnlyAsset: GitHubAsset = {
  id: 102,
  name: 'source-code.zip',
  size: 500000,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/source-code.zip`,
  content_type: 'application/zip',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const nonApkRelease: GitHubRelease = { ...validRelease, id: 1005, assets: [zipOnlyAsset] };

assert(normalizeRelease(noAssetRelease).app === null, 'Empty assets release is excluded');
assert(normalizeRelease(nonApkRelease).app === null, 'Release without .apk asset is excluded');

// Test 4: Ambiguous APK assets
console.log('\n[Test 4] Ambiguous APK assets');
const ambiguousAsset1: GitHubAsset = {
  id: 103,
  name: 'app-arm64.apk',
  size: 14 * 1024 * 1024,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/app-arm64.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const ambiguousAsset2: GitHubAsset = {
  id: 104,
  name: 'app-x86_64.apk',
  size: 15 * 1024 * 1024,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/app-x86_64.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const ambiguousRelease: GitHubRelease = {
  ...validRelease,
  id: 1006,
  assets: [ambiguousAsset1, ambiguousAsset2]
};

const ambigResult = normalizeRelease(ambiguousRelease);
assert(ambigResult.app === null, 'Ambiguous release with multiple unmatched APKs is excluded from live app list');
assert(ambigResult.ambiguousReport !== undefined, 'Ambiguous release report generated');
assert(ambigResult.ambiguousReport?.candidateAssets.length === 2, 'Ambiguous candidate assets identified');

// Test 5: Invalid filenames and URLs
console.log('\n[Test 5] Invalid filenames and URLs');
const debugAsset: GitHubAsset = {
  id: 105,
  name: 'app-debug.apk',
  size: 10 * 1024 * 1024,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/app-debug.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const unsignedAsset: GitHubAsset = {
  id: 106,
  name: 'myapp-unsigned.apk',
  size: 10 * 1024 * 1024,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/myapp-unsigned.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const badHostAsset: GitHubAsset = {
  id: 107,
  name: 'app-release.apk',
  size: 10 * 1024 * 1024,
  browser_download_url: 'https://malicious-external-site.com/app.apk',
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};
const zeroByteAsset: GitHubAsset = {
  id: 108,
  name: 'empty.apk',
  size: 0,
  browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v1.0.0/empty.apk`,
  content_type: 'application/vnd.android.package-archive',
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-01T12:00:00Z'
};

assert(!isEligibleApkAsset(debugAsset).eligible, 'app-debug.apk rejected as non-production');
assert(!isEligibleApkAsset(unsignedAsset).eligible, 'myapp-unsigned.apk rejected as non-production');
assert(!isEligibleApkAsset(badHostAsset).eligible, 'Non-canonical download URL rejected');
assert(!isEligibleApkAsset(zeroByteAsset).eligible, 'Zero-byte asset rejected');

// Test 6: Missing optional metadata
console.log('\n[Test 6] Missing optional metadata graceful fallbacks');
const bareRelease: GitHubRelease = {
  id: 1007,
  tag_name: 'v2.1.0',
  name: null,
  body: null,
  draft: false,
  prerelease: false,
  created_at: '2026-10-10T12:00:00Z',
  published_at: '2026-10-10T12:00:00Z',
  html_url: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/tag/v2.1.0',
  assets: [{
    id: 109,
    name: 'SmartPrompt-v2.1.0.apk',
    size: 8 * 1024 * 1024,
    browser_download_url: `${EXPECTED_DOWNLOAD_PREFIX}v2.1.0/SmartPrompt-v2.1.0.apk`,
    content_type: 'application/vnd.android.package-archive',
    created_at: '2026-10-10T12:00:00Z',
    updated_at: '2026-10-10T12:00:00Z'
  }]
};

const bareResult = normalizeRelease(bareRelease);
assert(bareResult.app !== null, 'Bare release without body normalizes safely');
assert(bareResult.app?.name === 'SmartPrompt', 'Name cleanly derived from APK file name');
assert(bareResult.app?.category === 'Developer Tools', 'Default fallback category assigned');
assert(bareResult.app?.description.length! > 0, 'Fallback description assigned');
assert(bareResult.app?.minAndroidVersion === undefined, 'Optional minAndroidVersion remains undefined without errors');

// Test 7: Byte formatting utility
console.log('\n[Test 7] Byte formatting verification');
assert(formatBytes(0) === '0 B', '0 bytes formats to 0 B');
assert(formatBytes(1024) === '1 KB', '1024 formats to 1 KB');
assert(formatBytes(15 * 1024 * 1024) === '15 MB', '15 MB formats cleanly');

// Test 8: Direct download URL safety
console.log('\n[Test 8] Direct download URL integrity');
assert(validAsset.browser_download_url.startsWith('https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/'), 'URL is directly on GitHub release storage');

// Test 9: Extended Category Parsing
console.log('\n[Test 9] Extended Category Parsing');
const systemMeta = parseReleaseMetadata('Category: System & Utilities\nApp to monitor sensors.');
const mediaMeta = parseReleaseMetadata('Category: Media & Audio\nLossless sound recorder.');
const secMeta = parseReleaseMetadata('Category: Security & Privacy\nOffline key authenticator.');

assert(systemMeta.category === 'System & Utilities', 'System & Utilities category parsed correctly');
assert(mediaMeta.category === 'Media & Audio', 'Media & Audio category parsed correctly');
assert(secMeta.category === 'Security & Privacy', 'Security & Privacy category parsed correctly');

// Test 10: Review and Rating Calculation
console.log('\n[Test 10] Review and Rating Calculation System');
const { getAppReviews, addAppReview, trackDownload } = await import('../server/reviewService.js');

const testAppId = `test-app-${Date.now()}`;
const initData = getAppReviews(testAppId);
assert(initData.summary.averageRating === 0, 'Initial unreviewed app has 0 average rating');
assert(initData.reviews.length === 0, 'Initial unreviewed app has 0 reviews');

// Add 5-star review
const rev1 = addAppReview({
  appId: testAppId,
  reviewerName: 'Alice',
  rating: 5,
  comment: 'Super fast and lightweight APK',
  version: '1.0.0'
});
assert(rev1.success === true, 'Review 1 added successfully');

// Add 4-star review
const rev2 = addAppReview({
  appId: testAppId,
  reviewerName: 'Bob',
  rating: 4,
  comment: 'Good UI, works as expected',
  version: '1.0.0'
});
assert(rev2.success === true, 'Review 2 added successfully');

// Add invalid review (should reject)
const invalidRev = addAppReview({
  appId: testAppId,
  reviewerName: '',
  rating: 6,
  comment: '',
  version: '1.0.0'
});
assert(invalidRev.success === false, 'Invalid review (rating 6, empty name) rejected');

const updatedReviews = getAppReviews(testAppId);
assert(updatedReviews.summary.totalReviews === 2, 'Total reviews count is 2');
assert(updatedReviews.summary.averageRating === 4.5, 'Average rating is 4.5 ((5+4)/2)');
assert(updatedReviews.summary.ratingDistribution[5] === 1, '5-star distribution is 1');
assert(updatedReviews.summary.ratingDistribution[4] === 1, '4-star distribution is 1');

// Test 11: Download Tracking System
console.log('\n[Test 11] Download Tracking System');
const count1 = trackDownload(testAppId);
const count2 = trackDownload(testAppId);
assert(count1 === 1, 'First download incremented count to 1');
assert(count2 === 2, 'Second download incremented count to 2');
assert(getAppReviews(testAppId).summary.downloadCount === 2, 'Download count reflected in summary');

console.log('\n---------------------------------------------------------');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
if (failed > 0) {
  process.exit(1);
}

import type { NormalizedApp } from '../types/app.js';

export const SAMPLE_PREVIEW_APPS: NormalizedApp[] = [
  {
    id: 'preview-smartprompt',
    releaseId: 9001,
    name: 'SmartPrompt Studio',
    tag: 'v1.4.0',
    version: '1.4.0',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Instant prompt engineering assistant and token optimizer for mobile developers and AI workflow creators.',
    releaseNotes: `### What's New in v1.4.0
- Added offline token cost estimator for Gemini 1.5 and 2.0 Flash models.
- Markdown export for prompt template vaults.
- Fast system prompt diff viewer.
- Reduced memory footprint on Android 12+.

Category: AI Utilities
Min Android: Android 8.0+ (API 26)
Package: com.isaiahaihub.smartprompt
SHA-256: 8a4c1472e38c919d7b43f05c4bbd725612f00a58ef3bbd2c18df56c39f0a91ea`,
    apkFileName: 'SmartPromptStudio-v1.4.0.apk',
    apkSize: 18874368,
    apkSizeFormatted: '18.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.4.0/SmartPromptStudio-v1.4.0.apk',
    category: 'AI Utilities',
    minAndroidVersion: 'Android 8.0+ (API 26)',
    packageName: 'com.isaiahaihub.smartprompt',
    sha256: '8a4c1472e38c919d7b43f05c4bbd725612f00a58ef3bbd2c18df56c39f0a91ea',
    isNew: true,
    isUpdated: false,
    rating: 4.8,
    reviewCount: 4,
    downloadCount: 284
  },
  {
    id: 'preview-devtoken',
    releaseId: 9002,
    name: 'DevToken Calculator',
    tag: 'v2.0.1',
    version: '2.0.1',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Real-time multi-model context window calculator and API cost projection for developer budgets.',
    releaseNotes: `### What's New in v2.0.1
- Updated pricing tables for current inference APIs.
- Quick copy to JSON format.
- Dark theme contrast enhancements.

Category: Developer Tools
Min Android: Android 7.0+ (API 24)
Package: com.isaiahaihub.devtoken
SHA-256: 3c9b78e12d4a6540b90eef5471d8820c7491d90f234ea769c8b7245037aeef08`,
    apkFileName: 'DevTokenCalculator-v2.0.1.apk',
    apkSize: 12582912,
    apkSizeFormatted: '12.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v2.0.1/DevTokenCalculator-v2.0.1.apk',
    category: 'Developer Tools',
    minAndroidVersion: 'Android 7.0+ (API 24)',
    packageName: 'com.isaiahaihub.devtoken',
    sha256: '3c9b78e12d4a6540b90eef5471d8820c7491d90f234ea769c8b7245037aeef08',
    isNew: true,
    isUpdated: false,
    rating: 5.0,
    reviewCount: 1,
    downloadCount: 195
  },
  {
    id: 'preview-mediaforge',
    releaseId: 9003,
    name: 'MediaAsset Forge',
    tag: 'v1.1.0',
    version: '1.1.0',
    publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Batch thumbnail resizer, EXIF cleaner, and web asset compressor designed for mobile content creators.',
    releaseNotes: `### What's New in v1.1.0
- Instant WebP and AVIF batch conversion on-device without cloud upload.
- Social media aspect ratio presets (16:9, 9:16, 1:1, 4:5).
- Privacy EXIF metadata stripping before publishing.

Category: Creator Tools
Min Android: Android 9.0+ (API 28)
Package: com.isaiahaihub.mediaforge
SHA-256: fa12d6a7839b4b01e2c94bb5f81a64f4340798eb4f9958bc563065a7fcdbb409`,
    apkFileName: 'MediaAssetForge-v1.1.0.apk',
    apkSize: 25165824,
    apkSizeFormatted: '24.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.1.0/MediaAssetForge-v1.1.0.apk',
    category: 'Creator Tools',
    minAndroidVersion: 'Android 9.0+ (API 28)',
    packageName: 'com.isaiahaihub.mediaforge',
    sha256: 'fa12d6a7839b4b01e2c94bb5f81a64f4340798eb4f9958bc563065a7fcdbb409',
    isNew: false,
    isUpdated: true,
    rating: 5.0,
    reviewCount: 1,
    downloadCount: 142
  },
  {
    id: 'preview-systempro',
    releaseId: 9004,
    name: 'DeviceSensor Pro',
    tag: 'v1.0.2',
    version: '1.0.2',
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Low-overhead real-time hardware telemetry, CPU thermal monitor, and refresh rate calibrator.',
    releaseNotes: `### What's New in v1.0.2
- Added per-core thermal throttling detection.
- Battery health cycle analysis.
- Clean floating widget with zero background power drain.

Category: System & Utilities
Min Android: Android 10.0+ (API 29)
Package: com.isaiahaihub.devicesensor
SHA-256: 4f89d311029ba8c715e44201889ab8c9d1234765109283748291038475839201`,
    apkFileName: 'DeviceSensorPro-v1.0.2.apk',
    apkSize: 9437184,
    apkSizeFormatted: '9.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.0.2/DeviceSensorPro-v1.0.2.apk',
    category: 'System & Utilities',
    minAndroidVersion: 'Android 10.0+ (API 29)',
    packageName: 'com.isaiahaihub.devicesensor',
    sha256: '4f89d311029ba8c715e44201889ab8c9d1234765109283748291038475839201',
    isNew: false,
    isUpdated: true,
    rating: 4.6,
    reviewCount: 5,
    downloadCount: 310
  },
  {
    id: 'preview-keyvault',
    releaseId: 9005,
    name: 'KeyVault Offline',
    tag: 'v1.2.0',
    version: '1.2.0',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Air-gapped 2FA authenticator and encrypted API credential vault using Android Hardware Keystore.',
    releaseNotes: `### What's New in v1.2.0
- Added biometric biometric-backed hardware key encryption.
- Encrypted QR code backup export.
- Strictly offline: zero internet permission in manifest.

Category: Security & Privacy
Min Android: Android 9.0+ (API 28)
Package: com.isaiahaihub.keyvault
SHA-256: 9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b`,
    apkFileName: 'KeyVaultOffline-v1.2.0.apk',
    apkSize: 11534336,
    apkSizeFormatted: '11.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.2.0/KeyVaultOffline-v1.2.0.apk',
    category: 'Security & Privacy',
    minAndroidVersion: 'Android 9.0+ (API 28)',
    packageName: 'com.isaiahaihub.keyvault',
    sha256: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    isNew: true,
    isUpdated: false,
    rating: 4.9,
    reviewCount: 8,
    downloadCount: 420
  },
  {
    id: 'preview-waveform',
    releaseId: 9006,
    name: 'Waveform VoiceStudio',
    tag: 'v1.0.0',
    version: '1.0.0',
    publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Ultra-low latency audio recorder with real-time spectrum analysis, lossless WAV export, and voice isolation.',
    releaseNotes: `### Initial Release v1.0.0
- High-fidelity 48kHz / 24-bit PCM recording.
- Real-time FFT audio visualizer.
- Voice memo tagging and noise gate filter.

Category: Media & Audio
Min Android: Android 8.0+ (API 26)
Package: com.isaiahaihub.voicestudio
SHA-256: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`,
    apkFileName: 'WaveformVoiceStudio-v1.0.0.apk',
    apkSize: 16777216,
    apkSizeFormatted: '16.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.0.0/WaveformVoiceStudio-v1.0.0.apk',
    category: 'Media & Audio',
    minAndroidVersion: 'Android 8.0+ (API 26)',
    packageName: 'com.isaiahaihub.voicestudio',
    sha256: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    isNew: false,
    isUpdated: false,
    rating: 4.5,
    reviewCount: 2,
    downloadCount: 98
  },
  {
    id: 'preview-quicklog',
    releaseId: 9007,
    name: 'LocalTask Runner',
    tag: 'v1.0.0',
    version: '1.0.0',
    publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Clean zero-cloud markdown task tracker and daily log runner with quick Android homescreen widgets.',
    releaseNotes: `### Release v1.0.0
- Initial public release of LocalTask Runner.
- Offline-first SQLite local storage.
- Markdown task syntax support with fast checkboxes.

Category: Productivity
Min Android: Android 8.0+ (API 26)
Package: com.isaiahaihub.localtask
SHA-256: 7d84a3b83909192809183884812f848912384912903840192840192840192834`,
    apkFileName: 'LocalTaskRunner-v1.0.0.apk',
    apkSize: 14680064,
    apkSizeFormatted: '14.0 MB',
    downloadUrl: 'https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps/releases/download/v1.0.0/LocalTaskRunner-v1.0.0.apk',
    category: 'Productivity',
    minAndroidVersion: 'Android 8.0+ (API 26)',
    packageName: 'com.isaiahaihub.localtask',
    sha256: '7d84a3b83909192809183884812f848912384912903840192840192840192834',
    isNew: false,
    isUpdated: false,
    rating: 4.7,
    reviewCount: 3,
    downloadCount: 112
  }
];

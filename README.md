# IsaiahAIhub — Automatic Android App Distribution Website

> "I build practical digital tools and resources that help developers, AI users and content creators work smarter."

IsaiahAIhub is a production-oriented platform for publishing and distributing Android APK applications. It automatically discovers Android `.apk` files published as GitHub Release assets in the dedicated public repository [`isaiahdenyefa1-cmyk/isaiahaihub-apps`](https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps).

When a new release is published, it appears immediately in the website catalogue without manually editing JSON files, changing code, or redeploying the website.

---

## 1. System Architecture & Features

This project includes:
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide icons.
- **Backend / API Engine**:
  - Server-side GitHub API release discovery service (`server/githubService.ts`) with in-memory caching (10-minute TTL), stale-while-revalidate fallbacks, and strict APK validation.
  - Review & Rating storage service (`server/reviewService.ts`) with disk persistence, rating distribution calculation, and download tracking.
- **Enhanced Search & Filtering**:
  - Universal keyword search across name, description, package, version, and release notes.
  - Prefix query syntax support: `name:<term>`, `ver:<term>`, `desc:<term>`, `cat:<term>`.
  - Advanced Query Builder drawer:
    - Specific App Name filter
    - Description keywords filter
    - Version filter (e.g. `1.0`, `1.4.0`)
    - Release Date Range: *All Time*, *Last 7 Days*, *Last 30 Days*, *Last 90 Days*, *Past Year*
    - Minimum Rating filter: *Any*, *4.0+*, *4.5+*, *4.8+*
  - Specific Categories:
    - `All`
    - `Developer Tools`
    - `AI Utilities`
    - `Creator Tools`
    - `Productivity`
    - `System & Utilities`
    - `Media & Audio`
    - `Security & Privacy`
  - Dynamic Sorting:
    - Release Date: *Newest First* / *Oldest First*
    - Rating: *Highest Rated ★*
    - Downloads: *Most Downloaded*
    - App Name: *A to Z* / *Z to A*
    - APK File Size: *Largest First* / *Smallest First*
- **App Review & Rating System**:
  - Interactive 1-to-5 star rating picker with hover feedback.
  - Submission form with name, optional headline, review feedback, and tested version.
  - Real-time rating average calculation & 5-star distribution progress bars.
  - Persistent storage in `data/reviews.json` with in-memory fallback.
  - Displayed both on App Cards (summary) and inside the App Detail modal (full reviews list).
- **Download Metrics**:
  - Direct download tracking via `POST /api/apps/:id/download`.
  - Persistent storage in `data/downloads.json`.

---

## 2. Needed Variables (Environment Variables)

Here are all variables needed for running IsaiahAIhub locally and in production:

| Variable Name | Required? | Default Value | Description |
|:---|:---:|:---:|:---|
| `GITHUB_TOKEN` | **Optional** | `""` (Empty) | GitHub Personal Access Token (classic `public_repo` or fine-grained read-only). Without this token, GitHub allows **60 requests/hour** per IP address. Setting this token increases your rate limit to **5,000 requests/hour**. Strictly server-side; never exposed to browser code. |
| `PORT` | **Optional** | `3000` | The network port the Node.js/Express server listens on during development and full-stack hosting. |
| `NODE_ENV` | **Optional** | `"development"` | Set to `"production"` when running a compiled full-stack deployment (`npm start`). |

---

## 3. Windows PowerShell Setup & Local Development

Run these commands in Windows PowerShell inside the project directory:

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure Environment (Optional)
Copy the example environment configuration:
```powershell
Copy-Item .env.example .env
```

### Step 3: Run the Automated Test Suite
Run the 44-case release parser, reviews, and validation test suite:
```powershell
npm test
```

### Step 4: Start the Development Server
```powershell
npm run dev
```
Open your browser to: **`http://localhost:3000`**

### Step 5: Test API Endpoints
In PowerShell, query the local API routes:
```powershell
# Get catalog with ratings & downloads
Invoke-RestMethod -Uri "http://localhost:3000/api/apps" | ConvertTo-Json -Depth 4

# Get reviews for an app
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews?appId=preview-smartprompt" | ConvertTo-Json -Depth 4

# Submit a review
$body = @{
    appId = "preview-smartprompt"
    reviewerName = "Marcus T."
    rating = 5
    title = "Excellent tool"
    comment = "Works seamlessly on Android 14."
    version = "1.4.0"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/reviews" -Method POST -Body $body -ContentType "application/json"
```

---

## 4. Pushing Website Source to GitHub (`isaiahaihub-website`)

Keep the website source repository separate from the APK binary repository:
- **APK Binary Repository**: `https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-apps`
- **Website Source Repository**: `https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-website`

Run these PowerShell commands to push this website source:

```powershell
# 1. Initialize git if not already initialized
git init

# 2. Add all source files (node_modules and dist are excluded via .gitignore)
git add .

# 3. Create initial commit
git commit -m "Add advanced search, review and rating system, and APK catalogue"

# 4. Set default branch to main
git branch -M main

# 5. Add remote origin (create the repository isaiahaihub-website on GitHub first)
git remote add origin https://github.com/isaiahdenyefa1-cmyk/isaiahaihub-website.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 5. Deploying to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: **`isaiahdenyefa1-cmyk/isaiahaihub-website`**.
4. Configure Project Settings:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* In **Environment Variables**, add:
   - `GITHUB_TOKEN`: `(your personal access token for higher rate limits)`
6. Click **Deploy**.
7. Vercel will assign a free subdomain, e.g.:
   `https://isaiahaihub-website.vercel.app` (or custom name configured in Vercel domain settings).
8. Verify production API endpoints:
   - `https://your-domain.vercel.app/api/apps`
   - `https://your-domain.vercel.app/api/reviews?appId=preview-smartprompt`

---

## 6. Publishing APK Releases to `isaiahaihub-apps`

To have your Android applications automatically appear in the website catalogue:

### Recommended APK Filename Convention
Publish one production-ready `.apk` file per release:
- `SmartPromptStudio-v1.0.0.apk`
- `DevTokenCalculator-v2.1.0.apk`
- `KeyVaultOffline-v1.2.0.apk`

*Filenames containing `debug`, `unsigned`, `unaligned`, `test`, or `snapshot` are automatically excluded by the verification engine.*

### Recommended Release Notes Template
When creating a GitHub Release on `isaiahaihub-apps`, use this markdown format:

```markdown
Category: Security & Privacy
Min Android: Android 9.0+ (API 28)
Package: com.isaiahaihub.keyvault
SHA-256: 9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b

### What's New in v1.2.0
- Added hardware keystore biometric encryption.
- Zero internet permissions in manifest.
- Offline QR code backups.
```

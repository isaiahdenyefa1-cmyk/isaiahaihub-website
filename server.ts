import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getAppsCatalog } from './server/githubService.js';
import { getAppReviews, addAppReview, trackDownload } from './server/reviewService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API route: GET /api/apps
app.get('/api/apps', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const catalog = await getAppsCatalog(forceRefresh);

    // Set cache control headers for downstream/browser
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.json(catalog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({
      success: false,
      apps: [],
      error: message
    });
  }
});

// API route: GET /api/reviews?appId=...
app.get('/api/reviews', (req, res) => {
  try {
    const appId = String(req.query.appId || '');
    if (!appId) {
      return res.status(400).json({ success: false, error: 'Query parameter appId is required' });
    }
    const data = getAppReviews(appId);
    return res.json({
      success: true,
      appId,
      summary: data.summary,
      reviews: data.reviews
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: message });
  }
});

// API route: POST /api/reviews
app.post('/api/reviews', (req, res) => {
  try {
    const { appId, reviewerName, rating, comment, version, title } = req.body || {};
    const result = addAppReview({
      appId,
      reviewerName,
      rating: Number(rating),
      comment,
      version,
      title
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const updatedData = getAppReviews(appId);
    return res.status(201).json({
      success: true,
      review: result.review,
      summary: updatedData.summary
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: message });
  }
});

// API route: POST /api/apps/:id/download
app.post('/api/apps/:id/download', (req, res) => {
  try {
    const appId = req.params.id;
    const downloadCount = trackDownload(appId);
    return res.json({ success: true, appId, downloadCount });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: message });
  }
});

// API route: GET /api/status
app.get('/api/status', async (_req, res) => {
  try {
    const catalog = await getAppsCatalog(false);
    return res.json({
      status: 'ok',
      repository: catalog.meta.repository,
      totalApps: catalog.meta.totalApps,
      rateLimitRemaining: catalog.meta.rateLimitRemaining,
      cached: catalog.meta.cached,
      cacheAgeSeconds: catalog.meta.cacheAgeSeconds,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return res.status(500).json({ status: 'error', message: msg });
  }
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IsaiahAIhub server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

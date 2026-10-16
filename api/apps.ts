import type { IncomingMessage, ServerResponse } from 'http';
import { getAppsCatalog } from '../server/githubService.js';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => this;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const forceRefresh = req.query?.refresh === 'true';
    const catalog = await getAppsCatalog(forceRefresh);

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(catalog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({
      success: false,
      apps: [],
      error: message
    });
  }
}

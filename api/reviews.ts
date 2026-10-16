import type { IncomingMessage, ServerResponse } from 'http';
import { getAppReviews, addAppReview } from '../server/reviewService.js';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  body: any;
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => this;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const appId = String(req.query?.appId || '');
    if (!appId) {
      return res.status(400).json({ success: false, error: 'Query parameter appId is required' });
    }
    const data = getAppReviews(appId);
    return res.status(200).json({
      success: true,
      appId,
      summary: data.summary,
      reviews: data.reviews
    });
  }

  if (req.method === 'POST') {
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
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

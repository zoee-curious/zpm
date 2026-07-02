import { Request, Response, NextFunction } from 'express';

export async function auth(req: Request<any, any, any, any>, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  next();
}

import { Request, Response, NextFunction } from 'express';

export async function powershellAccess(
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isPowerShell = userAgent.includes('powershell');

  if (!isPowerShell) {
    return next('route');
  }

  next();
}

import { Request, Response, NextFunction } from 'express';

export const requestLoggerMiddleware = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  console.log(`(REST <--) ${req.method} ${req.originalUrl}`);
  const startTime = Date.now();

  resp.on('finish', () => {
    const elapsed = Date.now() - startTime;
    console.log(
      `(REST -->) ${req.method} ${req.originalUrl} ${resp.statusCode} ${elapsed}ms`
    );
  });

  next();
};

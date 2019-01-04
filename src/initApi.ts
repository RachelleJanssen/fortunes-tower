import { Express, NextFunction, Request, Response } from 'express';
import { log } from './utils/logging/logger';

import adminRouter from './REST/admin/adminRouter';
import gameRouter from './REST/game/gameRouter';
// import itemRouter from './REST/items/itemRouter';
import throwableError from './utils/express/throwableError';

function logAPIRequest(req: Request, _res: Response, next: NextFunction): void {
  log().info(
    `METHOD: ${req.method}; URL: ${req.url}; Content-Type: ${
      req.headers['content-type'] ? req.headers['content-type'] : 'undefined, defaulting to application/json'
    }`,
  );
  next();
}

function cors(_req: Request, res: Response, next: NextFunction): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  );
  next();
}

export default function initApi(app: Express, apiBasePath = '/api'): void {
  app.all('*', logAPIRequest); // all API routes are going through the logger
  app.use(cors);
  app.use(`${apiBasePath}/game`, gameRouter());
  // app.use(`${apiBasePath}/collections`, collectionRouter());
  app.use(`${apiBasePath}/admin`, adminRouter());

  app.use((error: Error, _req: Request, _res: Response, _next: NextFunction) => {
    // This is needed so we also pass the error key and data so the frontend can localize the error
    throw throwableError(error);
  });
}

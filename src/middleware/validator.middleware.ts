import { NextFunction, Request, Response } from 'express';
import { AnySchema, Schema } from 'joi';
import { requestHandler } from '../utils/express/expressHandler';
import { validateRequest } from '../utils/validation/validateBySchema';

export default async function validatorMiddleware(schemas?: { paramsSchema?: AnySchema; querySchema?: Schema; bodySchema?: AnySchema }) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    validateRequest(await requestHandler(req), schemas);
    next();
  };
}

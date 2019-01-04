import { Response } from 'express';

import { CONTENTTYPES } from '../constants';
import { log } from '../logging/logger';
import { responseHandler } from './expressHandler';

import { isDev } from '../../env';
import { CustomError } from '../error/customErrors';
import throwableError from './throwableError';

interface IErrorResponse {
  error: {
    message: string;
    name: string;
    stack?: string;
  };
}

/**
 * Handler for errors
 * @param {Error} err The error object
 * @param {Response} res The expressjs response object
 * @param {string} format The format to display the response, by default shows in application/json format
 */
export default async function handleError(err: Error | CustomError, res: Response, format: string = CONTENTTYPES.JSON): Promise<Response> {
  let response: IErrorResponse;
  const error = !(err instanceof CustomError) ? throwableError(err) : err;
  if (isDev) {
    // development error handler
    // will print stacktrace
    response = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };
  } else {
    // production error handler
    // no stacktraces leaked to user, just the message
    response = {
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
  log().error(JSON.stringify(response));
  res.statusCode = error.status;
  return responseHandler(res, response, format);
}

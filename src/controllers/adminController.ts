// require models

// require utilities
import { Request, Response } from 'express';
import { requestHandler, responseHandler } from '../utils/express/expressHandler';
import handleError from '../utils/express/handleError';
import { cleanLocalJSONStorage, createLocalJSONStorage } from '../utils/storage/JSONstorage';
import { validateRequest } from '../utils/validation/validateBySchema';

const emptyStorageObject = {
  games: [],
};

/**
 * Empty the local storage
 * @param {Request} req Express request
 * @param {Response} res Express request
 */
export async function emptyStorage(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    createLocalJSONStorage(emptyStorageObject);
    const responseContent = { message: 'The local storage is now empty' };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

/**
 * Create the local storage
 * @param {Request} req Express request
 * @param {Response} res Express request
 * @returns {Promise<Response>} Returns a response, in the form of a promise, through the response handler
 */
export async function createStorage(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    cleanLocalJSONStorage(emptyStorageObject);
    const responseContent = { message: 'The local storage is now empty' };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

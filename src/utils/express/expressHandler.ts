import { Request, Response } from 'express';

import { CONTENTTYPES } from '../constants';
import { IBaseXMLRequest } from '../models/baseModels';
import baseXMLRequest from '../validation/sharedSchemas';
// import { baseXMLRequest } from '../validation/sharedSchemas';
// import { validateObject } from '../validation/validateBySchema';
import { toXml } from '../XML/XMLParser';

/**
 * Handle the request and transform the input into JSON in case it was XML
 * @param {*} request the express request object
 * @returns {Promise<Request>} Returns a request, in the form of a promise, through the express request object
 */
export async function requestHandler(request: Request): Promise<Request> {
  const format = request.headers['content-type'];
  switch (format) {
    case CONTENTTYPES.APPXML:
    case CONTENTTYPES.TEXTXML:
      if (request.method !== 'GET') {
        let jsonBody: IBaseXMLRequest = request.body;
        if (!jsonBody) {
          jsonBody = { request: {} };
        }
        request.body = await baseXMLRequest.validate(jsonBody).value;
      }
      break;
    default:
      break;
  }
  return request;
}

/**
 * Handle the response and respond with XML in case the request was also made with XML
 * @param {Response} response the express response object
 * @param {Object} content the content to display
 * @param {String} format the format to display the content in
 * @returns {Promise<Response>} Returns a response, in the form of a promise, through the express response object
 */
export async function responseHandler(response: Response, content: Record<string, unknown>, format: string = CONTENTTYPES.JSON): Promise<Response> {
  switch (format) {
    case CONTENTTYPES.APPXML:
    case CONTENTTYPES.TEXTXML:
      response.setHeader('Content-Type', format);
      return response.send(
        await toXml({
          response: content,
        }),
      );
    default:
      return response.json(content);
  }
}

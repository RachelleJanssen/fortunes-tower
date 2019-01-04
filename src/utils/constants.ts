import { pathToFileURL } from 'url';

/**
 * API request content types
 */
export const CONTENTTYPES = {
  PLAINTEXT: 'text/plain',
  JSON: 'application/json',
  JAVASCRIPT: 'application/javascript',
  APPXML: 'application/xml',
  TEXTXML: 'text/xml',
  HTML: 'text/html',
};

/**
 * The file path to the local json storage
 */
export const collectionPath = pathToFileURL(`${__dirname}/localJSONStorage.json`);

/**
 * HTTP methods
 */
export const HTTPMETHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

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

/**
 * Valid cards and their values
 */
export enum CardValues {
  HERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
}

/**
 * Valid card deck types
 */
export enum DeckType {
  EMERALD = 'Emerald',
  RUBY = 'Ruby',
  DIAMOND = 'Diamond',
}

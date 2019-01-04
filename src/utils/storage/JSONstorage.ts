import { writeFileSync } from 'fs';

import { collectionPath } from '../constants';
import { functionNotImplementedError } from '../error/customErrors';

export function createLocalJSONStorage(emptyStorage: object): void {
  writeFileSync(collectionPath, JSON.stringify(emptyStorage), {
    flag: 'w',
    encoding: 'utf8',
  });
}
export function deleteLocalJSONStorage(): void {
  throw functionNotImplementedError;
}
export function cleanLocalJSONStorage(emptyStorage: object): void {
  writeFileSync(collectionPath, JSON.stringify(emptyStorage), {
    flag: 'wx',
    encoding: 'utf8',
  });
  throw functionNotImplementedError;
}
export function overwriteLocalJSONStorage(): void {
  throw functionNotImplementedError;
}
export function appendElementLocalJSONStorage(): void {
  throw functionNotImplementedError;
}
export function deleteElementLocalJSONStorage(): void {
  throw functionNotImplementedError;
}

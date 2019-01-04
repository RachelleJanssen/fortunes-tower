// export function findAndReplace(object: object, value: any, replacevalue: any): object {
//   for (const x in object) {
//     if (typeof object[x] === typeof {}) {
//       findAndReplace(object[x], value, replacevalue);
//     }
//     if (object[x] === value) {
//       object.name = replacevalue;
//       break; // uncomment to stop after first replacement
//     }
//   }
//   return object;
// }

export function isEmpty(obj: object): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

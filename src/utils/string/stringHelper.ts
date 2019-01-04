/**
 * Helper function to convert a string to hexadecimal
 * @param {string} stringInput The string input to be converted to hexadecimal
 * @returns {string} returns a hexadecimal string
 */
export function hexEncode(stringInput: string): string {
  let hex;
  let i;
  let result = '';

  for (i = 0; i < stringInput.length; i += 1) {
    hex = stringInput.charCodeAt(i).toString(16);
    result += `000${hex}`.slice(-4);
  }

  return result;
}

/**
 * helper function to convert a hexadecimal string back to a regular string.
 * @param {string} hexInput The string input to be converted to hexadecimal
 * @returns {string} returns a regular string
 */
export function hexDecode(hexInput: string): string {
  let j;
  const hexes = hexInput.match(/.{1,4}/g) || [];
  let back = '';
  try {
    for (j = 0; j < hexes.length; j += 1) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
    }
  } catch (error) {
    throw new Error(error.message);
  }
  return back;
}

// TODO: fix the following two functions for typescript

/**
 * helper function to convert base64 into hexadecimal
 * @param {number} base64String the base64 input
 * @returns {string} returns a hexadecimal string
 */
// export function base64toHEX(base64String: number): string {
//   const hexString = Buffer.alloc(base64String, 'base64').toString('hex');
//   return hexString;
// }

//   /**
//    * helper function to convert hexadecimal into base64
//    * @param {*} hexString the hexadecimal input
//    * @returns {string} returns a base64 string
//    */
// export function hexToBase64(hexString: string): string {
//   const basestring = Buffer.alloc(hexString, 'hex').toString('base64');
//   return basestring;
// }

import * as xml2js from 'xml2js';
import { IBaseXMLRequest } from '../models/baseModels';

/**
 * Converts XML to JSON
 * @param {xml2js.convertableToString} xml
 */
// TODO: fix this and test this
export async function toJson(xml: xml2js.convertableToString): Promise<any> {
  const parser = new xml2js.Parser({
    explicitArray: false,
  });

  return new Promise((resolve, reject) => {
    // returning promise
    parser.parseString(xml, (err: Error, response: object) => {
      if (err) {
        reject(err); // promise reject
      } else {
        const result: IBaseXMLRequest = { request: response };
        resolve(result); // promise resolve
      }
    });
  });

  // parser.parseString(xml, (err: Error, result: object) => {
  //   if (err) {
  //     return Promise.reject(err);
  //   }
  //   const xmlRequest: IBaseXMLRequest = { request: result };
  //   return Promise.resolve(xmlRequest);
  // });
}

/**
 * Converts JSON to XML
 * @param {*} json
 */
export async function toXml(json: object): Promise<string> {
  const builder = new xml2js.Builder();
  try {
    return builder.buildObject(json);
  } catch (e) {
    return e;
  }
}

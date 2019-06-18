import { Request } from 'express';
import * as joi from 'joi';
import throwableError from '../express/throwableError';
import { isEmpty } from '../objects/objecthelpers';

// tslint:disable-next-line:interface-name
interface ValidRequest<T> extends Request {
  body: T;
}

/**
 * Validate an object with a joi schema
 * @param {Object} object The object to test
 * @param {joi.SchemaLike} schema The joi schema to use
 * @param {boolean} requireAllFields Whether or not all fields are required
 */
const validateObject = <type>(object: object, schema: joi.SchemaLike, requireAllFields: boolean = true): type => {
  const objectToValidate = object;

  const result = joi.validate(objectToValidate, schema, {
    abortEarly: false,
    presence: requireAllFields ? 'optional' : 'required',
  });
  if (result.error) {
    throw throwableError(result.error);
  }
  return (result.value as unknown) as type;
};

const validateRequest = <type>(
  request: Request,
  schemas?: { paramsSchema?: joi.AnySchema; querySchema?: joi.SchemaLike; bodySchema?: joi.AnySchema },
): ValidRequest<type> => {
  if (!isEmpty(request.params) && schemas && schemas.paramsSchema) {
    request.params = validateObject<type>(request.params, schemas.paramsSchema);
  }
  if (!isEmpty(request.query) && schemas && schemas.querySchema) {
    request.query = validateObject<type>(request.query, schemas.querySchema);
  }
  // TODO: try to get an optional type annotation in the body
  if (schemas && schemas.bodySchema) {
    request.body = validateObject<type>(request.body, schemas.bodySchema);
  }
  return request as ValidRequest<type>;
};

/**
 * validate an array of objects with a joi schema (giving a bit more control than the build-in joi functionality)
 * @param {*} arrayOfObjects The array of objects to test
 * @param {*} schema The joi schema to use
 * @param {*} requireAllFields Whether or not all fields are required
 */
// TODO: test if this wrapper function still works in typescript
const validateArray = <type>(arrayOfObjects: object[], schema: joi.ObjectSchema, requireAllFields: boolean = true): type[] =>
  arrayOfObjects.map(item => validateObject<type>(item, schema, requireAllFields));

export { validateObject, validateArray, validateRequest };

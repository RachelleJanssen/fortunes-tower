import * as joi from 'joi';

export const baseXMLRequest: joi.ObjectSchema = joi.object().keys({
  request: joi.object().required(),
});

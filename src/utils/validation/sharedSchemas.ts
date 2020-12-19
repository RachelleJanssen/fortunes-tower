import joi from 'joi';

const baseXMLRequest: joi.ObjectSchema = joi.object().keys({
  request: joi.object().required(),
});

export default baseXMLRequest;

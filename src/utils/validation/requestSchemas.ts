import joi from 'joi';
import { DeckType } from '../../models/card';

export const gameIdQuerySchema = joi.string().max(24);

export const newGameBodySchema = joi.object().keys({
  bet: joi.number().valid(...[15, 30, 45, 60]),
  deck: joi.string().valid(...Object.values(DeckType).map((type) => type.toString())).required(),
});

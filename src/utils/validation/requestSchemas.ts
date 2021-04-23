import joi from 'joi';
import { DeckType } from '../../models/card';

export const gameIdQuerySchema = joi.string().max(24);

export const newGameBodySchema = joi.object().keys({
  player: joi.string(),
  bet: joi.number().valid(...[15, 30, 45, 60]),
  deck: joi.string().valid(...Object.values(DeckType).map((type) => type.toString())).required(),
});

export const newPlayerSchema = joi.object().keys({
  firstName: joi.string(),
  lastName: joi.string(),
  userName: joi.string().email(),
  games: joi.string(),
})

import { Game } from './game'
import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

export interface IPlayer {
  firstName: string
  lastName: string
  userName: string
  games: Ref<Game>[]
}

export class Player implements IPlayer {
  @prop()
  public firstName!: string;

  @prop()
  public lastName!: string;

  @prop()
  public userName!: string;

  @prop({ ref: 'Game', required: true})
  public games!: Ref<Game>[]; // This is a Reference Array
}

export const PlayerModel = getModelForClass(Player, { schemaOptions: { validateBeforeSave: true } });

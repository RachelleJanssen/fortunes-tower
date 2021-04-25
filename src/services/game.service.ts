// Packages
import { Request } from 'express';
import { Error } from 'mongoose';

// Models
import { fillDeck, GameModel, GameState, IGame } from '../models/game';
import { PlayerModel } from "../models/player";

// Libs
import { shuffle } from '../utils/array/arrayHelpers';
import { CustomError } from '../utils/error/customErrors';


export class GameService {
  public static async createNewGame(request: Request) {
    const player = await PlayerModel.findById(request.body.player)

    if (!player) {
      throw new Error('Player not found')
    }

    const betMultiplier = request.body.bet / 15;

    // INewGame
    const newGameObject: IGame = {
      betMultiplier,
      round: 0,
      rowStatus: [],
      rowMessages: [],
      tableValue: 0,
      multiplier: [1], // multiplier is reserved for duplicated
      drawnCards: [[]],
      deck: shuffle(fillDeck(request.body.deck)),
      player: request.body.player,
      _gameState: GameState.PLAYING,
    };

    const newGame = new GameModel(newGameObject);

    // draw the tower card
    // console.log('draw round 0');
    newGame.drawCards();
    // and the first row
    // console.log('draw round 1');
    newGame.drawCards();
    const validateGame = newGame.validateSync();
    if (validateGame instanceof Error.ValidationError) {
      throw new CustomError(validateGame.message, validateGame.name, 500);
    }
    newGame.save();
    player.games.push(newGame)
    player.save();
    // console.log(newGame.deck);
    return newGame.toJSON();
  }
}

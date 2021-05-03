// Packages
import { Request } from 'express';
import { Error, FilterQuery } from 'mongoose';

// Models
import {
  fillDeck, Game, GameModel, GameState, IGame,
} from '../models/game';
import { PlayerModel } from '../models/player';

// Libs
import { shuffle } from '../utils/array/arrayHelpers';
import { CustomError, gameNotFoundError, gameOverError } from '../utils/error/customErrors';

export class GameService {
  public static async listGames(queryOptions?: FilterQuery<Game>): Promise<Game[]> {
    return GameModel.find(queryOptions || {});
  }

  public static async getById(gameId: string) {
    const game = await GameModel.findById(gameId);
    if (!game) {
      throw gameNotFoundError;
    }
    return game;
  }

  public static async draw(gameId: string): Promise<Game> {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.drawCards();
    return GameModel.updateOne({ _id: gameId }, game);
  }

  public static async cashOut(gameId: string): Promise<Game> {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.cashoutGame();
    return GameModel.updateOne({ _id: gameId }, game);
  }

  public static async createNewGame(request: Request) {
    const player = await PlayerModel.findById(request.body.player);

    if (!player) {
      throw new Error('Player not found');
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
    newGame.drawCards();
    // and the first row
    newGame.drawCards();
    const validateGame = newGame.validateSync();
    if (validateGame instanceof Error.ValidationError) {
      throw new CustomError(validateGame.message, validateGame.name, 500);
    }
    newGame.save();
    player.games.push(newGame);
    player.save();
    return newGame;
  }
}

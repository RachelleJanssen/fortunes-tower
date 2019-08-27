// require models
import { Request, Response } from 'express';
import { Error } from 'mongoose';

// require schemas and schema functions
import { fillDeck, gameModel, GameState, IGame } from '../../models/game';

// require utilities
import { shuffle } from '../../utils/array/arrayHelpers';
import { CustomError, gameNotFoundError, gameOverError } from '../../utils/error/customErrors';
import { requestHandler, responseHandler } from '../../utils/express/expressHandler';
import handleError from '../../utils/express/handleError';
import { gameIdQuerySchema, INewGameBody, newGameBodySchema } from '../../utils/validation/requestSchemas';
import { validateRequest } from '../../utils/validation/validateBySchema';

/**
 * Get all collections
 * @param {Request} req Express request
 * @param {Response} res Express request
 */
export async function listGames(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    const request: Request = validateRequest(await requestHandler(req));
    const games = await gameModel.find({});
    const responseContent = {
      games,
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function createNewGame(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    // TODO: a new game API body:
    /*
      betAmount
      deckchoices:
        Emerald deck: contains 4 Hero cards and 70 numbered cards (10 of each number).
        Ruby deck: contains 4 Hero cards and 63 numbered cards (9 of each number).
        Diamond deck: contains 4 Hero cards and 56 numbered cards (8 of each number).
    */
    const request = validateRequest<INewGameBody>(await requestHandler(req), { bodySchema: newGameBodySchema });

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
      _gameState: GameState.PLAYING,
    };

    const newGame = new gameModel(newGameObject);

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
    // console.log(newGame.deck);
    const responseContent = newGame.toJSON();
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getGameDetails(req: Request, res: Response): Promise<Response> {
  try {
    const request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
    const { id } = request.params;
    const game = await gameModel.findById(id);
    if (!game) {
      throw gameNotFoundError;
    }
    const responseContent = game;
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getCards(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
    const { id } = request.params;

    const game = await gameModel.findById(id);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.drawCards();
    await gameModel.updateOne({ _id: id }, game);
    const responseContent = {
      game,
      message: 'cards drawn',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function cashout(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
    const { id } = request.params;
    const game = await gameModel.findById(id);
    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.cashoutGame();
    await gameModel.updateOne({ _id: id }, game);

    const responseContent = {
      game,
      message: 'player cashed out, thanks for playing',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

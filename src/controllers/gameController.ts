// require models
import { Request, Response } from 'express';

// require schemas and schema functions
import {
  GameModel, GameState, INewGameBody,
} from '../models/game';
import { GameService } from '../services/game.service';

// require utilities
import { gameNotFoundError, gameOverError } from '../utils/error/customErrors';
import { requestHandler, responseHandler } from '../utils/express/expressHandler';
import handleError from '../utils/express/handleError';
import { gameIdQuerySchema, newGameBodySchema } from '../utils/validation/requestSchemas';
import { validateRequest } from '../utils/validation/validateBySchema';

/**
 * Get all collections
 * @param {Request} req Express request
 * @param {Response} res Express request
 */
export async function listGames(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    const games = await GameModel.find({});
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
    const request = validateRequest<INewGameBody>(await requestHandler(req), { bodySchema: newGameBodySchema });

    const responseContent = GameService.createNewGame(request);

    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getGameDetails(req: Request, res: Response): Promise<Response> {
  try {
    const request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
    const { id } = request.params;
    const game = await GameModel.findById(id);
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

    const game = await GameModel.findById(id);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.drawCards();
    await GameModel.updateOne({ _id: id }, game);
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
    const game = await GameModel.findById(id);
    if (!game) {
      throw gameNotFoundError;
    }
    if (game.gameState === GameState.GAMEOVER || game.gameState === GameState.CHASHEDOUT) {
      throw gameOverError;
    }

    game.cashoutGame();
    await GameModel.updateOne({ _id: id }, game);

    const responseContent = {
      game,
      message: 'player cashed out, thanks for playing',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

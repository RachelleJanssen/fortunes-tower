// require models
import { Request, Response } from 'express';

// require schemas and schema functions
import {
  INewGameBody,
} from '../models/game';
import { GameService } from '../services';

// require utilities
import { requestHandler, responseHandler } from '../utils/express/expressHandler';
import handleError from '../utils/express/handleError';
import { gameIdQuerySchema, newGameBodySchema } from '../utils/validation/requestSchemas';
import { validateRequest } from '../utils/validation/validateBySchema';

export class GameController {
  /**
   * Get all collections
   * @param {Request} req Express request
   * @param {Response} res Express request
   */
  public static async listGamesHandler(req: Request, res: Response): Promise<Response> {
    try {
      const request: Request = validateRequest(await requestHandler(req));
      const games = await GameService.listGames();
      const responseContent = {
        games,
      };
      return await responseHandler(res, responseContent, request.headers['content-type']);
    } catch (error) {
      return handleError(error, res, req.headers['content-type']);
    }
  }

  public static async createNewGameHandler(req: Request, res: Response): Promise<Response> {
    try {
      const request = validateRequest<INewGameBody>(await requestHandler(req), { bodySchema: newGameBodySchema });

      const newGame = await GameService.createNewGame(request);

      const responseContent = newGame.toJSON();

      return await responseHandler(res, responseContent, request.headers['content-type']);
    } catch (error) {
      return handleError(error, res, req.headers['content-type']);
    }
  }

  public static async getGameDetailsHandler(req: Request, res: Response): Promise<Response> {
    try {
      const request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
      const { id } = request.params;

      const game = await GameService.getById(id);

      const responseContent = game.toJSON();
      return await responseHandler(res, responseContent, request.headers['content-type']);
    } catch (error) {
      return handleError(error, res, req.headers['content-type']);
    }
  }

  public static async getCardsHandler(req: Request, res: Response): Promise<Response> {
    try {
      const request: Request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
      const { id } = request.params;

      const updatedGame = await GameService.draw(id);

      const responseContent = {
        updatedGame,
        message: 'cards drawn',
      };
      return await responseHandler(res, responseContent, request.headers['content-type']);
    } catch (error) {
      return handleError(error, res, req.headers['content-type']);
    }
  }

  public static async cashoutHandler(req: Request, res: Response): Promise<Response> {
    try {
      const request: Request = validateRequest(await requestHandler(req), { querySchema: gameIdQuerySchema });
      const { id } = request.params;

      const updatedGame = await GameService.cashOut(id);

      const responseContent = {
        updatedGame,
        message: 'player cashed out, thanks for playing',
      };
      return await responseHandler(res, responseContent, request.headers['content-type']);
    } catch (error) {
      return handleError(error, res, req.headers['content-type']);
    }
  }
}

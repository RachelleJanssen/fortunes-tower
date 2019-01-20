// require models
import { Request, Response } from 'express';

// require schemas and schema functions
import { fillDeck, gameModel } from '../../models/game';

// require utilities
import { shuffle } from '../../utils/array/arrayHelpers';
import { gameNotFoundError, gameOverError } from '../../utils/error/customErrors';
import { requestHandler, responseHandler } from '../../utils/express/expressHandler';
import handleError from '../../utils/express/handleError';
import { guidGenerator } from '../../utils/number/numberHelpers';
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
    // TODO: a new game contains some body like the amount the player wants to bet
    const request: Request = validateRequest(await requestHandler(req));

    // INewGame
    const newGame = new gameModel({
      id: guidGenerator(),
      round: 0,
      rowStatus: [],
      rowMessages: [],
      tableValue: 0,
      multiplier: request.body.betMultiplier,
      drawnCards: [[]],
      deck: shuffle(fillDeck()),
    });
    newGame.drawCards();
    newGame.drawCards();
    newGame.save();

    const responseContent = newGame.toJSON();
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getGameDetails(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;
    const game = await gameModel.findById(id);
    if (!game) {
      throw gameNotFoundError;
    }
    const responseContent = game;
    console.log(responseContent);
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getCards(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;

    const game = await gameModel.findById(id);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.rowStatus.find(row => row === false)) {
      throw gameOverError;
    }

    game.drawCards();
    game.checkStatus();
    await gameModel.update({ _id: id }, game);
    const responseContent = {
      game,
      message: 'card drawn',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

// export async function holdGame(req: Request, res: Response): Promise<Response> {
//   try {
//     throw functionNotImplementedError;
//     // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
//     // const responseContent = {};
//     // return await responseHandler(res, responseContent, request.headers['content-type']);
//   } catch (error) {
//     return handleError(error, res, req.headers['content-type']);
//   }
// }

// export async function cashout(req: Request, res: Response): Promise<Response> {
//   try {
//     throw functionNotImplementedError;
//     // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
//     // const responseContent = {};
//     // return await responseHandler(res, responseContent, request.headers['content-type']);
//   } catch (error) {
//     return handleError(error, res, req.headers['content-type']);
//   }
// }

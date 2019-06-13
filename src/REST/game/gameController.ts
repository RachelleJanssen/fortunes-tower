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
    // TODO: a new game API body:
    /*
      betAmount
      deckchoices:
        Emerald deck: contains 4 Hero cards and 70 numbered cards (10 of each number).
        Ruby deck: contains 4 Hero cards and 63 numbered cards (9 of each number).
        Diamond deck: contains 4 Hero cards and 56 numbered cards (8 of each number).
    */
    const request: Request = validateRequest(await requestHandler(req));

    // INewGame
    const newGame = new gameModel({
      id: guidGenerator(),
      round: 0,
      rowStatus: [],
      rowMessages: [],
      tableValue: 0,
      betMultiplier: request.body.betMultiplier,
      multiplier: [1],
      drawnCards: [[]],
      deck: shuffle(fillDeck()),
    });
    // draw the tower card
    console.log('draw round 0');
    newGame.drawCards();
    // and the first row
    console.log('draw round 1');
    newGame.drawCards();
    newGame.save();
    // console.log(newGame.deck);
    const responseContent = newGame.toJSON();
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    console.log(error);
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
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getCards(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;

    const game = await gameModel.findById(id);

    if (!game) {
      throw gameNotFoundError;
    }
    if (game.rowStatus.includes(true)) {
      throw gameOverError;
    }

    game.drawCards();
    await gameModel.update({ _id: id }, game);
    const responseContent = {
      game,
      message: 'cards drawn',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

// TODO: cashout function
export async function cashout(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    // TODO: check that game is not game over yet

    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;
    const game = await gameModel.findById(id);
    if (!game) {
      throw gameNotFoundError;
    }

    // if (game.)

    // if game is over
    // throw gameOverError

    // if game is NOT over
    // return the row total
    // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
    const responseContent = {};
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

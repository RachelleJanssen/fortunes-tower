// require models
import { Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fillDeck, Game, IGame } from '../../models/game';
import { collectionPath } from '../../utils/constants';
import { functionNotImplementedError, gameNotFoundError, gameOverError } from '../../utils/error/customErrors';
import { requestHandler, responseHandler } from '../../utils/express/expressHandler';
import handleError from '../../utils/express/handleError';
import { guidGenerator } from '../../utils/number/numberHelpers';
import { validateRequest } from '../../utils/validation/validateBySchema';

// require utilities

/**
 * Get all collections
 * @param {Request} req Express request
 * @param {Response} res Express request
 */
export async function listGames(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    const request: Request = validateRequest(await requestHandler(req));
    const storage = JSON.parse(readFileSync(collectionPath, 'utf8'));
    const responseContent = {
      storage,
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
    const newGame = {
      id: guidGenerator(),
      round: 0,
      rowStatus: [],
      rowMessages: [],
      tableValue: 0,
      multiplier: request.body.betMultiplier,
      drawnCards: [[]],
      deck: fillDeck(),
    };

    const game = new Game(
      newGame.id,
      newGame.round,
      newGame.rowStatus,
      newGame.rowMessages,
      newGame.tableValue,
      newGame.multiplier,
      newGame.drawnCards,
      newGame.deck,
    );

    const storage = JSON.parse(readFileSync(collectionPath, 'utf8'));

    storage.games.push(game);

    writeFileSync(collectionPath, JSON.stringify(storage, undefined, 2));

    const responseContent = game;
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getGameDetails(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;
    const storage = JSON.parse(readFileSync(collectionPath, 'utf8'));
    const game = storage.games.find((gameEntry: Game) => gameEntry.id === id);
    if (!game) {
      throw gameNotFoundError;
    }
    const responseContent = {
      game,
    };
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

    const storage = JSON.parse(readFileSync(collectionPath, 'utf8'));
    // console.log(storage.games);
    const gameIndex: number = storage.games.findIndex((gameEntry: Game) => {
      return gameEntry.id === id;
    });

    const gameObject: IGame = storage.games[gameIndex];

    if (!gameObject) {
      throw gameNotFoundError;
    }
    if (gameObject.rowStatus.find(row => row === false)) {
      throw gameOverError;
    }

    const game = Game.fromObject(gameObject);

    game.drawCards();

    storage.games[gameIndex] = game;

    writeFileSync(collectionPath, JSON.stringify(storage, undefined, 2));
    // game.deck.cards = lodash.remove(game.deck.cards, card => card.value === )
    const responseContent = {
      game,
      message: 'card drawn',
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function holdGame(req: Request, res: Response): Promise<Response> {
  try {
    throw functionNotImplementedError;
    // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
    // const responseContent = {};
    // return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function cashout(req: Request, res: Response): Promise<Response> {
  try {
    throw functionNotImplementedError;
    // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
    // const responseContent = {};
    // return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

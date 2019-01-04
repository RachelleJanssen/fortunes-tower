// require models
import { Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { Game } from '../../models/game';
import { collectionPath } from '../../utils/constants';
import { functionNotImplementedError } from '../../utils/error/customErrors';
import { requestHandler, responseHandler } from '../../utils/express/expressHandler';
import handleError from '../../utils/express/handleError';
import { validateRequest } from '../../utils/validation/validateBySchema';
// import lodash from 'lodash';

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
    const game = new Game();
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
    throw functionNotImplementedError;
    // const request: Request = validateRequest(await requestHandler(req), { bodySchema: newCollectionSchema });
    // const responseContent = {};
    // return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function getCard(req: Request, res: Response): Promise<Response> {
  try {
    // throw functionNotImplementedError;
    const request: Request = validateRequest(await requestHandler(req));
    const { id } = request.params;

    const storage = JSON.parse(readFileSync(collectionPath, 'utf8'));
    const gameIndex: number = storage.games.findIndex((gameEntry: Game) => gameEntry.id === id);

    const randomCardIndex = Math.floor(Math.random() * storage.games[gameIndex].deck.cards.length);

    const newCardDrawn = storage.games[gameIndex].deck.cards[randomCardIndex];
    console.log(randomCardIndex);
    console.log(newCardDrawn);
    storage.games[gameIndex].deck.cards.splice(randomCardIndex, 1);
    storage.games[gameIndex].drawnCards.push(newCardDrawn);
    writeFileSync(collectionPath, JSON.stringify(storage, undefined, 2));
    // game.deck.cards = lodash.remove(game.deck.cards, card => card.value === )
    const responseContent = {
      newCardDrawn,
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

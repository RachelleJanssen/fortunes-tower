// require models
import { Request, Response } from 'express';
import { IPlayer, PlayerModel } from '../models/player';
import { requestHandler, responseHandler } from '../utils/express/expressHandler';
import handleError from '../utils/express/handleError';
import { newPlayerSchema } from '../utils/validation/requestSchemas';
import { validateRequest } from '../utils/validation/validateBySchema';

export async function listPlayers(req: Request, res: Response): Promise<Response> {
  try {
    const request: Request = validateRequest(await requestHandler(req));
    const players = await PlayerModel.find({});
    const responseContent = {
      players,
    };
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

export async function createPlayer(req: Request, res: Response): Promise<Response> {
  try {
    const request = validateRequest<IPlayer>(await requestHandler(req), { bodySchema: newPlayerSchema });

    // new player
    const newPlayerObject: IPlayer = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      userName: request.body.userName,
      games: request.body.games,
    };

    const newPlayer = new PlayerModel(newPlayerObject);

    newPlayer.save()

    const responseContent = newPlayer.toJSON();
    return await responseHandler(res, responseContent, request.headers['content-type']);
  } catch (error) {
    return handleError(error, res, req.headers['content-type']);
  }
}

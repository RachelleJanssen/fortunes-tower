import { Router } from 'express';
import * as playerController from '../controllers/playerController';

export class PlayerRouter {
  public static router(): Router {
    const playerRouter = Router();

    playerRouter.route('')
      .get(playerController.listPlayers) // list all Players
      .post(playerController.createPlayer); // create a new Player

    playerRouter.route('/:id')
      .get(playerController.getPlayerDetails);

    return playerRouter;
  }
}

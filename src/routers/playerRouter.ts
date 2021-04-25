import { Router } from 'express';
import * as playerController from '../controllers/playerController';

export default function playerRoutes(): Router {
  const PlayerRouter = Router();

  PlayerRouter.route('')
    .get(playerController.listPlayers) // list all Players
    .post(playerController.createPlayer); // create a new Player

  return PlayerRouter;
}

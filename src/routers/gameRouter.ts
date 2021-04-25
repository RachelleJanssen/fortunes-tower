import { Router } from 'express';
import * as gameController from '../controllers/gameController';

export default function gameRoutes(): Router {
  const gameRouter = Router();

  gameRouter.route('')
    .get(gameController.listGames) // list all games
    .post(gameController.createNewGame); // create a new game

  gameRouter.route('/:id')
    .get(gameController.getGameDetails); // get the details of a game

  gameRouter.route('/:id/card')
    .put(gameController.getCards); // get a new card

  gameRouter.route('/:id/cashout')
    .put(gameController.cashout); // cashout

  return gameRouter;
}

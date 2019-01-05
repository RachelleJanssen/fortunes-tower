import { Router } from 'express';
import * as gameController from './gameController';

export default function gameRoutes(): Router {
  const gameRouter = Router();
  gameRouter.route('').get(gameController.listGames); // list all games
  gameRouter.route('').post(gameController.createNewGame); // create a new game
  gameRouter.route('/:id').get(gameController.getGameDetails); // get the details of a game
  gameRouter.route('/:id/card').put(gameController.getCards); // get a new card
  gameRouter.route('/:id/hold').put(gameController.holdGame); // hold the game
  gameRouter.route('/:id/cashout').put(gameController.cashout); // cashout

  return gameRouter;
}

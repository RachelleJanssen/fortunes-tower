import { RequestHandler, Router } from 'express';
import { GameController } from '../controllers';
// import validatorMiddleware from '../middleware/validator.middleware';

export class GameRouter {
  public static router(): Router {
    const gameRouter = Router();

    gameRouter.route('')
      .get(this.listGames()) // list all games
      .post(this.createNewGame()); // create a new game

    gameRouter.route('/:id')
      .get(this.getGameDetails()); // get the details of a game

    gameRouter.route('/:id/card')
      .put(this.getCards()); // get a new card

    gameRouter.route('/:id/cashout')
      .put(this.cashout()); // cashout

    return gameRouter;
  }

  private static listGames(): RequestHandler[] {
    return [
      // await validatorMiddleware(),
      GameController.listGamesHandler,
    ];
  }

  private static createNewGame(): RequestHandler[] {
    return [
      GameController.createNewGameHandler,
    ];
  }

  private static getGameDetails(): RequestHandler[] {
    return [
      GameController.getGameDetailsHandler,
    ];
  }

  private static getCards(): RequestHandler[] {
    return [
      GameController.getCardsHandler,
    ];
  }

  private static cashout(): RequestHandler[] {
    return [
      GameController.cashoutHandler,
    ];
  }
}

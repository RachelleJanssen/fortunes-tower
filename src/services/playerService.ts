import { Request } from 'express';
import { Player, PlayerModel } from '../models';
import { playerNotFoundError } from '../utils/error/customErrors';

declare type QueryOptions = {
  where?: { [key: string]: string };
  sort?: string;
  selectFields?: string[];
  verbose: boolean;
}

export class playerService {
  private static defaultSelectFields = ['firstName', 'lastName', 'userName', 'games']

  public static queryOptions(req: Request): QueryOptions {
    const queryOptions: QueryOptions = {
      where: req.query as { [key: string]: string },
      sort: req.query.sort as string,
      verbose: req.query.verbose === 'true',
    };

    if (queryOptions.sort && queryOptions?.where?.sort) {
      delete queryOptions.where.sort;
    }

    if (queryOptions?.where?.verbose) {
      delete queryOptions.where.verbose;
    }

    return queryOptions;
  }

  public static async listPlayers(queryOptions: QueryOptions, selectFields = this.defaultSelectFields): Promise<Player[]> {
    return PlayerModel.find(queryOptions.where || {}).select(selectFields).sort(queryOptions.sort);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static async getById(gameId: string, queryOptions: QueryOptions, selectFields = this.defaultSelectFields) {
    const player = await PlayerModel.findById(gameId).select(selectFields).populate(queryOptions.verbose ? { path: 'games' } : undefined);
    if (!player) {
      throw playerNotFoundError;
    }
    return player;
  }
}

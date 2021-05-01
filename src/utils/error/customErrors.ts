export class CustomError extends Error {
  public status: number;

  constructor(message: string, errorName: string = 'Generic Error', status: number = 500, stack?: string) {
    super(message);

    if (!stack && Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.status = status;
    this.name = errorName;
  }
}

export const playerNotFoundError = new CustomError('No player found', 'Player not found', 404);

export const functionNotImplementedError = new CustomError('function not implemented', 'Not implemented', 501);

export const gameOverError = new CustomError('Game over, action not allowed', 'Game over error', 400);

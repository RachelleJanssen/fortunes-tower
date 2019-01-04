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

export const unknownItemTypeError = new CustomError('not a known item type', 'unknown type', 400);

export const itemNotFoundError = new CustomError('No item found', 'Item not found', 404);

export const collectionNotFoundError = new CustomError('Collection not found', 'Collection not found', 404);

export const uniqueItemVialationError = new CustomError(
  "The item is a unique or limited edition, it's not possible to create more",
  'Item not renewable',
  400,
);

export const sameOwnerError = new CustomError('The current and the new owner are the same', 'Same owner', 400);

export const zeroQuantityError = new CustomError('Cannot add or subtract a quantity of zero', 'Cannot add/subtract 0', 400);

export const noQuantityToDestroyError = new CustomError(
  'There is no quantity to destroy, the item quantity is zero',
  'Zero quantity to destroy',
  400,
);

export const collectionArchivedError = new CustomError(
  "This collection is already archived, can't add any new items",
  'Collection already archived error',
  400,
);

export const functionNotImplementedError = new CustomError('function not implemented', 'Not implemented', 501);

export const duplicateItemError = new CustomError('Item with this name already found in storage', 'Duplicate item creation', 400);

export const duplicateCollectionError = new CustomError(
  'Collection with this name already found in storage',
  'Duplicate collection creation',
  400,
);

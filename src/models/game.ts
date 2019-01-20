import { Document } from 'mongoose';
import { instanceMethod, prop, Typegoose } from 'typegoose';
import { shuffle } from '../utils/array/arrayHelpers';
import { cardValues } from './card';

class Game extends Typegoose {
  // constructor(round: number, rowStatus: boolean[], rowMessages: string[], tableValue: number, multiplier: number, drawnCards: number[][], deck: number[]) {
  //   super();
  //   this.round = round;
  //   this.timestamp = new Date();
  //   this.rowStatus = rowStatus;
  //   this.rowMessages = rowMessages;
  //   this.tableValue = tableValue;
  //   this.multiplier = multiplier;
  //   this.drawnCards = drawnCards;
  //   this.deck = deck;
  // }

  // @staticMethod
  // tslint:disable-next-line:typedef
  // public static async findById(this: ModelType<Game>, id: string) {
  //   return this.findById({ id });
  // }

  @prop()
  public readonly rowStatus: boolean[] = [];
  @prop()
  public readonly rowMessages: string[] = [];
  @prop()
  public readonly tableValue: number = 0;
  @prop()
  public readonly multiplier: number = 1;
  @prop()
  public readonly timestamp: Date = new Date();
  @prop()
  private round = 1;

  @prop()
  private drawnCards: number[][] = [];
  @prop()
  private deck: number[] = [];

  @instanceMethod
  public drawCards(): void {
    for (let index = 0; index <= this.round; index += 1) {
      const randomCardIndex = Math.floor(Math.random() * this.deck.length);

      // shuffle the deck each time a card is drawn
      const newCardDrawn = shuffle(this.deck)[randomCardIndex];
      this.deck.splice(randomCardIndex, 1);
      this.drawnCards[this.round].push(newCardDrawn);
      // TODO: check each card if it overlapse with the previous row, except row 0 (since it's the tower card)
      // checkBurn(); // TODO: if burn, replace with tower card (if it's available that is) and check again. else change row status to false (meaning this row is not valid -> game over)
    }
    // TODO: after getting all cards and rowstatus === false, check if the row contains a hero. If it does then the row is saved and the game is not over yet!
    // if(!rowstatus[this.round]) {
    //   checkHeroes(); // if there is a hero, rowStatus is true
    // } else {
    // when we reach this point we didn't get a burn
    // set row status to true
    // this.rowStatus[this.round] = true;
    // calculate row total
    // calculateRow(this.drawnCards[this.round]);
    // increment round
    this.round += 1;
    // prepare an empty row for the next round
    this.drawnCards[this.round] = [];
    // }
  }
  public getDrawnCards(): number[][] {
    return this.drawnCards;
  }

  @instanceMethod
  public checkStatus(): void {
    const currentRow = this.drawnCards[this.round - 1];
    const previousRoundRow = this.drawnCards[this.round - 2];

    for (let index = 0; index < currentRow.length; index += 1) {
      if (index === 0) {
        if (currentRow[index] === previousRoundRow[index]) {
          console.log('burn at start');
          console.log(`burn on ${currentRow[index]} because of ${previousRoundRow[index]}`);
        }
      } else if (index === currentRow[currentRow.length - 1]) {
        if (currentRow[index] === previousRoundRow[index - 1]) {
          console.log('burn at end');
          console.log(`burn on ${currentRow[index]} because of ${previousRoundRow[index - 1]}`);
        }
      } else {
        if (currentRow[index] === previousRoundRow[index] || currentRow[index] === previousRoundRow[index - 1]) {
          console.log('middle burn');
          console.log(`burn on ${currentRow[index]} because of ${previousRoundRow[index - 1]}`);
        }
      }
    }
  }
  // private readDeck(): number[] {
  //   return this.deck;
  // }
  // private getrowStatus(): boolean[] {
  //   return this.rowStatus;
  // }
  // private getrowMessages(): string[] {
  //   return this.rowMessages;
  // }
  // private gettableValue(): number {
  //   return this.tableValue;
  // }
  // private getmultiplier(): number {
  //   return this.multiplier;
  // }
}

export function fillDeck(): number[] {
  const deck = [];
  let index = 0;

  for (let deckIndex = 0; deckIndex < 74; deckIndex += 1) {
    const cardsPresent = deck.filter(card => card === Object.values(cardValues)[index]).length;
    const maxCards = index === cardValues.hero ? 4 : 10;
    if (cardsPresent < maxCards) {
      deck[deckIndex] = index;
    } else {
      deck[deckIndex] = index + 1;
      index += 1;
    }
  }
  return deck;
}

export interface IGame extends Document {
  id: string;
  round: number;
  rowStatus: boolean[];
  rowMessages: string[];
  tableValue: number;
  multiplier: number;
  drawnCards: number[][];
  deck: number[];
}

export const gameModel = new Game().getModelForClass(Game);

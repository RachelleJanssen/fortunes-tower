import { cardValues } from './card';

export class Game {

  public static fromObject(gameObject: IGame): Game {
    console.log('from');
    console.log(gameObject.id);
    return new this(gameObject.id, gameObject.round, gameObject.rowStatus, gameObject.rowMessages, gameObject.tableValue, gameObject.multiplier, gameObject.drawnCards, gameObject.deck);
  }

  public id: string;
  public readonly rowStatus: boolean[] = [];
  public readonly rowMessages: string[] = [];
  public readonly tableValue: number = 0;
  public readonly multiplier: number = 1;
  private round = 1;

  private drawnCards: number[][];
  private deck: number[];

  constructor(id: string, round: number, rowStatus: boolean[], rowMessages: string[], tableValue: number, multiplier: number, drawnCards: number[][], deck: number[]) {
    this.id = id;
    this.round = round;
    this.rowStatus = rowStatus;
    this.rowMessages = rowMessages;
    this.tableValue = tableValue;
    this.multiplier = multiplier;
    this.drawnCards = drawnCards;
    this.deck = deck;
  }

  public drawCards(): void {
    for (let index = 0; index <= this.round; index += 1) {
      const randomCardIndex = Math.floor(Math.random() * this.deck.length);

      const newCardDrawn = this.deck[randomCardIndex];
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
    const maxCards = (index === cardValues.hero) ? 4 : 10;
    if (cardsPresent < maxCards) {
      deck[deckIndex] = index;
    } else {
      deck[deckIndex] = index + 1;
      index += 1;
    }
  }
  return deck;
}

export interface IGame {
  id: string;
  round: number;
  rowStatus: boolean[];
  rowMessages: string[];
  tableValue: number;
  multiplier: number;
  drawnCards: number[][];
  deck: number[];
}

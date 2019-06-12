import { Document } from 'mongoose';
import { instanceMethod, prop, Typegoose } from 'typegoose';
import { shuffle } from '../utils/array/arrayHelpers';
import { cardValues } from './card';

interface IRowMessage {
  rowTotal: number;
  message: string;
}

class Game extends Typegoose {

  @prop()
  public readonly rowStatus: boolean[] = [];
  @prop()
  public readonly rowMessages: IRowMessage[] = [];
  @prop()
  public readonly tableValue: number = 0;
  @prop()
  public readonly multiplier: number = 1;
  @prop()
  public readonly timestamp: Date = new Date();
  @prop()
  public cashout: number = 0;
  @prop()
  private round = 1;

  @prop()
  private drawnCards: number[][] = [];
  @prop()
  private deck: number[] = [];

  @instanceMethod
  public drawCards(): void {
    if (this.rowStatus[this.round - 1]) { // checking for burn status of previous row
      // game is over, no more card draws allowed
      console.log('game is over, no more card draws allowed');
    }
    // prepare an empty row for the next round
    this.drawnCards[this.round] = [];
    for (let index = 0; index <= this.round; index += 1) {
      const randomCardIndex = Math.floor(Math.random() * this.deck.length);

      // shuffle the deck each time a card is drawn
      const newCardDrawn: number = shuffle(this.deck)[randomCardIndex];
      this.deck.splice(randomCardIndex, 1);
      if (this.round === 0) {
        this.drawnCards[0] = [-newCardDrawn];
      } else {
        this.drawnCards[this.round].push(newCardDrawn);
      }
      // TODO: check each card if it overlapse with the previous row, except row 0 (since it's the tower card)
      // checkBurn(); // TODO: if burn, replace with tower card (if it's available that is) and check again. else change row status to false (meaning this row is not valid -> game over)
    }
    // TODO: after getting all cards and rowstatus === false, check if the row contains a hero. If it does then the row is saved and the game is not over yet!
    if (!this.checkHasHeroes(this.drawnCards[this.round])) {
      // if there is no hero card
      if (this.round !== 0) {
        this.rowStatus[this.round] = this.checkStatus();
      } if (this.round === 0) {
        // don't check round 0
        this.rowStatus[this.round] = false;
      }
    } else {
      // there is a hero card, row is clear
      this.rowStatus[this.round] = false;
    }
    // calculating row total
    this.calculateRow(this.round, this.drawnCards[this.round]);
    // increment round
    this.round += 1;
    // if we reached the last round and we still have the tower card we have a jackpot
    if (this.round === 8 && this.drawnCards[0][0] !== null) {
      this.calculateJackpot();
    }
  }

  @instanceMethod
  public checkStatus(prevRow: number[] = this.drawnCards[this.round - 1], index = 0, burned = false, towerCard = this.drawnCards[0][0]): boolean {
    console.log(prevRow);
    while (index < prevRow.length && !burned) {
      if (prevRow[index] === this.drawnCards[this.drawnCards.length - 1][index] && this.round !== 0) {
        if (towerCard) {
          this.drawnCards[this.drawnCards.length - 1][index] = towerCard;
          delete this.drawnCards[0][0];
          return this.checkStatus(prevRow, index, false);
        }
        return true;
      }
      if (prevRow[index] === this.drawnCards[this.drawnCards.length - 1][index + 1]) {
        if (towerCard) {
          this.drawnCards[this.drawnCards.length - 1][index + 1] = towerCard;
          delete this.drawnCards[0][0];
          return this.checkStatus(prevRow, index, false);
        }
        return true;
      }
      return this.checkStatus(prevRow, index + 1, false);
    }
    // will be false
    return burned;
  }

  @instanceMethod
  public checkHasHeroes(row: number[]): boolean {
    return row.includes(cardValues.hero);
  }

  @instanceMethod
  private calculateRow(rowIndex: number, row: number[]): void {
    // TODO: if round === 8 (i.e. final round) and no game over => auto cashout
    // TODO: if there is still a tower card, trigger calculate jackpoy function
    // TODO: check if there are duplicated (like pair of 2s), if there are, then the row totals are * the kind of set
    console.log(this.rowMessages);
    this.rowMessages[rowIndex] = { rowTotal: row.reduce((total, value) => total + value), message: '' };
  }

  @instanceMethod
  private calculateJackpot(): void {
    this.cashout = this.rowMessages.reduce((total, row) => total + row.rowTotal, 0);
  }
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

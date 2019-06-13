import { Document } from 'mongoose';
import { instanceMethod, prop, Typegoose } from 'typegoose';
import { shuffle } from '../utils/array/arrayHelpers';
import { cardValues } from './card';

interface IRowMessage {
  rowTotal: number;
  message: string;
}

type GameState = 'playing' | 'gameOver' | 'cashedOut';

class Game extends Typegoose {

  @prop()
  public readonly rowStatus: boolean[] = [];
  @prop()
  public readonly rowMessages: IRowMessage[] = [];
  @prop()
  public readonly timestamp: Date = new Date();
  @prop()
  public cashout: number = 0;
  @prop()
  private tableValue: number[] = [1];
  @prop()
  private betMultiplier: number = 1;
  @prop()
  private multiplier: number[] = [1];
  @prop()
  private gameState: GameState = 'playing';
  @prop()
  private round = 1;
  @prop()
  private drawnCards: number[][] = [];
  @prop()
  private deck: number[] = [];

  public getGameState() {
    return this.gameState;
  }

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
    if (!this.checkHasHeroes(this.drawnCards[this.round]) && this.round !== 0) {
      // if there is no hero card, check round
      this.rowStatus[this.round] = this.checkStatus();
    } else {
      // there is a hero card and it's not round 0, row is clear, don't check status
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
    // loop over the cards of the previous row as long as we don't have a burn
    while (index < prevRow.length && !burned) {
      // if the corner left card is the same we have a burn
      if (prevRow[index] === this.drawnCards[this.drawnCards.length - 1][index] && this.round !== 0) {
        if (towerCard) { // if we have a tower card, replace the burned card
          this.drawnCards[this.drawnCards.length - 1][index] = towerCard;
          // delete the tower card
          delete this.drawnCards[0][0];
          // check again (in case the tower card results in a new burn)
          return this.checkStatus(prevRow, index, false);
        }
        // if there is no tower card, it's a burn
        return true;
      }
      // if the corner right card is the same we have a burn
      if (prevRow[index] === this.drawnCards[this.drawnCards.length - 1][index + 1]) {
        if (towerCard) { // if we have a tower card, replace the burned card
          this.drawnCards[this.drawnCards.length - 1][index + 1] = towerCard;
          // delete the tower card
          delete this.drawnCards[0][0];
          // check again (in case the tower card results in a new burn)
          return this.checkStatus(prevRow, index, false);
        }
        // if there is no tower card, it's a burn
        return true;
      }
      // if all is fine, pick the next card of the previous round and rerun function
      return this.checkStatus(prevRow, index + 1, false);
    }
    // will be false if there is no burn
    // will be true if there was a burn that could not be protected by tower of hero card
    if (burned) {
      this.changeGameState('gameOver');
      return burned;
    }
    return burned;
  }

  @instanceMethod
  public checkHasHeroes(row: number[]): boolean {
    return row.includes(cardValues.hero);
  }

  @instanceMethod
  public cashoutGame(): void {
    this.cashout = this.tableValue;
    this.changeGameState('cashedOut');
  }

  @instanceMethod
  private calculateRow(rowIndex: number, row: number[]): void {
    // TODO: if round === 8 (i.e. final round) and no game over => auto cashout
    // TODO: if there is still a tower card, trigger calculate jackpoy function
    // TODO: check if there are duplicated (like pair of 2s), if there are, then the row totals are * the kind of set
    // TODO: refactor this code to a function
    let count: Array<{ card: number, count: number}> = [];
    row.forEach((i) => {
      if (i !== 0) { // duplicate hero cards don't count
        if (!count.find(x => x.card === i)) {
          count.push({ card: i, count: 1});
        } else {
          const index = count.findIndex(x => x.card === i);
          count[index].count += 1;
        }
      }
    });
    // TODO: sorting isn't 100% correct
    count = count.sort(x => x.count);
    count.reverse();
    console.log(count);
    if (count[0].count > 1) {
      console.log(`${count[0].count}x multiplier!`);
      this.multiplier.push(count[0].count);
      console.log(this.multiplier);
    }

    const rowTotal = row.reduce((total, value) => total + value)
    this.rowMessages[rowIndex] = { rowTotal, message: '' };
    if (this.gameState !== 'gameOver' && this.gameState === 'playing') {
      this.tableValue = rowTotal;
    } else if (this.gameState === 'gameOver') {
      this.tableValue = 0;
    }
  }

  @instanceMethod
  private calculateJackpot(): void {
    this.tableValue = this.rowMessages.reduce((total, row) => total + row.rowTotal, 0);
    this.cashout = this.tableValue;
  }

  private changeGameState(newState: GameState): void {
    this.gameState = newState;
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

import { prop, getModelForClass } from '@typegoose/typegoose';
import { shuffle } from '../utils/array/arrayHelpers';
import { CustomError } from '../utils/error/customErrors';
import { cardValues, DeckType } from './card';

interface IRowMessage {
  rowTotal: number;
  message: string;
}

export interface INewGameBody {
  bet: number;
  deck: DeckType;
}

interface IDuplicates { card: number; count: number; }

// eslint-disable-next-line no-shadow
export enum GameState {
  // eslint-disable-next-line no-unused-vars
  PLAYING = 'playing',
  // eslint-disable-next-line no-unused-vars
  GAMEOVER = 'gameOver',
  // eslint-disable-next-line no-unused-vars
  CHASHEDOUT = 'cashedOut',
}

class Game {
  @prop()
  public readonly rowStatus: boolean[] = [];

  @prop()
  public readonly rowMessages: IRowMessage[] = [];

  @prop()
  public readonly timestamp: Date = new Date();

  @prop()
  public cashout: number = 0;

  @prop()
  private tableValue: number = 1;

  @prop()
  private betMultiplier: number = 1;

  @prop()
  private multiplier: number[] = [1];

  @prop({ enum: GameState })
  private _gameState: GameState = GameState.PLAYING;

  @prop()
  private round = 1;

  @prop()
  private drawnCards: number[][] = [];

  @prop()
  private deck: number[] = [];

  public get gameState(): GameState {
    return this._gameState;
  }

  public set gameState(value: GameState) {
    this._gameState = value;
  }

  // public changeGameState(newState: GameState): void {
  //   this._gameState = newState;
  // }

  public drawCards(): void {
    // checking for burn status of previous row
    if (this.rowStatus[this.round - 1]) {
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
        // TODO: remove the minus, this is purely to easily track where the tower card went
        this.drawnCards[0] = [newCardDrawn];
      } else {
        // console.log(newCardDrawn);
        this.drawnCards[this.round].push(newCardDrawn);
      }
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
    if (this.round === 8) {
      if (this.drawnCards[0][0] !== null) {
        this.calculateJackpot();
      } else {
        // round 8 is an auto cashout
        this._gameState = GameState.CHASHEDOUT;
      }
    }
  }

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
      this._gameState = GameState.GAMEOVER;
      return burned;
    }
    return burned;
  }

  // TODO fix this eslint error
  // eslint-disable-next-line class-methods-use-this
  public checkHasHeroes(row: number[]): boolean {
    return row.includes(cardValues.hero);
  }

  public cashoutGame(): void {
    this.cashout = this.tableValue;
    this._gameState = GameState.CHASHEDOUT;
  }

  private checkDuplicates(row: number[]): void {
    const duplicates: IDuplicates[] = [];
    row.forEach((card) => {
      // duplicate hero cards don't count
      if (card !== cardValues.hero) {
        // if the number hasn't been encountered yet, add it to the count
        if (!duplicates.find((x) => x.card === card)) {
          duplicates.push({ card, count: 1 });
        } else {
          // find the index and +1 the count
          const index = duplicates.findIndex((x) => x.card === card);
          duplicates[index].count += 1;
        }
      }
    });
    // for each card, that has a duplicate, add it to the multiplier array
    duplicates.filter((x) => x.count > 1).forEach((duplicate) => this.multiplier.push(duplicate.count));
  }

  private calculateRow(rowIndex: number, row: number[]): void {
    this.checkDuplicates(row);

    const rowTotal = row.reduce((total, value) => total + value);
    this.rowMessages[rowIndex] = { rowTotal, message: '' };
    if (this._gameState !== 'gameOver' && this._gameState === 'playing') {
      this.tableValue = rowTotal * this.betMultiplier * (this.multiplier.reduce((total, multiply) => total * multiply));
    } else if (this._gameState === 'gameOver') {
      this.tableValue = 0;
    }
  }

  private calculateJackpot(): void {
    this.tableValue = this.rowMessages.reduce((total, row) => total + row.rowTotal, 0);
    this.cashout = this.tableValue;
  }
}

// Emerald deck: contains 4 Hero cards and 70 numbered cards (10 of each number).
// Ruby deck: contains 4 Hero cards and 63 numbered cards (9 of each number).
// Diamond deck: contains 4 Hero cards and 56 numbered cards (8 of each number).

export function fillDeck(deckType: DeckType): number[] {
  const deck = [];
  let index = 0;
  let deckSize: number;
  let maxNumberCards;
  const maxHeroCards = 4;
  switch (deckType) {
    case DeckType.EMERALD:
      maxNumberCards = 10;
      deckSize = (maxNumberCards * 7) + maxHeroCards;
      break;
    case DeckType.RUBY:
      maxNumberCards = 9;
      deckSize = (maxNumberCards * 7) + maxHeroCards;
      break;
    case DeckType.DIAMOND:
      maxNumberCards = 8;
      deckSize = (maxNumberCards * 7) + maxHeroCards;
      break;

    default:
      throw new CustomError('Invalid deck choice', 'InvalidDeckError', 400);
  }

  console.log('deck size', deckSize);

  for (let deckIndex = 0; deckIndex < deckSize; deckIndex += 1) {
    // eslint-disable-next-line no-loop-func
    const cardsPresent = deck.filter((card) => card === Object.values(cardValues)[index]).length;
    const maxCards = index === cardValues.hero ? maxHeroCards : maxNumberCards;
    if (cardsPresent < maxCards) {
      deck[deckIndex] = index;
    } else {
      deck[deckIndex] = index + 1;
      index += 1;
    }
  }
  console.log(deck);
  return deck;
}

export interface IGame {
  round: number;
  rowStatus: boolean[];
  rowMessages: string[];
  tableValue: number;
  multiplier: number[];
  betMultiplier: number;
  drawnCards: number[][];
  deck: number[];
  _gameState: GameState;
}

export const GameModel = getModelForClass(Game, { schemaOptions: { validateBeforeSave: true } });

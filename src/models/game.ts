import { guidGenerator } from '../utils/number/numberHelpers';
import { Deck } from './deck';

export class Game {
  public id: string;
  public deck: Deck;
  public drawnCards = [];
  constructor() {
    this.id = guidGenerator();
    this.deck = new Deck();
    this.drawnCards = [];
  }
}

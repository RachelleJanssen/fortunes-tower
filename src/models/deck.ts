import { cardValues } from './card';

export class Deck {
  public cards: number[] = [];
  constructor() {
    let index = 0;

    for (let deckIndex = 0; deckIndex < 74; deckIndex += 1) {
      const cardsPresent = this.cards.filter(card => card === Object.values(cardValues)[index]).length;
      const maxCards = (index === cardValues.hero) ? 4 : 10;
      if (cardsPresent < maxCards) {
        this.cards[deckIndex] = index;
      } else {
        this.cards[deckIndex] = index + 1;
        index += 1;
      }
    }
  }
}

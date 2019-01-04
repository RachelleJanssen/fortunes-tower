enum validValues {
  hero = 0,
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
}

export const cardValues = {
  hero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
};

export class Card {
  public value: validValues;
  constructor(value: validValues) {
    this.value = value;
  }
}

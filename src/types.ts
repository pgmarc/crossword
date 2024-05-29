export type Crossword = Cell[][];

export interface Cell {
  x: number;
  y: number;
  type?: "block";
}

export interface CrosswordInfo {
  numWords: number;
  numAcross: number;
  numDown: number;
  wordsPositions: Cell[];
  acrossPositions: Cell[];
  downPositions: Cell[];
}

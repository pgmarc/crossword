export type Crossword = Cell[][];

export type Cell = {
  label?: string;
  dark: boolean;
  across?: string;
  down?: string;
};

export interface Position {
  x: number;
  y: number;
  label: string;
}

export interface Dic {
  [key: string]: Cell;
}

export interface CrosswordInfo {
  crossword: Crossword;
  numWords: number;
  numWordsAcross: number;
  numWordsDown: number;
}

export interface CrosswordGame extends CrosswordInfo {
  numCols: number;
  numRows: number;
  date: Date;
}

export type CrosswordGameDumps = CrosswordGame[];

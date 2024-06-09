export interface CrosswordGame extends CrosswordInfo {
  date: Date;
  numCols: number;
  numRows: number;
}

export interface CrosswordInfo {
  crossword: Crossword;
  clues: CrosswordClues;
  numWords: number;
  numWordsAcross: number;
  numWordsDown: number;
}

export type Crossword = Cell[][];

export type Cell = {
  label?: string;
  dark: boolean;
  solution: string;
  across?: string;
  down?: string;
};

export interface CrosswordClues {
  across: Clue[];
  down: Clue[];
}

export interface Clue {
  label: string;
  hint: string;
}

export interface Position {
  x: number;
  y: number;
  label: string;
}

export type CrosswordGameDumps = CrosswordGame[];

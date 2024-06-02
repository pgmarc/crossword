export type Crossword = {
  formattedCrossword: string[][];
  crossword: AdvancedGrid;
};

export type AdvancedGrid = Cell[][];

export interface Cell extends Position {
  label?: string;
  across: boolean;
  down: boolean;
  dark: boolean;
}

export interface Dic {
  [key: string]: Cell;
}

interface Position {
  x: number;
  y: number;
}

export interface CrosswordInfo {
  crossword: AdvancedGrid;
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

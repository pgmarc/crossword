import { Crossword, CrosswordClues } from "./types";

export interface Xword {
  date: string;
  numCols: number;
  numRows: number;
  numWords: number;
  numWordsAcross: number;
  numWordsDown: number;
  crossword: Crossword;
  clues: CrosswordClues;
}

interface Error {
  type: string;
  title: string;
  date: string;
}

type JSONResponse =
  | {
      xword: Xword;
      error: undefined;
    }
  | {
      xword: undefined;
      error: Error;
    };

export async function fetchWords(offset: number, wordsToSearch: string) {
  const res = await fetch(`http://localhost:3000/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: offset, word: wordsToSearch }),
  });

  return res.json();
}

export function formatDate(date: string) {
  const res = new Date(date);

  const month = res.getMonth() + 1;
  const day = res.getDate();
  const year = res.getFullYear();

  return `${year}-${month > 9 ? month : "0" + month}-${
    day > 9 ? day : "0" + day
  }`;
}

export function computeDimensions(numRows: number, numCols: number) {
  if (numRows < 11 || numCols < 11) {
    return 70;
  } else if (numRows >= 11 && numCols >= 11) {
    return 50;
  } else {
    return 30;
  }
}

function getCrosswordSolution(grid: Crossword): string {
  return grid.reduce(
    (acc, currValue) =>
      acc + currValue.reduce((acc, currValue) => acc + currValue.dark, ""),
    ""
  );
}

export async function getCrosswords() {
  const response = await fetch("http://127.0.0.1:3000/crosswords");
  return response.json();
}

export async function getCrossword(date: string): Promise<Xword> {
  const response = await fetch(`http://localhost:3000/crosswords/${date}`);

  const { xword, error }: JSONResponse = await response.json();

  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(xword);
}

export async function postCrosswordSolution(
  date: string,
  crossword: Crossword
) {
  const response = await fetch(
    `http://localhost:3000/crosswords/${date}/solution`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        solution: getCrosswordSolution(crossword),
      }),
    }
  );

  return response.json();
}

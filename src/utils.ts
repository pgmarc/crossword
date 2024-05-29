import { Cell, Crossword, CrosswordInfo } from "./types";

export function parseCrossword(
  numRows: number,
  numCols: number,
  crossword: string
): Crossword {
  let index = 0;
  let row = 1;
  let col = 1;
  let currentRow: Cell[] = [];
  const cr: Crossword = [];
  while (index < crossword.length) {
    if (cr.length === numRows && cr[0].length === numCols) {
      break;
    }

    const character = crossword[index];

    switch (character) {
      case "?":
        currentRow.push({ x: row, y: col });
        if (index === crossword.length - 1) {
          cr.push(currentRow);
        }
        break;
      case ".":
        if (index === crossword.length - 1) {
          cr.push(currentRow);
        }
        currentRow.push({ x: row, y: col, type: "block" });
        break;
      case "\n": {
        cr.push(currentRow);
        col = 0;
        currentRow = [];
        row++;
        break;
      }
      default:
        throw Error(`Unrecognized character ${character}`);
    }

    index++;
    col++;
  }

  if (cr.length * cr[0].length !== numRows * numCols) {
    throw Error(
      `Crossword should be ${numRows}x${numCols}, but got ${cr.length}x${cr[0].length} instead`
    );
  }

  return cr;
}

export function findDownAndAcross(crossword: Crossword): CrosswordInfo {
  const wordsPositions = [];
  const acrossPositions = [];
  const downPositions = [];
  const numRows = crossword.length;
  const numCols = crossword[0].length;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const currentCell = crossword[row][col];
      console.log(currentCell);
      if (!!currentCell?.type) {
        continue;
      }

      const isPreviousAcrossCellBlock =
        currentCell.y - 1 === 0 || !!crossword[row][col - 1]?.type;
      const isAcrossWord =
        Math.abs(currentCell.y - numCols) >= 2 &&
        !crossword[row][col + 1]?.type &&
        !crossword[row][col + 2]?.type;
      if (isPreviousAcrossCellBlock && isAcrossWord) {
        wordsPositions.push(currentCell);
        acrossPositions.push(currentCell);
      }

      const isPreviousDownCellBlock =
        currentCell.x - 1 === 0 || !!crossword[row - 1][col]?.type;
      const isDownWord =
        Math.abs(currentCell.x - numRows) >= 2 &&
        !crossword[row + 1][col]?.type &&
        !crossword[row + 2][col]?.type;
      if (isPreviousDownCellBlock && isDownWord) {
        downPositions.push(currentCell);
        if (
          !wordsPositions.some(
            (cell) => cell.x === currentCell.x && cell.y === currentCell.y
          )
        ) {
          wordsPositions.push(currentCell);
        }
      }
    }
  }
  return {
    wordsPositions,
    acrossPositions,
    downPositions,
    numAcross: acrossPositions.length,
    numDown: downPositions.length,
    numWords: acrossPositions.length + downPositions.length,
  };
}

import {
  Crossword,
  Cell,
  CrosswordGame,
  CrosswordInfo,
  Position,
  Clue,
  CrosswordClues,
} from "./types";
import fs from "node:fs";
import readline from "node:readline";

async function parseCrosswordFileToCrossword(
  numRows: number,
  numCols: number,
  path: string
): Promise<Crossword> {
  const crossword: Crossword = [];
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.length !== numCols) {
      throw Error(
        `Crossword must have ${numCols} columns but received ${line.length} instead.`
      );
    }
    const currentRow: Cell[] = [];
    for (let col = 0; col < line.length; col++) {
      const character = line[col];
      switch (character) {
        case "?":
          currentRow.push({
            dark: false,
            solution: "<SOLUTION>",
          } as Cell);
          break;
        case ".":
          currentRow.push({
            dark: true,
            solution: ".",
          } as Cell);
          break;
        default:
          throw Error(
            `Unrecognized character with Unicode: ${character.charCodeAt(0)}`
          );
      }
    }
    crossword.push(currentRow);
  }

  if (numRows !== crossword.length || numCols !== crossword[0].length) {
    throw Error(
      `Crossword should be ${numRows}x${numCols} but received ${crossword.length}${crossword[0].length} instead.`
    );
  }
  return crossword;
}

export function findDownAndAcross(crossword: Crossword): CrosswordInfo {
  const crosswordCopy = [...crossword];
  let numCrosswordLabels = 0;
  const acrossPositions: Position[] = [];
  const downPositions: Position[] = [];

  const numRows = crossword.length;
  const numCols = crossword[0].length;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const currentCell = crossword[row][col];
      if (currentCell.dark) {
        continue;
      }

      const isPreviousAcrossCellBlock =
        col === 0 || crossword[row][col - 1].dark;
      const isAcrossWord =
        Math.abs(col - numCols) >= 3 &&
        !crossword[row][col + 1].dark &&
        !crossword[row][col + 2].dark;

      const isPreviousDownCellBlock = row === 0 || crossword[row - 1][col].dark;
      const isDownWord =
        Math.abs(row - numRows) >= 3 &&
        !crossword[row + 1][col].dark &&
        !crossword[row + 2][col].dark;

      if (
        (isPreviousAcrossCellBlock && isAcrossWord) ||
        (isPreviousDownCellBlock && isDownWord)
      ) {
        numCrosswordLabels++;
        currentCell.label = numCrosswordLabels.toString();
      }

      if (isPreviousAcrossCellBlock && isAcrossWord) {
        acrossPositions.push({
          x: row,
          y: col,
          label: numCrosswordLabels + "A",
        });
      }

      if (isPreviousDownCellBlock && isDownWord) {
        downPositions.push({ x: row, y: col, label: numCrosswordLabels + "D" });
      }

      crosswordCopy[row][col] = currentCell;
    }
  }

  const taggedCellAcross = tagWithLabelAcrossCells(
    acrossPositions,
    crosswordCopy
  );
  const taggedAcrossAndDown = tagWithLabelDownCells(
    downPositions,
    taggedCellAcross
  );

  const acrossClues = generateClues(acrossPositions);
  const downClues = generateClues(downPositions);

  const clues: CrosswordClues = {
    across: acrossClues,
    down: downClues,
  };

  return {
    crossword: taggedAcrossAndDown,
    clues,
    numWords: acrossPositions.length + downPositions.length,
    numWordsAcross: acrossPositions.length,
    numWordsDown: downPositions.length,
  };
}

function generateClues(positions: Position[]): Clue[] {
  const clues = [];
  for (const position of positions) {
    clues.push({ label: position.label, hint: "PUT YOUR CLUE HERE" });
  }
  return clues;
}

function tagWithLabelAcrossCells(
  acrossPositions: Position[],
  crossword: Crossword
): Crossword {
  const crosswordCopy = [...crossword];
  for (const position of acrossPositions) {
    let col = position.y;
    while (col < crossword[0].length && !crosswordCopy[position.x][col].dark) {
      crosswordCopy[position.x][col].across = position.label;
      col++;
    }
  }
  return crosswordCopy;
}

function tagWithLabelDownCells(
  downPositions: Position[],
  crossword: Crossword
): Crossword {
  const crosswordCopy = [...crossword];

  for (const position of downPositions) {
    let row = position.x;
    while (row < crossword.length && !crosswordCopy[row][position.y].dark) {
      crosswordCopy[row][position.y].down = position.label;
      row++;
    }
  }

  return crosswordCopy;
}

export async function rawCrossword2CrosswordGame(
  numRows: number,
  numCols: number,
  path: string
): Promise<CrosswordGame> {
  const cr = await parseCrosswordFileToCrossword(numRows, numCols, path);
  const {
    crossword,
    clues,
    numWords,
    numWordsAcross,
    numWordsDown,
  }: CrosswordInfo = findDownAndAcross(cr);

  return {
    date: new Date(),
    numRows: crossword.length,
    numCols: crossword[0].length,
    numWords,
    numWordsAcross,
    numWordsDown,
    crossword,
    clues,
  };
}

export function dumpCrosswordToJSONFile(crosswordGame: CrosswordGame) {
  const fileName =
    `CR-${crosswordGame.numRows}x${crosswordGame.numCols}` +
    `-${crosswordGame.numWords}W-${crosswordGame.numWordsAcross}A-${crosswordGame.numWordsDown}D` +
    `.json`;
  const dump = JSON.stringify(crosswordGame);
  fs.writeFile(fileName, dump, "utf-8", (err) => {
    if (err) {
      throw Error(err.message);
    }
  });
}

export function printHelp() {
  console.log(
    "Positional Arguments:\n" +
      "   1) numRows: {Number}\n" +
      "   - First argument is the number of rows of the crossword\n" +
      "   2) numCols: {Number}\n" +
      "   - Second argument is the number of columns of the crossword\n" +
      "   3) grid: --grid=<file path>\n" +
      "   - Path to the crossword grid with the proper format\n" +
      "      Format:" +
      "      - '?' is blank\n" +
      "      - '.' is a block or dark\n" +
      "      Example (5 rows, 5 cols):\n" +
      "      ..???\n" +
      "      .????\n" +
      "      ?????\n" +
      "      ????.\n" +
      "      ???..\n"
  );
}

import {
  AdvancedGrid,
  Cell,
  Crossword,
  CrosswordGame,
  CrosswordInfo,
} from "./types";
import fs from "node:fs";
import readline from "node:readline";

async function parseCrosswordFileToCrossword(
  numRows: number,
  numCols: number,
  path: string
): Promise<Crossword> {
  const formattedCrossword = [];
  const crossword: Cell[][] = [];
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentLine = 0;
  for await (const line of rl) {
    if (line.length !== numCols) {
      throw Error(
        `Crossword must have ${numCols} columns but received ${line.length} instead.`
      );
    }
    const currentRow = [];
    const characterRow = [];
    currentLine++;
    for (let col = 0; col < line.length; col++) {
      const character = line[col];
      switch (character) {
        case "?":
          characterRow.push(character);
          currentRow.push({
            x: currentLine,
            y: col + 1,
            dark: false,
            across: false,
            down: false,
          });
          break;
        case ".":
          currentRow.push({
            x: currentLine,
            y: col + 1,
            dark: true,
            across: false,
            down: false,
          });
          break;
        default:
          throw Error(
            `Unrecognized character with Unicode: ${character.charCodeAt(0)}`
          );
      }
    }
    formattedCrossword.push(characterRow);
    crossword.push(currentRow);
  }

  if (numRows !== crossword.length || numCols !== crossword[0].length) {
    throw Error(
      `Crossword should be ${numRows}x${numCols} but received ${crossword.length}${crossword[0].length} instead.`
    );
  }
  return { formattedCrossword, crossword };
}

export function findDownAndAcross(crossword: AdvancedGrid): CrosswordInfo {
  const crosswordCopy = [...crossword];
  let numCrosswordLabels = 0;
  let numWordsAcross = 0;
  let numWordsDown = 0;
  const numRows = crossword.length;
  const numCols = crossword[0].length;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const currentCell = crossword[row][col];
      if (currentCell.dark) {
        continue;
      }

      const isPreviousAcrossCellBlock =
        currentCell.y - 1 === 0 || crossword[row][col - 1].dark;
      const isAcrossWord =
        Math.abs(currentCell.y - numCols) >= 2 &&
        !crossword[row][col + 1].dark &&
        !crossword[row][col + 2].dark;

      const isPreviousDownCellBlock =
        currentCell.x - 1 === 0 || crossword[row - 1][col].dark;
      const isDownWord =
        Math.abs(currentCell.x - numRows) >= 2 &&
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
        numWordsAcross++;
        currentCell.across = true;
      }

      if (isPreviousDownCellBlock && isDownWord) {
        numWordsDown++;
        currentCell.down = true;
      }

      crosswordCopy[row][col] = currentCell;
    }
  }
  return {
    crossword: crosswordCopy,
    numWords: numWordsAcross + numWordsDown,
    numWordsAcross,
    numWordsDown,
  };
}

export async function rawCrossword2CrosswordGame(
  numRows: number,
  numCols: number,
  path: string
): Promise<CrosswordGame> {
  const cr = await parseCrosswordFileToCrossword(numRows, numCols, path);
  const { crossword, numWords, numWordsAcross, numWordsDown }: CrosswordInfo =
    findDownAndAcross(cr.crossword);

  return {
    date: new Date(),
    numRows: crossword.length,
    numCols: crossword[0].length,
    crossword,
    numWords,
    numWordsAcross,
    numWordsDown,
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
    "Valid arguments:\n" +
      "   numRows: {Number}\n" +
      "   - First argument is the number of rows of the crossword\n" +
      "   numCols: {Number}\n" +
      "   - Second argument is the number of columns of the crossword\n" +
      "   rawCrossword: --file={Path} or {Crossword}\n" +
      "   - Third argument can be either a file path or the crossword to parse"
  );
}

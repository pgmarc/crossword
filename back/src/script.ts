import { argv } from "node:process";
import path from "node:path";
import {
  dumpCrosswordToJSONFile,
  printHelp,
  rawCrossword2CrosswordGame,
} from "./utils";

const args = argv.slice(2);

if (args.length === 0) {
  console.log("You have not provided any arguments");
  printHelp();
} else if (args.length === 1 && (args[0] === "-h" || args[0] === "--help")) {
  printHelp();
} else if (args.length === 3) {
  const digitRegex = /\d+/;
  if (!digitRegex.test(args[0])) {
    throw Error("Num Rows is not a digit");
  }

  if (!digitRegex.test(args[1])) {
    throw Error("Num Cols is not a digit");
  }

  const numCols: number = Number(args[0]);
  const numRows: number = Number(args[1]);

  const fileArg = args[2].split("=");
  if (fileArg.length !== 0 && fileArg[0] === "--grid") {
    const absolutePath = path.resolve(fileArg[1]);
    rawCrossword2CrosswordGame(numRows, numCols, absolutePath).then(
      (crossword) => dumpCrosswordToJSONFile(crossword)
    );
  }
} else {
  printHelp();
}

import { expect, describe, it } from "@jest/globals";
import { findDownAndAcross, rawCrossword2CrosswordGame } from "../utils";
import path from "node:path";

describe("Testing for utils types", () => {
  it("Given a Crossword, Down and Across should add up to the total of words ", async () => {
    const absPath = path.resolve(
      __dirname,
      "..",
      "..",
      "crosswords",
      "grid-11x11-44W-22A-22D",
      "grid.txt"
    );
    const bigCrossword = await rawCrossword2CrosswordGame(11, 11, absPath);
    expect(bigCrossword.crossword.length).toBe(11);
    expect(bigCrossword.crossword[0].length).toBe(11);

    const { numWords, numWordsAcross, numWordsDown } = findDownAndAcross(
      bigCrossword.crossword
    );
    expect(numWords).toBe(44);
    expect(numWordsAcross).toBe(22);
    expect(numWordsDown).toBe(22);
  });
});

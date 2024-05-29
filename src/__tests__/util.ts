import { expect, describe, it } from "@jest/globals";
import { findDownAndAcross, parseCrossword } from "../utils";
import { CR_3x3, CR_7x7, CR_48x35 } from "../crosswords";
import { Crossword } from "../types";

describe("Testing for utils types", () => {
  it("Given a string should parse to crossword object", () => {
    const expectedCrossWord: Crossword = [
      [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
      [
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
      ],
      [
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ],
    ];
    expect(parseCrossword(3, 3, CR_3x3.rawCrossword)).toStrictEqual(
      expectedCrossWord
    );
  });

  it("Given invalid crossword should throw an error", () => {
    const crossword = "\n\n\n";

    expect(() => parseCrossword(3, 3, crossword)).toThrow();
  });

  it("Given a 7x7 crossword should parse it to object", () => {
    const expectedRows = CR_7x7.numRows;
    const expectedCols = CR_7x7.numCols;
    const bigCrossword = parseCrossword(
      expectedRows,
      expectedCols,
      CR_7x7.rawCrossword
    );
    expect(bigCrossword.length).toBe(expectedRows);
    expect(bigCrossword[0].length).toBe(expectedCols);
  });

  it("Given a big crossword, Down and Across should add up to the total of words ", () => {
    const bigCrossword = parseCrossword(
      CR_48x35.numRows,
      CR_48x35.numCols,
      CR_48x35.rawCrossword
    );
    expect(bigCrossword.length).toBe(CR_48x35.numRows);
    expect(bigCrossword[0].length).toBe(CR_48x35.numCols);

    const { numWords, numAcross, numDown } = findDownAndAcross(bigCrossword);
    expect(numAcross).toBe(CR_48x35.across);
    expect(numDown).toBe(CR_48x35.down);

    expect(numWords).toBe(CR_48x35.words);
  });
});

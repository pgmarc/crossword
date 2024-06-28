import { useEffect, useState } from "react";
import { Clues } from "./Clues";

import { useParams } from "react-router-dom";
import type { Clue, Crossword } from "./types";
import {
  Xword,
  computeDimensions,
  getCrossword,
  postCrosswordSolution,
} from "./api";
import { CrosswordGrid } from "./CrosswordGrid";
import { SearchPage } from "./SearchPage";

export function Crossword() {
  const { date } = useParams();
  const [grid, setGrid] = useState<Xword | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

  useEffect(() => {
    if (!date) {
      throw Error("No crossword for date");
    }
    getCrossword(date)
      .then((data) => {
        setGrid(data);
      })
      .catch((err) => err);
  }, [date]);

  const handleGridChange = (x: number, y: number, character: string) => {
    if (!grid) {
      throw Error("Trying to set state on a null crossword");
    }

    const newGrid = grid.crossword.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === x && colIndex === y ? { ...cell, dark: character } : cell
      )
    );
    setGrid({ ...grid, crossword: newGrid });
  };

  const handleClickClue = (label: string, clue: string) =>
    setSelectedClue({ label, hint: clue });

  const handleSubmitCrossword = () => {
    if (!date) {
      throw Error("Undefined date");
    }

    if (!grid) {
      throw Error("Trying to submit a null grid");
    }

    postCrosswordSolution(date, grid.crossword)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <main className="container">
      {grid && (
        <>
          <section className="row">
            <CrosswordGrid
              xword={grid}
              cellSize={computeDimensions(grid.numRows, grid.numCols)}
              selectedClue={selectedClue}
              onGridChange={handleGridChange}
              onCrosswordSubmit={handleSubmitCrossword}
            />
            <div className="row col">
              <Clues
                title="Horizontal"
                clues={grid.clues.across}
                onClick={handleClickClue}
              />
              <Clues
                title="Vertical"
                clues={grid.clues.down}
                onClick={handleClickClue}
              />
            </div>
          </section>
          <SearchPage />
        </>
      )}
    </main>
  );
}

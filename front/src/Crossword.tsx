import { useState } from "react";
import { Block, Cell } from "./Cell";

interface CrosswordProps {
  size: number;
}

type CrosswordData =
  | {
      x: number;
      y: number;
      ch: string;
    }
  | {
      x: number;
      y: number;
      ch: ".";
      type: "block";
    };

export function Crossword({ size }: CrosswordProps) {
  const [grid, setGrid] = useState<CrosswordData[][]>([
    [
      { ch: ".", x: 1, y: 1, type: "block" },
      { ch: "", x: 1, y: 2 },
      { ch: ".", x: 1, y: 3, type: "block" },
    ],
    [
      { ch: "", x: 2, y: 1 },
      { ch: "", x: 2, y: 2 },
      { ch: "", x: 2, y: 3 },
    ],
    [
      { ch: ".", x: 3, y: 1, type: "block" },
      { ch: "", x: 3, y: 2 },
      { ch: ".", x: 3, y: 3, type: "block" },
    ],
  ]);

  const handleGridChange = (x: number, y: number, character: string) => {
    console.log(x, y, character);
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === x && colIndex === y ? { ...cell, ch: character } : cell
      )
    );
    console.log(newGrid);
    setGrid(newGrid);
  };

  return (
    <>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => {
            if (cell.ch === ".") {
              return (
                <Block
                  key={`${cell.x}x${cell.y}`}
                  x={colIndex * size}
                  y={rowIndex * size}
                  size={size}
                />
              );
            }
            return (
              <Cell
                x={rowIndex}
                y={colIndex}
                size={size}
                label="1"
                value={grid[rowIndex][colIndex].ch}
                onChange={handleGridChange}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

import { Block, Cell } from "./Cell";
import { Xword } from "./api";
import { Clue } from "./types";

interface GridProps {
  xword: Xword;
  cellSize: number;
  selectedClue: Clue | null;
  onGridChange: (x: number, y: number, character: string) => void;
  onCrosswordSubmit: () => void;
}

export function CrosswordGrid({
  xword,
  cellSize,
  selectedClue,
  onGridChange,
  onCrosswordSubmit,
}: GridProps) {
  return (
    <section className="xword__grid col">
      <div className="card">
        {selectedClue ? (
          <p>
            <span className="tag is-large text-primary">
              <b>{selectedClue.label}</b>
            </span>{" "}
            {selectedClue.hint}
          </p>
        ) : (
          <p>Aquí se muestran las pistas. ¡Haz click en alguna!</p>
        )}
      </div>
      <hr />
      {xword.crossword.map((row, rowIndex) => (
        <div key={rowIndex} className="xword__row">
          {row.map((cell, colIndex) => {
            const isHiglighted =
              cell?.across === selectedClue?.label ||
              cell?.down === selectedClue?.label;
            if (cell.dark === ".") {
              return (
                <Block
                  key={`${rowIndex}x${colIndex}`}
                  x={colIndex * cellSize}
                  y={rowIndex * cellSize}
                  size={cellSize}
                />
              );
            }
            return (
              <Cell
                key={`${rowIndex}x${colIndex}`}
                x={rowIndex}
                y={colIndex}
                size={cellSize}
                label={cell?.label}
                highlight={isHiglighted}
                value={cell.dark}
                onChange={onGridChange}
              />
            );
          })}
        </div>
      ))}
      <button className="button primary" onClick={onCrosswordSubmit}>
        Comprobar crucigrama
      </button>
    </section>
  );
}

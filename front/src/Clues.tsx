import { Clue } from "./types";

interface CluesProps {
  title: string;
  clues: Clue[];
  onClick: (label: string, hint: string) => void;
}

export function Clues({ clues, title, onClick }: CluesProps) {
  return (
    <div>
      <h2>{title}</h2>
      <ul className="clue-enum">
        {clues.map((clue) => (
          <li
            key={clue.label}
            className="clue"
            onClick={() => onClick(clue.label, clue.hint)}
          >
            <p>
              <span>{clue.label}</span> {clue.hint}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

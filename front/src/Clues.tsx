import { Clue } from "./types";

interface CluesProps {
  title: string;
  clues: Clue[];
  onClick: (label: string, hint: string) => void;
}

export function Clues({ clues, title, onClick }: CluesProps) {
  return (
    <div className="col">
      <h2>{title}</h2>
      <hr />
      <ul>
        {clues.map((clue) => (
          <li
            className="clue"
            key={clue.label}
            onClick={() => onClick(clue.label, clue.hint)}
          >
            <p>
              <span className="tag">
                <b className="text-primary">{clue.label}</b>
              </span>{" "}
              {clue.hint}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

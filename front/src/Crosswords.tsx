import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate, getCrosswords } from "./api";

interface Crosswords {
  date: string;
  numRows: number;
  numCols: number;
  numWords: number;
  numWordsAcross: number;
  numWordsDown: number;
}

export function Crosswords() {
  const [crosswords, setCrosswords] = useState<Crosswords[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCrosswords()
      .then((data) => setCrosswords(data))
      .catch((err) => {
        console.error(err);
        setError("Connection error" + JSON.stringify(err));
      });
  }, []);

  return (
    <main>
      <h1>Crosswords</h1>
      {crosswords.length > 0 &&
        crosswords.map((cr) => (
          <Link key={cr.date} to={formatDate(cr.date)}>
            <div className="xword-info">
              <span className="xword-info__dim">
                Grid {cr.numRows}x{cr.numCols}
              </span>
              <span className="xword-info__stats">
                Number of words {cr.numWords}. Across words {cr.numWordsAcross},
                Down words {cr.numWordsDown}
              </span>
            </div>
          </Link>
        ))}
      {error && <div>{error}</div>}
    </main>
  );
}

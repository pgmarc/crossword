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
    <main className="container">
      <h1>Crucigramas</h1>
      {crosswords.length > 0 &&
        crosswords.map((cr) => (
          <Link key={cr.date} to={formatDate(cr.date)}>
            <div className="card">
              <header>
                <h2>Crucigrama {formatDate(cr.date)}</h2>
              </header>
              <p>Número de palabras: {cr.numWords}</p>
              <p>Número de palabras en horizontal: {cr.numWordsAcross}</p>
              <p>Número de palabras en vertical: {cr.numWordsDown}</p>
            </div>
          </Link>
        ))}
      {error && <div>{error}</div>}
    </main>
  );
}

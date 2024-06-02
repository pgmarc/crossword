import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Crosswords {
  id: string;
}

export default function App() {
  const [crosswords, setCrosswords] = useState<Crosswords[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:3000/crosswords")
      .then((response) => {
        if (!response.ok) {
          setError(`Something happend. Bad status code ${response.status}`);
        }

        return response.json();
      })
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
          <Link key={cr.id} to={cr.id}>
            Crossword {cr.id}
          </Link>
        ))}
      {error && <div>{error}</div>}
    </main>
  );
}

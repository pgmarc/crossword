import { useEffect, useState } from "react";
import { fetchWords } from "./api";

interface SearchState {
  searchWord: string;
  offset: number;
  data: string[];
  totalResults: number;
}

export function SearchPage() {
  const [state, setState] = useState<SearchState>({
    data: [],
    offset: 0,
    searchWord: "a?a",
    totalResults: 0,
  });

  useEffect(() => {
    if (state.searchWord !== "") {
      fetchWords(state.offset, state.searchWord).then((data) =>
        setState({ ...state, totalResults: data.count, data: data.matched })
      );
    }
  }, [state.searchWord, state.offset]);

  const handlePrevious = () =>
    setState((state) => ({ ...state, offset: state.offset - 10 }));
  const handleNext = () =>
    setState((state) => ({ ...state, offset: state.offset + 10 }));

  const numPages = Math.floor(state.totalResults / 10) + 1;
  const currentPage = Math.floor(state.offset / 10) + 1;
  const hasPrevious = currentPage !== 1;
  const hasNext = numPages !== currentPage;

  return (
    <section className="row">
      <div className="col card">
        <label>
          Buscar pista
          <input
            value={state.searchWord}
            onChange={(e) => setState({ ...state, searchWord: e.target.value })}
            name="search"
          />
        </label>
        <p className="text-primary">Página actual: {currentPage}</p>
        <footer className="row">
          <button
            className="button primary col"
            onClick={handlePrevious}
            disabled={!hasPrevious}
          >
            Anterior
          </button>
          <button
            className="button primary col"
            onClick={handleNext}
            disabled={!hasNext}
          >
            Siguiente
          </button>
        </footer>
      </div>

      <div className="col">
        <div className="row">
          <p className="col">Número de resultados: {state.totalResults}</p>
          <p className="col">
            Desde el resultado {state.offset} hasta {state.offset + 9}
          </p>
          <p className="col">Número de páginas: {numPages}</p>
        </div>
        <table className="striped">
          <thead>
            <th>
              <td>Resultados</td>
            </th>
          </thead>
          <tbody>
            {state.data.map((word) => (
              <tr key={word}>
                <td>{word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

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
          Buscar palabra en el diccionario
          <input
            value={state.searchWord}
            onChange={(e) =>
              setState({ ...state, searchWord: e.target.value, offset: 0 })
            }
            name="search"
          />
        </label>
        <p className="text-primary">
          Página: {currentPage}/{numPages}
        </p>
        <div className="row">
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
        </div>
        <div>
          <h4>Buscador inteligente</h4>
          <p>
            Si te falta alguna solución y tienes letras descubiertas búscala en
            el <strong>diccionario de español</strong> integrado.
          </p>
          <p>
            Esta herramienta es similar en funcionalidad al buscador de{" "}
            <a href="https://onelook.com/">OneLook</a>.
          </p>
          <h4>Formato de búsqueda</h4>
          <p>Puede introducir en el buscador:</p>
          <ul>
            <li>
              Cualquier letra de la <i>a</i> la <i>z</i>, tildes incluidas.
            </li>
            <li>
              <code>?</code> es un <i>comodín</i>, cualquier letra coincide con
              este símbolo.
            </li>
            <li>
              <code>*</code> representa una secuencia de cero o más caracteres
              cualesquiera.
            </li>
          </ul>
          <h4>Ejemplos</h4>
          <ul>
            <li>
              <code>*mente</code> busca palabras que terminen por <i>-mente</i>.
              Por ejemplo abreviadamente, clemente, enormemente.
            </li>
            <li>
              <code>??ano</code> busca palabras de 5 letras en las que sus dos
              primeras letras sean cualquier carácter. Por ejemplo afano, ébano,
              enano, llano, plano.
            </li>
          </ul>
        </div>
      </div>

      <div className="col">
        <p className="text-center">
          <strong>{state.totalResults}</strong> palabras coinciden con{" "}
          <strong>{state.searchWord}</strong>
        </p>
        <table className="striped">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Resultados de {state.searchWord}</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((word, index) => (
              <tr key={word}>
                <td>{state.offset + index + 1}</td>
                <td>{word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

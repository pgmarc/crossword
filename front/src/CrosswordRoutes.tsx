import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import App from "./App";
import { Crossword } from "./Crossword";

export function CrosswordRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path=":id" element={<Crossword size={100} />} />
      </Route>
    </Routes>
  );
}

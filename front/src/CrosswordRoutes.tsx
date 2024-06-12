import { Route, Routes } from "react-router-dom";
import { Crossword } from "./Crossword";
import { Crosswords } from "./Crosswords";

export function CrosswordRoutes() {
  return (
    <Routes>
      <Route path="/crosswords" element={<Crosswords />} />
      <Route path="/crosswords/:date" element={<Crossword />} />
    </Routes>
  );
}

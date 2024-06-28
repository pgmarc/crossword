import { Route, Routes } from "react-router-dom";
import { Crossword } from "./Crossword";
import { Crosswords } from "./Crosswords";

export function CrosswordRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Crosswords />} />
      <Route path="/:date" element={<Crossword />} />
    </Routes>
  );
}

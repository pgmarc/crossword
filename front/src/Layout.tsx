import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <main>
      <h1>Crossword App</h1>
      <Outlet />
    </main>
  );
}

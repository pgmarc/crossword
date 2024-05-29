import express, { Express, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { parseCrossword } from "./utils";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  fs.readFile(
    path.join(__dirname, "data", "grid-7x7-8W-33L-16B.txt"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const crossword = parseCrossword(7, 7, data);
      console.log(crossword);
      res.send(crossword);
    }
  );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

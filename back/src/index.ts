import express, { Express, Request, Response } from "express";

import { parseCrossword } from "./utils";
import { CR_48x35, CR_7x7 } from "./crosswords";
import { Crossword } from "./types";

const app: Express = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("x-powered-by", false);

app.get("/crosswords", (req: Request, res: Response) => {
  const crosswords = [{ id: "1" }, { id: "2" }];
  res.json(crosswords);
});

app.get("/crosswords/:id", (req: Request, res: Response) => {
  let crossword: Crossword = [];
  if (req.params.id === "1") {
    crossword = parseCrossword(
      CR_48x35.numRows,
      CR_48x35.across,
      CR_48x35.rawCrossword
    );
  } else {
    crossword = parseCrossword(
      CR_7x7.numRows,
      CR_7x7.numCols,
      CR_7x7.rawCrossword
    );
  }
  res.json(crossword);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

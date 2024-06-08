import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import process from "node:process";

const app: Express = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUrl, { family: 4 });

const db = mongoClient.db("test");
const crossword = db.collection("crosswords");

app.use(express.json());
app.use(cors());
app.set("x-powered-by", false);

app.get("/crosswords", (req: Request, res: Response) => {
  res.json(crossword.find());
});

app.get("/info", (req: Request, res: Response) => {
  const pipeline = [];
  crossword.aggregate([{  }]);
});

app.post("/crosswords", async (req: Request, res: Response) => {
  const cr = await crossword.insertOne({
    grid: [
      [".", ".", "?", "?", "?"],
      [".", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "."],
      ["?", "?", "?", ".", "."],
    ],
  });
  res.json(cr);
});

const server = app.listen(port, async () => {
  await connectToMongo();
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("[Server]: Server is shutting down succesfylly");
  mongoClient.close();
  server.close();
  process.exit();
});

async function connectToMongo() {
  try {
    await mongoClient.connect();
    console.log("[MongoDB]: Connected successfully to server");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

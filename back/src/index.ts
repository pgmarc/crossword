import express, { Express, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";
import { MongoClient } from "mongodb";
import process from "node:process";
import { Client } from "@elastic/elasticsearch";

const app: Express = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUrl, { family: 4 });
const elasticSearch = new Client({ node: "http://localhost:9200" });

const db = mongoClient.db("xword");
const crosswords = db.collection("crosswords");

app.use(express.json());
app.use(cors());
app.set("x-powered-by", false);

app.get("/crosswords", async (req: Request, res: Response) => {
  const options = {
    projection: { _id: 0, crossword: 0, clues: 0 },
  };
  const xwords = await crosswords.find({}, options).toArray();
  res.send(xwords);
});

app.get(
  "/crosswords/:date",
  param("date").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const mongoQuery = [
        {
          $match: {
            date: new Date(req.params.date),
          },
        },
        {
          $project: {
            numRows: true,
            numCols: true,
            numWords: true,
            numWordsAcross: true,
            numWordsDown: true,
            date: true,
            clues: true,
            crossword: {
              $map: {
                input: "$crossword",
                as: "row",
                in: {
                  $map: {
                    input: "$$row",
                    as: "cell",
                    in: {
                      $cond: {
                        if: "$$cell.dark",
                        then: {
                          $setField: {
                            field: "dark",
                            input: "$$cell",
                            value: ".",
                          },
                        },
                        else: {
                          $setField: {
                            field: "dark",
                            input: "$$cell",
                            value: "",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ];
      const xword = await crosswords.aggregate(mongoQuery).next();

      if (xword === null) {
        res.status(404).send({
          error: {
            type: "resource-not-found",
            title:
              "No se ha encontrado el crucigrama con la fecha especificada",
            date: new Date(req.params.date),
          },
        });
      } else {
        res.send({ xword: xword });
      }
    } else {
      res.status(400).send({ error: result.array() });
    }
  }
);

app.post(
  "/crosswords/:date/solution",
  param("date").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  async (req: Request, res: Response) => {
    const query = [
      {
        $match: {
          date: new Date(req.params.date),
        },
      },
      {
        $project: {
          solution: {
            $reduce: {
              input: "$crossword",
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  {
                    $reduce: {
                      input: "$$this",
                      initialValue: "",
                      in: {
                        $concat: ["$$value", "$$this.solution"],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];

    const result = await crosswords.aggregate(query).next();

    if (result === null) {
      res.status(404).send({
        type: "resource-not-found",
        title: "No se ha encontrado el crucigrama con la fecha especificada",
        date: new Date(req.params.date),
      });
    } else if (result.solution !== req.body.solution) {
      res.status(400).send({
        type: "wrong-answer",
        title: "Solución incorrecta",
        detail:
          "Parece que te ha equivocado en alguna palabra. Deberías revisar las pistas e intentarlo de nuevo",
      });
    } else {
      res.send({ message: "¡Felicidades!, has solucionado el crucigrama" });
    }
  }
);

app.post(
  "/hint",
  body("word").notEmpty(),
  body("from").notEmpty().isNumeric(),
  async (req: Request, res: Response) => {
    const numOfDocs = await elasticSearch.count({
      index: "words",
      query: {
        wildcard: {
          word: req.body.word,
        },
      },
    });
    const docs = await elasticSearch.search({
      index: "words",
      from: req.body.from,
      size: 10,
      query: {
        wildcard: {
          word: req.body.word,
        },
      },
    });
    res.send({
      count: numOfDocs.count,
      matched: docs.hits.hits.map((hit) => {
        const tempHit = hit._source as Word;
        return tempHit.word;
      }),
    });
  }
);

interface Word {
  word: string;
}

app.get("/health", async (req: Request, res: Response) => {
  const running = await elasticSearch.ping();
  res.send({ running });
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

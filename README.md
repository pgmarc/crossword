# Crossword application

The folder structure of the proyect is the following:

- front: React app to play crossword
- back: Express api to play crossword + scripts to load easily crossowords

Run mongo with docker container:

```bash
docker ps -a # List all containers
docker run -p 27017:27017 --name godo -d mongo
docker start godo
docker stop godo
docker run -e PORT=3000
```

Usefull queries

```csv
ProductName,Price
Oranges,1.99
Apples,2.99
Chicken,5.39
```

```txt
db.collection.aggregate([
  {
    "$project": {
      texto: {
        "$split": [
          "Oranges,1.99",
          ","
        ]
      }
    }
  }
])
```

Oranges,1.99 -> [Oranges, 1.99]

Object to array

```txt
db.collection.aggregate([
  {
    "$project": {
      item: 1,
      "dimensions": {
        "$objectToArray": "$dimensions"
      }
    }
  }
])
```

```json
"dimensions": {
    "width": 25,
    "heigth": 10
}
```

```json
[
  { "k": "width", "v": 25 },
  { "k": "heigth", "v": 10 }
]
```

Aplana el array y cacula su posicion en el array
con el metodo

indice = divisor \* cociente + resto
x = indice - resto / divisor
y = resto

Luego sustituye . por true
y ? por false para contar los blancos que hay

```txt
db.collection.aggregate([
  {
    $project: {
      numCols: {
        $size: {
          "$arrayElemAt": [
            "$grid",
            0
          ]
        }
      },
      numRows: {
        $size: "$grid"
      },
      grid: {
        $reduce: {
          input: "$grid",
          "initialValue": [],
          in: {
            "$concatArrays": [
              "$$value",
              "$$this"
            ]
          }
        }
      }
    }
  },
  {
    "$unwind": {
      "path": "$grid",
      "includeArrayIndex": "index"
    }
  },
  {
    "$set": {
      dark: {
        "$cond": {
          "if": {
            $eq: [
              "$grid",
              "."
            ]
          },
          "then": true,
          "else": false
        }
      }
    }
  },
  {
    $project: {
      "grid": 1,
      "dark": 1,
      "y": {
        $mod: [
          "$index",
          "$numCols"
        ]
      },
      "x": {
        $divide: [
          {
            "$subtract": [
              "$index",
              {
                $mod: [
                  "$index",
                  "$numCols"
                ]
              }
            ]
          },
          "$numCols"
        ]
      }
    }
  }
])
```

Port 9200 is used for all API calls over HTTP. This includes search and aggregations, monitoring and anything else that uses a HTTP request. All client libraries will use this port to talk to Elasticsearch
Port 9300 is a custom binary protocol used for communications between nodes in a cluster. For things like cluster updates, master elections, nodes joining/leaving, shard allocation

```bash
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.14.1
curl -X POST localhost:9200/_bulk/?pretty -H "Content-Type: application/x-ndjson" --data-binary @req
```

```bash
curl -X POST http://localhost:9200/_bulk -H "Content-Type: application/json" -d'
{ "index" : { "_index" : "words" } }
{ "word": "sana" }
{ "index" : { "_index" : "words" } }
{ "word": "gana" }
{ "index" : { "_index" : "words" } }
{ "word": "zebra" }
{ "index" : { "_index" : "words" } }
{ "word": "mono" }
{ "index" : { "_index" : "words" } }
{ "word": "portatil" }
'
curl localhost:9200/words/_search/?pretty
```

```bash
curl -X GET "localhost:9200/words/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "wildcard": {
      "word": {
        "value": "?a?a"
      }
    }
  },
  "size": 20,
  "from": 10
}
'
```

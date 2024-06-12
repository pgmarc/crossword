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

# Aplicación de crucigrama

El repositorio tiene la siguiente estructura de carpetas:

- front: Aplicación hecha en React para jugar al crucigrama
- docs: Documentación del proyecto del crucigrama
- back: API de la aplicación hecha con Express que utiliza MongoDB y Elasticsearch

## Prerequisitos

Para arrancar todos los componentes del proyecto es muy recomendable que
tenga instalado [Docker](https://www.docker.com/).

- Docker
- [NodeJS](https://nodejs.org/en)

Antes de iniciar el backend o el front ejecuta en la raiz del repositorio:

Linux

```bash
docker compose up -d
```

Poblar `elasticsearch` con las palabras del diccionario

```bash
curl localhost:9200/_bulk/?pretty -X POST -H "Content-Type: application/x-ndjson" --data-binary @req
```

## Backend

Para ejecutar el servidor de express tiene que ejecutar lo siguiente:

```bash
cd back
npm install
npm run build
node dist/index.js
```

## Frontend

Para ejecutar la aplicación de React con Node ejecuta:

Linux

```bash
cd front
npm install
npm run dev
```

## Useful commands

### Docker

```bash
docker ps -a # List all containers
docker start godo
docker stop godo
```

### Elasticsearch

Formatear respuesta json

```bash
curl localhost:9200/words/_search/?pretty
```

Buscar palabras con que cumplen el formato

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

Poblar índice con documentos

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
```

### Mongo

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

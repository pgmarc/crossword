# Aplicación de crucigrama

El repositorio tiene la siguiente estructura de carpetas:

```txt
.
└── crosswords/
    ├── back/
    │   ├── crosswords/
    │   │   └── ...
    │   └── src/
    │       └── ...
    ├── docs
    ├── front
    ├── 0_palabras_todas.txt
    ├── compose.yml
    ├── dump-ndjson.py
    ├── README.md
    ├── spanish-words.txt
    └── xwords.json
```

- `back`: API de la aplicación hecha con Express que utiliza MongoDB y Elasticsearch
- `back/crosswords`: Contiene las plantillas de los crucigramas, las soluciones y las pistas
- `front`: Aplicación hecha en React para jugar al crucigrama
- `docs`: Documentación del proyecto del crucigrama
- `dump-ndjson`: Script que convierte el archivo `0_palabras_todas.txt` al formato `ndjson`
- `xwords.json`: Documentos para importar en MongoDB

## Prerequisitos

Para arrancar todos los componentes del proyecto es muy recomendable que
tenga instalado [Docker](https://www.docker.com/).

- [Docker](https://www.docker.com/products/docker-desktop/)
- [NodeJS](https://nodejs.org/en)

Antes de iniciar el backend o el front ejecuta en la raiz del repositorio:

Linux y Windows

```bash
docker compose up -d
```

Una vez iniciado los contenedores:

1. Importa los crucigramas del archivo `xwords.json` a la instancia de MongoDB:

```bash
docker exec crossword-mongo-1 mongoimport --db=xword --collection=crosswords --file=/data/xwords.json
```

2. Puebla `elasticsearch` con las palabras del diccionario del archivo `spanish-words.txt`
   (Tarda aproximadamente 1 minuto):

```bash
# En la raiz del repositorio
curl localhost:9200/_bulk/?pretty -X POST -H "Content-Type: application/x-ndjson" --data-binary @spanish-words.txt
```

## Backend

Para ejecutar el servidor de Express tiene que ejecutar dentro de la carpeta `back` lo siguiente:

```bash
cd back # Si ya está en la carpeta back no hace falta ejecutar este comando
npm install   # Descarga las dependencias del proyecto
npm run build  # Transpila el código typescript y lo convierte a javascript, crea una carpeta dist
node dist/index.js
```

## Frontend

Para ejecutar la aplicación de React con Node ejecuta:

Linux y Windows

```bash
cd front
npm install
npm run dev
```

## Useful commands

### Docker

```bash
docker ps -a # List all containers
docker start container
docker stop container
```

### Elasticsearch

Formatear la respuesta json y que se vea bien.

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

Poblar índice con documentos en ElasticSearch

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

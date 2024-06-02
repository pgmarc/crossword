# Modelo de datos

dimension del crucigrama
width
heigth

grid:

# Convenciones de un crucigrama

La numeración de un crucigrama generalmente se empieza de izquierda a derecha y
de arriba a abajo.

Una casilla se numera si esa casilla es el principio de una palabra tanto si empieza
una palabra horizontalmente como verticalmente

Los crucigramas pueden variar en anchura y en altura pero por simplicidad se desarrollara
un crucigrama con dimensiones cuadradas.

# Para computar el crucigrama vamos a utilizar el siguiente algoritmo

Que la primera casilla que pueda contener una palabra en horizontal o vertical

¿Que es la primera casilla que contenga una palbra?

- Que tenga una casilla negra anterior en horizontal o en vertical
- La casilla en la que estes se blanca
- Que la haya al menos 3 casillas blancas en horizontal o en vertical
- Tiene que tener hueco es decir que al menos haya 3 casillas consecutivas blancas

Algoritmo

para todas las casillas

Across
A = []
Down
D = []
CASILLAS NUMERADAS = []

Para todas las casillas en una fila

Checkea horizontal

```txt
if casilla no es blanca then
  continue
else
if la casilla n+1 y n+2 no es blanca then
  continue
else
añade coordenadas CASILLAS NUMERADAS

end
```

if la casilla es blanca

checkear si empieza palabra en horizontal
checkear si empieza palabra en vertical

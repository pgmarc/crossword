import json

with open("req", "w", encoding="utf-8") as dump:
    with open("0_palabras_todas.txt", "r", encoding="utf-8") as rae:
        for word in rae:
            dump.write('{ "index": { "_index": "words" } }\n')
            dump.write('{{ "word": "{}" }}\n'.format(word.strip()))

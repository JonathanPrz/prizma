"""Solo selecciona IDs para lectura; no emite juicios ni notas."""
import csv
import json
import random
from pathlib import Path

raiz = Path(__file__).resolve().parents[2]
catalogo = json.loads((raiz / 'data/recomendaciones.json').read_text())
respaldadas = set()
for nombre in ['dua-respaldo-A.csv', 'dua-respaldo-B.csv']:
    with (raiz / 'docs/revision-fuentes' / nombre).open(encoding='utf-8-sig') as f:
        respaldadas.update(r['ficha'] for r in csv.DictReader(f, delimiter=';') if r['veredicto'] == 'respaldada')
with (raiz / 'docs/revision-fuentes/riesgo.csv').open(encoding='utf-8-sig') as f:
    riesgo = {r['ficha'] for r in csv.DictReader(f, delimiter=';')}
azar = random.Random('042')
dua = azar.sample(sorted(respaldadas & {r['id'] for r in catalogo}), 15)
fuera = sorted(r['id'] for r in catalogo if r['id'] not in riesgo)
resto = azar.sample(fuera, 10)
print(json.dumps({'orden':'IDs ordenados lexicográficamente; una RNG, primero DUA y luego fuera de riesgo', 'poblacion_dua':len(respaldadas), 'poblacion_fuera':len(fuera), 'dua':dua, 'fuera':resto},ensure_ascii=False,indent=2))

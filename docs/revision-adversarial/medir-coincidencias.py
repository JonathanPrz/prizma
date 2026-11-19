"""Medición acotada de coincidencias literales; no certifica originalidad."""
import json
import re
from pathlib import Path

raiz = Path(__file__).resolve().parents[2]
catalogo = json.loads((raiz / 'data/recomendaciones.json').read_text())
def secuencias(texto):
    p = re.findall(r"[\wáéíóúñü']+", texto.lower())
    return {tuple(p[i:i+8]) for i in range(len(p)-7)}

resultado = {}
for nombre in ['docs/fuentes/dua-3.0.md', 'docs/fuentes/cif.md', 'docs/fuentes/internacional/README.md']:
    fuente = secuencias((raiz / nombre).read_text())
    resultado[nombre] = []
    for ficha in catalogo:
        for campo in ['titulo', 'como', 'porque']:
            textos = ficha[campo] if isinstance(ficha[campo], list) else [ficha[campo]]
            n = sum(len(secuencias(t) & fuente) for t in textos)
            if n:
                resultado[nombre].append({'id':ficha['id'], 'campo':campo, 'coincidencias_8_palabras':n})
assert len(catalogo) == len({r['id'] for r in catalogo})
print(json.dumps(resultado, ensure_ascii=False, indent=2))

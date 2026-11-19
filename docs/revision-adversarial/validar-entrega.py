"""Comprueba estructura y trazabilidad de IDs; no valida juicios ni fuentes."""
import json
import re
import subprocess
from pathlib import Path

carpeta = Path(__file__).resolve().parent
raiz = carpeta.parents[1]
def leer(nombre):
    return json.loads((carpeta / nombre).read_text())

casos = leer('casos-propios.json')
resultados = leer('resultados-casos.json')
catalogo = {r['id'] for r in json.loads((raiz / 'data/recomendaciones.json').read_text())}
assert len(casos) == 15 == len({c['id'] for c in casos})
assert [c['id'] for c in casos] == [c['id'] for c in resultados]
for caso in casos:
    assert caso['justificacion'] and caso['caso'] and caso['apoyos']
    assert set(caso['apoyos'] + caso['dua']) <= catalogo
fichas = (carpeta / 'fichas.md').read_text()
ids = re.findall(r'^\d+\. \*\*`([^`]+)`', fichas, re.M)
assert len(ids) == 40 == len(set(ids))
assert set(ids) <= catalogo
muestra = leer('muestra.json')
assert len(muestra['dua']) == 15 and len(muestra['fuera']) == 10
assert set(muestra['dua'] + muestra['fuera']) <= set(ids)
readme = (carpeta / 'README.md').read_text()
objeciones = re.findall(r'^\| O(\d+) \|', readme, re.M)
assert list(map(int, objeciones)) == list(range(1, 28))
for linea in readme.splitlines():
    if re.match(r'^\| O\d+ \|', linea):
        assert linea.rstrip().endswith('| |'), 'La respuesta de Claude debe quedar vacía'
for archivo in carpeta.glob('*.json'):
    json.loads(archivo.read_text())
versionados = subprocess.check_output(['git','diff','--name-only','main'],cwd=raiz,text=True).splitlines()
nuevos = subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=raiz,text=True).splitlines()
assert all(p.startswith('docs/revision-adversarial/') for p in versionados + nuevos)
print('Estructura correcta: 15 casos, 40 fichas, 27 objeciones con respuesta vacía; cambios dentro del alcance.')

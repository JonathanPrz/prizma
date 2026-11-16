"""Comprueba texto real de los ocho PDF de ejemplo, normalizando saltos de línea."""
import json
import re
from pathlib import Path
import fitz

carpeta = Path(__file__).resolve().parent
raiz = carpeta.parents[2]
resultados = []
for archivo in sorted((raiz / 'docs/marca/040-preguntas').glob('*.pdf')):
    estudiante = archivo.name.startswith('estudiante')
    with fitz.open(archivo) as pdf:
        texto = re.sub(r'\s+', ' ', ' '.join(p.get_text() for p in pdf))
        registro = dict(archivo=str(archivo.relative_to(raiz)), paginas=len(pdf),
                        criterio=('Reconoce cuatro de cinco señales.' if estudiante else 'Identifica las alertas del puesto.') in texto,
                        modalidad='Lupa o ampliación' in texto,
                        protocolo=('¿Existe un PAEC, un PACI o el protocolo DEC? Sí' in texto) if estudiante else None,
                        compartir=('Solo los ajustes con la jefatura.' in texto) if not estudiante else None)
    assert registro['criterio'] and registro['modalidad'], registro
    assert registro['protocolo'] if estudiante else registro['compartir'], registro
    resultados.append(registro)
assert len(resultados) == 8
(carpeta / 'pdf.json').write_text(json.dumps(resultados, ensure_ascii=False, indent=2) + '\n')
print('Correcto: ocho PDF descargados contienen criterio, modalidad y protocolo/decisión de compartir.')

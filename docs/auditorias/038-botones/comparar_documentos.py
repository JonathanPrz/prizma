"""Compara títulos del modelo, vista y PDF. No prueba una impresora nativa."""
import json
import re
from pathlib import Path
import fitz

carpeta = Path(__file__).resolve().parent
normalizar = lambda texto: re.sub(r'\s+', ' ', texto).strip()
resultados = []
for archivo in sorted(carpeta.glob('*-modelo.json')):
    caso = archivo.name.removesuffix('-modelo.json')
    modelo = json.loads(archivo.read_text())
    # Las acciones están en grupos del curso, de cada estudiante o del centro.
    def acciones(nodo):
        if isinstance(nodo, dict):
            for clave, valor in nodo.items():
                if clave == 'acciones':
                    yield from valor
                elif isinstance(valor, (dict, list)):
                    yield from acciones(valor)
        elif isinstance(nodo, list):
            for valor in nodo:
                yield from acciones(valor)
    elegidas = list(acciones(modelo))
    vista = normalizar((carpeta / (caso + '-vista.txt')).read_text())
    with fitz.open(carpeta / (caso + '.pdf')) as pdf, fitz.open(carpeta / (caso + '-impresion-css.pdf')) as css:
        texto = normalizar(' '.join(p.get_text() for p in pdf))
        texto_css = normalizar(' '.join(p.get_text() for p in css))
        fila = dict(caso=caso, paginasPDF=len(pdf), paginasCSS=len(css), acciones=len(elegidas),
                    titulosFaltantesVista=[a['titulo'] for a in elegidas if normalizar(a['titulo']) not in vista],
                    titulosFaltantesPdf=[a['titulo'] for a in elegidas if normalizar(a['titulo']) not in texto],
                    titulosFaltantesCSS=[a['titulo'] for a in elegidas if normalizar(a['titulo']) not in texto_css],
                    paginasCSSSinTexto=[i + 1 for i, p in enumerate(css) if not p.get_text().strip()],
                    notaEnVista='NOTA_DUA' in vista, notaEnPDF='NOTA_DUA' in texto,
                    reflexionEnPDF='REFLEXION_DUA' in texto,
                    inicialesEnCentro=bool(re.search(r'\bIP2?\b', texto)) if caso.endswith('-centro') else None)
        assert not fila['titulosFaltantesVista'], fila
        assert not fila['titulosFaltantesPdf'], fila
        if caso.startswith('dua-'):
            assert fila['notaEnPDF'] and fila['reflexionEnPDF'], fila
        if caso.endswith('-centro'):
            assert not fila['inicialesEnCentro'], fila
        resultados.append(fila)
(carpeta / 'comparacion-documentos.json').write_text(json.dumps(resultados, ensure_ascii=False, indent=2) + '\n')
print(f'{len(resultados)} documentos: títulos completos en vista/PDF descargado; diferencias CSS registradas.')

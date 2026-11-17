"""Revisa los documentos descargados por los recorridos C; no imprime ni modifica los PDF."""
import json
import re
from pathlib import Path
import fitz

carpeta = Path(__file__).resolve().parent
resultados = json.loads((carpeta / 'resultados.json').read_text())
registro = []
for recorrido in resultados:
    for nombre in recorrido['documentos']:
        archivo = carpeta / nombre
        modelo = json.loads((carpeta / nombre.replace('.pdf', '-modelo.json')).read_text())
        with fitz.open(archivo) as pdf:
            texto = re.sub(r'\s+', ' ', ' '.join(p.get_text() for p in pdf))
            paginas = len(pdf)
        acciones = modelo.get('acciones', []) if modelo.get('centro') else [a for g in modelo['grupos'] for a in g['acciones']]
        faltantes = [a['titulo'] for a in acciones if re.sub(r'\s+', ' ', a['titulo']) not in texto]
        assert not faltantes, (nombre, faltantes)
        personal = any(g.get('estudiante') or g.get('trabajador') for g in modelo.get('grupos', []))
        criterio = 'Prueba técnica: realizar tres de cuatro pasos con el apoyo acordado.'
        if personal:
            assert criterio in texto, nombre
        if recorrido['id'] in ('S3', 'S5'):
            assert any(g.get('protocolo') is True for g in modelo['grupos']), nombre
            assert '¿Existe un PAEC, un PACI o el protocolo DEC? Sí' in texto, nombre
        if recorrido['id'] == 'S2':
            assert 'Lengua de señas' in texto and 'Coordina un intérprete de lengua de señas' in texto, nombre
        if recorrido['id'] == 'S4':
            assert 'Otra lengua materna' in texto, nombre
        if modelo.get('trabajo'):
            assert 'Prueba técnica: compartir solo los ajustes con la jefatura.' in texto, nombre
        if modelo.get('centro'):
            assert criterio not in texto and not re.search(r'\bAA\b', texto), nombre
            assert '¿Cómo sabremos que funciona?' in texto, nombre
        registro.append(dict(archivo=nombre, caso=recorrido['id'], ancho=recorrido['ancho'], paginas=paginas,
                             acciones=len(acciones), titulosFaltantes=faltantes, personal=personal,
                             criterioConservado=(criterio in texto) if personal else None,
                             reservaCentroComprobada=True if modelo.get('centro') else None))
assert len(registro) == 20
(carpeta / 'pdf.json').write_text(json.dumps(registro, ensure_ascii=False, indent=2) + '\n')
print('Correcto: 20 PDF, títulos presentes, criterio en planes y reserva en documentos del centro.')

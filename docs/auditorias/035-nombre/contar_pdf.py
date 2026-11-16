"""Cuenta el nombre en texto extraíble de PDF versionados, separado de UTF-8."""
import json
import re
import subprocess
from pathlib import Path
import fitz  # PyMuPDF ya instalado en el entorno de auditoría; no dependencia del sitio.

raiz = Path(__file__).resolve().parents[3]
rutas = subprocess.check_output(['git', 'ls-files', '-z'], cwd=raiz).decode().split('\0')
archivos = []
for ruta in rutas:
    if not ruta.lower().endswith('.pdf') or ruta.startswith('docs/auditorias/035-nombre/'):
        continue
    with fitz.open(raiz / ruta) as doc:
        paginas = [{'pagina': i + 1, 'apariciones': len(re.findall('prizma', p.get_text(), re.I))} for i, p in enumerate(doc)]
        archivos.append({'archivo': ruta, 'paginas': paginas, 'apariciones': sum(p['apariciones'] for p in paginas)})
salida = {'metodo': 'Texto extraíble de PDF versionados con PyMuPDF, sin OCR ni metadatos. No incluye capturas PNG. Se mantiene separado del conteo de archivos UTF-8.', 'total': sum(a['apariciones'] for a in archivos), 'pdfExaminados': len(archivos), 'versionPyMuPDF': fitz.VersionBind, 'archivos': archivos}
(raiz / 'docs/auditorias/035-nombre/apariciones-pdf.json').write_text(json.dumps(salida, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: salida[k] for k in ('total', 'pdfExaminados', 'versionPyMuPDF')}))

"""Exporta el catálogo a una planilla para revisión profesional.

Uso: python3 scripts/exportar_revision.py [salida.xlsx]
"""
import json
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

RAIZ = Path(__file__).resolve().parent.parent
catalogo = json.loads((RAIZ / "data/recomendaciones.json").read_text(encoding="utf-8"))
fuentes = {f["id"]: f["cita"] for f in json.loads((RAIZ / "data/fuentes.json").read_text(encoding="utf-8"))}

DIMENSIONES = ["Atención y organización", "Lectura, escritura y cálculo", "Comprender lo que se dice o se lee", "Interacción social",
               "Emociones y regulación", "Visión", "Sensibilidad sensorial", "Movimiento y motricidad",
               "Salud y energía", "Identidad, lengua y pertenencia", "Espacio, tiempo y actitudes",
               "Expresarse oralmente", "Audición", "Necesita más desafío"]
TIPOS = {"dua": "DUA (todo el curso)", "acceso": "Adecuación de acceso", "objetivos": "Adecuación en los objetivos",
         "desregulacion": "Desregulación", "adicional": "Apoyo adicional", "practica-profesional": "Práctica profesional"}
SUBTIPOS = {"presentacion": "Presentación", "respuesta": "Respuesta", "entorno": "Entorno", "tiempo": "Tiempo",
            "graduacion": "Graduación", "priorizacion": "Priorización", "temporalizacion": "Temporalización",
            "enriquecimiento": "Enriquecimiento", "eliminacion": "Eliminación",
            "institucion": "Liceo o institución", "centro": "Centro de práctica", "estudiante": "Preparar al estudiante",
            "antes": "Antes: prevenir", "durante": "Durante: acompañar", "despues": "Después: reparar"}
MOMENTOS = {"antes": "Antes", "durante": "Durante", "despues": "Después", "toda-la-clase": "En toda la clase"}
NIVELES = {"parvularia": "Parvularia", "basica": "Básica", "media": "Media", "superior": "Superior"}
RESPALDO = {"investigacion-solida": "Investigación sólida", "investigacion-moderada": "Investigación moderada",
            "consenso-expertos": "Consenso de expertos", "orientacion-oficial": "Orientación oficial", "norma-legal": "Norma legal"}

COLUMNAS = [("Id", 18), ("Tipo", 22), ("Subtipo o momento", 18), ("DUA", 7), ("Niveles", 22), ("Situaciones", 30),
            ("Práctica", 9), ("Título", 40), ("Cómo (pasos)", 60), ("Por qué funciona", 45), ("Respaldo", 18),
            ("Fuentes", 50), ("Decisión", 12), ("Comentario de revisión", 50)]

libro = Workbook()
hoja = libro.active
hoja.title = "Catálogo"
hoja.append([c for c, _ in COLUMNAS])
for i, (_, ancho) in enumerate(COLUMNAS, start=1):
    hoja.column_dimensions[hoja.cell(1, i).column_letter].width = ancho
    celda = hoja.cell(1, i)
    celda.font = Font(bold=True, color="FFFFFF")
    celda.fill = PatternFill("solid", fgColor="1F2A44")
    celda.alignment = Alignment(wrap_text=True, vertical="top")

for r in catalogo:
    hoja.append([
        r["id"], TIPOS.get(r["tipo"], r["tipo"]),
        SUBTIPOS.get(r.get("subtipo"), MOMENTOS.get(r.get("momento"), "")),
        r.get("consideracion", ""),
        ", ".join(NIVELES.get(n, n) for n in r["niveles"]) or "Todos",
        ", ".join(DIMENSIONES[d - 1] for d in r["dimensiones"]),
        "Sí" if "practica" in r["contextos"] else "",
        r["titulo"], "\n".join(f"{i}. {p}" for i, p in enumerate(r["como"], start=1)), r["porque"],
        RESPALDO.get(r["respaldo"], r["respaldo"]), "\n".join(fuentes.get(f, f) for f in r["fuentes"]), "", "",
    ])
    for celda in hoja[hoja.max_row]:
        celda.alignment = Alignment(wrap_text=True, vertical="top")

decision = DataValidation(type="list", formula1='"Aprobar,Ajustar,Quitar"', allow_blank=True)
hoja.add_data_validation(decision)
decision.add(f"M2:M{hoja.max_row}")
hoja.freeze_panes = "B2"
hoja.auto_filter.ref = hoja.dimensions

guia = libro.create_sheet("Cómo revisar")
for fila in [
    ["Cómo revisar el catálogo de Prizma"],
    [],
    ["1. Usa los filtros de la primera fila para revisar por tipo, nivel o situación."],
    ["2. En «Decisión», elige Aprobar, Ajustar o Quitar."],
    ["3. Si eliges Ajustar o Quitar, explica en «Comentario de revisión» qué cambiarías y por qué."],
    ["4. Revisa sobre todo: que la acción sea factible en una sala real, que el respaldo no exagere la evidencia y que el lenguaje sea claro."],
    ["5. No cambies las columnas Id ni Título: sirven para encontrar la ficha al aplicar tus cambios."],
]:
    guia.append(fila)
guia.column_dimensions["A"].width = 120
guia["A1"].font = Font(bold=True, size=14)

salida = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "revision/catalogo-revision.xlsx"
salida.parent.mkdir(parents=True, exist_ok=True)
libro.save(salida)
print(f"Planilla guardada en {salida}: {len(catalogo)} fichas.")

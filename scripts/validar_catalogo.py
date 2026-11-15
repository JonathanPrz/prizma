"""Revisa data/recomendaciones.json contra las reglas de docs/diseno.md, sección 5. Uso: python3 scripts/validar_catalogo.py"""
import json, sys
R = json.load(open("data/recomendaciones.json"))
F = {f["id"] for f in json.load(open("data/fuentes.json"))}
CONS = {f"{g}.{i}" for g, n in {1:3, 2:5, 3:4, 4:2, 5:4, 6:5, 7:4, 8:5, 9:4}.items() for i in range(1, n + 1)}
ENUM = {"tipo": {"dua", "acceso", "objetivos", "desregulacion", "adicional"},
        "momento": {"antes", "durante", "despues", "toda-la-clase"},
        "respaldo": {"investigacion-solida", "investigacion-moderada", "consenso-expertos", "orientacion-oficial", "norma-legal"}}
PROHIBIDO = ["estilo de aprendizaje", "estilos de aprendizaje", "contención física", "chaleco", "suspend", "neurociencia demuestra"]
errores, ids = [], set()
for r in R:
    i = r.get("id", "?")
    if i in ids: errores.append(f"{i}: id repetido")
    ids.add(i)
    for campo, valores in ENUM.items():
        if campo in r and r[campo] not in valores: errores.append(f"{i}: {campo} inválido ({r[campo]})")
    if not r.get("fuentes"): errores.append(f"{i}: sin fuentes")
    errores += [f"{i}: fuente inexistente {f}" for f in r.get("fuentes", []) if f not in F]
    if r["tipo"] == "dua" and r.get("consideracion") not in CONS: errores.append(f"{i}: consideración DUA inválida")
    if not all(1 <= d <= 11 for d in r.get("dimensiones", [])): errores.append(f"{i}: dimensión fuera de 1 a 11")
    texto = " ".join([r["titulo"], r["porque"], *r["como"]])
    if len(texto.split()) > 75: errores.append(f"{i}: {len(texto.split())} palabras, máximo 75")
    errores += [f"{i}: contiene «{p}»" for p in PROHIBIDO if p in texto.lower()]
    if r.get("destacada") and r.get("respaldo") != "investigacion-solida": errores.append(f"{i}: destacada sin investigación sólida")
NIVELES = ["parvularia", "basica", "media-ch", "media-tp"]
CONTEXTOS = {"escuchar-leer", "conversar", "experimentar", "crear", "moverse", "escribiendo", "hablando", "haciendo", "grupo", "observacion"}
for r in R:
    errores += [f"{r['id']}: contexto desconocido {c}" for c in r.get("contextos", []) if c not in CONTEXTOS]
for r in R:
    i = r["id"]
    errores += [f"{i}: nivel desconocido {n}" for n in r.get("niveles", []) if n not in NIVELES]
# Cada nivel debe tener al menos una acción por consideración DUA.
dua = [r["consideracion"] for r in R if r["tipo"] == "dua"]
for n in NIVELES:
    faltan = sorted(CONS - {r["consideracion"] for r in R if r["tipo"] == "dua" and (not r["niveles"] or n in r["niveles"])})
    if faltan: errores.append(f"Nivel {n}: consideraciones DUA sin acción: {', '.join(faltan)}")
print("\n".join(errores) or f"Catálogo correcto: {len(R)} recomendaciones, {len(set(dua))} de 36 consideraciones DUA.")
sys.exit(1 if errores else 0)

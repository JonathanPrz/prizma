"""Revisa data/recomendaciones.json contra las reglas de docs/diseno.md, sección 5. Uso: python3 scripts/validar_catalogo.py"""
import json, sys
R = json.load(open("data/recomendaciones.json"))
F = {f["id"] for f in json.load(open("data/fuentes.json"))}
CONS = {f"{g}.{i}" for g, n in {1:3, 2:5, 3:4, 4:2, 5:4, 6:5, 7:4, 8:5, 9:4}.items() for i in range(1, n + 1)}
ENUM = {"tipo": {"dua", "acceso", "objetivos", "desregulacion", "adicional", "practica-profesional"},
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
    if not all(1 <= d <= 14 for d in r.get("dimensiones", [])): errores.append(f"{i}: dimensión fuera de 1 a 14")
    texto = " ".join([r["titulo"], r["porque"], *r["como"]])
    if len(texto.split()) > 75: errores.append(f"{i}: {len(texto.split())} palabras, máximo 75")
    errores += [f"{i}: contiene «{p}»" for p in PROHIBIDO if p in texto.lower()]
    if r.get("destacada") and r.get("respaldo") != "investigacion-solida": errores.append(f"{i}: destacada sin investigación sólida")
NIVELES = ["parvularia", "basica", "media", "superior"]
CONTEXTOS = {"practica", "escuchar-leer", "conversar", "experimentar", "crear", "moverse", "escribiendo", "hablando", "haciendo", "grupo", "observacion"}
for r in R:
    errores += [f"{r['id']}: contexto desconocido {c}" for c in r.get("contextos", []) if c not in CONTEXTOS]
for r in R:
    i = r["id"]
    errores += [f"{i}: nivel desconocido {n}" for n in r.get("niveles", []) if n not in NIVELES]
# Cada nivel debe tener al menos una acción por consideración DUA.
SUBTIPOS_ACCESO = {"presentacion", "respuesta", "entorno", "tiempo"}  # Decreto 83
SUBTIPOS = {"acceso": SUBTIPOS_ACCESO, "objetivos": {"graduacion", "priorizacion", "temporalizacion", "enriquecimiento", "eliminacion"}, "desregulacion": {"antes", "durante", "despues"}, "practica-profesional": {"institucion", "centro", "estudiante"}}
errores += [f"{r['id']}: subtipo inválido para {r['tipo']}" for r in R if r["tipo"] in SUBTIPOS and r.get("subtipo") not in SUBTIPOS[r["tipo"]]]
errores += [f"{r['id']}: objetivos no aplica a parvularia ni a superior" for r in R if r["tipo"] == "objetivos" and (not r["niveles"] or {"parvularia", "superior"} & set(r["niveles"]))]
ASIGNATURAS = {"", "lenguaje", "matematica", "ciencias", "historia"}
errores += [f"{r['id']}: asignatura inválida" for r in R if "asignatura" in r and (r["tipo"] != "objetivos" or r["asignatura"] not in ASIGNATURAS)]
acceso = [r for r in R if r["tipo"] == "acceso"]
# Cada nivel debe tener al menos 4 apoyos de acceso (sin contar los prácticos) para cada situación que se puede marcar.
for n in ["parvularia", "basica", "media", "superior"]:
    generales = [r for r in acceso if (not r["niveles"] or n in r["niveles"]) and "practica" not in r["contextos"]]
    pocas = [d for d in range(1, 15) if sum(d in r["dimensiones"] for r in generales) < 4]
    errores += [f"{n}: situaciones con menos de 4 apoyos {pocas}"] if pocas else []
errores += [f"{r['id']}: subtipo de acceso inválido" for r in acceso if r.get("subtipo") not in SUBTIPOS_ACCESO]
sin_acceso = sorted(set(range(1, 15)) - {d for r in acceso if not r["niveles"] or "basica" in r["niveles"] for d in r["dimensiones"]})
if acceso and sin_acceso: errores.append(f"Dimensiones sin adecuación de acceso: {sin_acceso}")
# «dua» apunta a la consideración DUA que es la versión para todo el curso de un apoyo individual.
for r in R:
    if "dua" in r:
        if r["tipo"] != "acceso" or r["dua"] not in CONS: errores.append(f"{r['id']}: relación DUA inválida")
        else: errores += [f"{r['id']}: sin acción DUA {r['dua']} en {n}" for n in r["niveles"] if not any(x["tipo"] == "dua" and x["consideracion"] == r["dua"] and (not x["niveles"] or n in x["niveles"]) for x in R)]
NEC = json.load(open("data/necesidades.json"))
for n in NEC:
    errores += [f"necesidad {n['id']}: consideración inválida {c}" for c in n["consideraciones"] if c not in CONS]
    errores += [f"necesidad {n['id']}: situación inválida {d}" for d in n.get("dimensiones", []) if d not in range(1, 15)]
dua = [r["consideracion"] for r in R if r["tipo"] == "dua"]
for n in NIVELES:
    faltan = sorted(CONS - {r["consideracion"] for r in R if r["tipo"] == "dua" and (not r["niveles"] or n in r["niveles"])})
    if faltan: errores.append(f"Nivel {n}: consideraciones DUA sin acción: {', '.join(faltan)}")
print("\n".join(errores) or f"Catálogo correcto: {len(R)} recomendaciones, {len(set(dua))} de 36 consideraciones DUA.")
sys.exit(1 if errores else 0)

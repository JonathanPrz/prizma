"""Revisa las matrices de la tarea 043 sin juicio humano: completitud, citas literales y vínculos.
Uso: python3 docs/revision-fuentes/verificar.py L1   (o sin argumento: todos los lotes con matriz)."""
import csv, json, re, sys, os
from collections import defaultdict
R = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(R, '..', '..'))
COLS = ['lote','archivo','id_fuente','tipo_archivo','tema','trata','dice','cita_literal','linea',
        'nivel','fuerza','fichas_prizma','coincide_prizma','terminos_buscados','nota']
TIPOS = {'texto completo','extracto','resumen de agente','registro'}
TRATA = {'sí','no'}; FUERZA = {'obligación legal','orientación oficial','evidencia','opinión','no aplica'}
COINC = {'sí','en parte','no','no aplica'}

def leer(p): return list(csv.DictReader(open(p, encoding='utf-8-sig'), delimiter=';'))
def norm(t): return re.sub(r'\s+', ' ', re.sub(r'[*_`>#]', '', t)).strip().lower()

temas = [f['tema'] for f in leer(os.path.join(R, 'temas.csv'))]
lotes = defaultdict(list)
for f in leer(os.path.join(R, 'lotes.csv')): lotes[f['lote']].append(f['archivo'])
fuentes = {f['id'] for f in json.load(open(os.path.join(RAIZ, 'data/fuentes.json')))}
fichas = {r['id']: set(r.get('fuentes', [])) for r in json.load(open(os.path.join(RAIZ, 'data/recomendaciones.json')))}

def revisar(lote):
    p = os.path.join(R, f'matriz-{lote}.csv')
    if not os.path.exists(p): return [f'falta {os.path.basename(p)}']
    filas, err = leer(p), []
    if filas and list(filas[0].keys()) != COLS: err.append(f'columnas distintas de: {";".join(COLS)}')
    vistos = set(); textos = {}
    for i, f in enumerate(filas, 2):
        a, t = f.get('archivo',''), f.get('tema','')
        e = lambda m: err.append(f'fila {i} ({a} {t}): {m}')
        if a not in lotes[lote]: e('archivo fuera del lote'); continue
        vistos.add((a, t))
        if t not in temas: e('tema desconocido')
        if f['tipo_archivo'] not in TIPOS: e(f'tipo_archivo debe ser uno de {sorted(TIPOS)}')
        if f['trata'] not in TRATA: e('trata debe ser sí o no')
        for i_ in f['id_fuente'].split():
            if i_ != 'sin' and i_ != 'id' and i_ not in fuentes: e(f'id_fuente {i_} no existe')
        if f['trata'] == 'no':
            if not f['terminos_buscados'].strip(): e('«no trata» sin terminos_buscados')
            continue
        if f['fuerza'] not in FUERZA: e(f'fuerza debe ser uno de {sorted(FUERZA)}')
        if f['coincide_prizma'] not in COINC: e(f'coincide_prizma debe ser uno de {sorted(COINC)}')
        cita = norm(f['cita_literal'])
        if not cita: e('falta cita_literal'); continue
        if len(cita.split()) > 40: e('cita_literal de más de 40 palabras')
        lineas = textos.setdefault(a, open(os.path.join(RAIZ, a), encoding='utf-8').read().split('\n'))
        try: n = int(f['linea'])
        except ValueError: e('linea no es un número'); continue
        ventana = norm(' '.join(lineas[max(0, n-4):n+3]))
        if cita not in ventana:
            e('la cita no está en esa línea' + (' (sí está en otra parte del archivo)' if cita in norm(' '.join(lineas)) else ' ni en el archivo'))
        for fid in f['fichas_prizma'].split():
            if fid not in fichas: e(f'ficha {fid} no existe')
            elif f['id_fuente'] != 'sin id' and not fichas[fid] & set(f['id_fuente'].split()): e(f'ficha {fid} no cita esta fuente')
    for a in lotes[lote]:
        for t in temas:
            if (a, t) not in vistos: err.append(f'falta la fila {a} {t}')
    return err

if __name__ == '__main__':
    pedidos = sys.argv[1:] or [l for l in sorted(lotes) if os.path.exists(os.path.join(R, f'matriz-{l}.csv'))]
    total = 0
    for l in pedidos:
        err = revisar(l); total += len(err)
        print(f'{l}: ' + ('correcto' if not err else f'{len(err)} problemas'))
        for x in err[:200]: print('  ' + x)
    sys.exit(1 if total else 0)

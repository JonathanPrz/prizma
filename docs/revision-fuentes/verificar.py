"""Revisión mecánica de la tarea 043, sin juicio humano.
  python3 docs/revision-fuentes/verificar.py pares L1    revisa pares-L1.csv
  python3 docs/revision-fuentes/verificar.py matriz L1   revisa matriz-L1.csv
  python3 docs/revision-fuentes/verificar.py muestra L1  crea muestra-L1.csv para el adversario"""
import csv, json, os, random, re, sys
from collections import Counter
R = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.normpath(os.path.join(R, '..', '..'))
def leer(n): return list(csv.DictReader(open(os.path.join(R, n), encoding='utf-8-sig'), delimiter=';'))
def norm(t):
    t = t.replace('“','"').replace('”','"').replace('«','"').replace('»','"').replace('’',"'").replace('‘',"'")
    return ' ' + re.sub(r'\s+', ' ', re.sub(r'[*_`>#|]', ' ', t)).strip().lower() + ' '
TEXTOS = {}
def lineas(a):
    if a not in TEXTOS: TEXTOS[a] = open(os.path.join(RAIZ, a), encoding='utf-8').read().split('\n')
    return TEXTOS[a]

def palabras(t): return {w for w in re.findall(r'[a-záéíóúñü]{5,}', norm(t))}
VACIAS = palabras('donde cuando sobre entre desde hasta tiene pueden puede debe deben según tienen hacer través otros otras todos todas cada parte forma personas persona estudiantes estudiante')

def inicio_cuerpo(a):
    # La cabecera (título y metadatos «- **Campo:**») no respalda nada: el cuerpo empieza en la primera línea que no es de cabecera.
    for i, l in enumerate(lineas(a)):
        t = l.strip()
        if t and not (t.startswith('#') or t.startswith('- **') or t.startswith('**') or t.startswith('>')): return i
    return 0

def revisar_cita(f, a, e, contra=None):
    cita = norm(f['cita_literal'])
    if not 6 <= len(cita.split()) <= 40: return e('cita_literal debe tener entre 6 y 40 palabras')
    try: n = int(f['linea'])
    except ValueError: return e('linea no es un número')
    if n <= inicio_cuerpo(a): e('la cita está en la cabecera del archivo (título o metadatos), no en su contenido')
    if contra is not None and not (palabras(cita) - VACIAS) & (palabras(contra) - VACIAS):
        e('la cita no comparte ninguna palabra de contenido con lo que debe respaldar')
    if cita not in norm(' '.join(lineas(a)[max(0, n-2):n+1])):
        e('la cita no está en la línea indicada' + (' (sí en otra)' if cita in norm(' '.join(lineas(a))) else ' ni en el archivo'))

def revisar_ausencia(f, a, e, origen):
    # Los términos deben salir de la ficha o del tema: así no se pueden inventar palabras que nunca estarán.
    terminos = [t.strip() for t in f['terminos_buscados'].split(',') if t.strip()]
    if len(terminos) < 3: return e('terminos_buscados necesita al menos 3 términos, separados por coma')
    fuera = [t for t in terminos if norm(t) not in norm(origen)]
    if fuera: e(f'términos que no salen de la ficha o del tema: {", ".join(fuera[:3])}')
    texto = norm(' '.join(lineas(a)))
    for t in terminos:
        if norm(t) in texto: e(f'el término «{t}» sí aparece en el archivo')

LOTES = {l['archivo']: l for l in leer('lotes.csv')}
PARES = {p['par']: p for p in leer('pares.csv')}
TEMAS = [t['tema'] for t in leer('temas.csv')]
DESC = {t['tema']: ' '.join(v for k, v in t.items() if k != 'tema') for t in leer('temas.csv')}

def pares(lote):
    err = []; e0 = err.append
    filas = leer(f'pares-{lote}.csv')
    esperados = {k for k, p in PARES.items() if p['lote'] == lote}
    cuenta = Counter(f['par'] for f in filas)
    for k in esperados - set(cuenta): e0(f'falta el par {k}')
    for k, n in cuenta.items():
        if k not in esperados: e0(f'{k} no es de este lote')
        elif n > 1: e0(f'{k} aparece {n} veces')
    for f in filas:
        if f['par'] not in esperados: continue
        a = PARES[f['par']]['archivo']; e = lambda m, k=f['par']: err.append(f'{k}: {m}')
        if f['tipo_archivo'] not in {'texto completo','extracto','resumen de agente','registro'}: e('tipo_archivo inválido')
        v = f['veredicto']
        afirma = PARES[f['par']]['afirmacion']
        if v in {'respaldada','en parte','contradice'}: revisar_cita(f, a, e, afirma)
        elif v == 'sin respaldo': revisar_ausencia(f, a, e, afirma)
        else: e('veredicto debe ser respaldada, en parte, sin respaldo o contradice')
        if v in {'en parte','contradice'} and not f['nota'].strip(): e('en parte o contradice exige nota')
    repetidas(filas, 'cita_literal', 2, err); repetidas(filas, 'nota', 2, err)
    return err

def repetidas(filas, col, maximo, err):
    # Una misma cita o nota para muchos pares indica que no se leyó cada uno.
    for t, n in Counter(f[col].strip() for f in filas if f[col].strip()).items():
        if n > maximo: err.append(f'la misma {col} aparece {n} veces (máximo {maximo}): «{t[:60]}»')

def matriz(lote):
    err = []; filas = leer(f'matriz-{lote}.csv')
    archivos = [a for a, l in LOTES.items() if l['lote'] == lote]
    cuenta = Counter((f['archivo'], f['tema']) for f in filas)
    for a in archivos:
        for t in TEMAS:
            if cuenta[(a, t)] != 1: err.append(f'{a} {t}: debe haber exactamente 1 fila (hay {cuenta[(a, t)]})')
    for f in filas:
        a = f['archivo']; e = lambda m: err.append(f'{a} {f["tema"]}: {m}')
        if a not in archivos: e('archivo fuera del lote'); continue
        tema = DESC.get(f['tema'], '')
        if f['trata'] == 'sí':
            revisar_cita(f, a, e, f['dice'] + ' ' + tema)
            if f['fuerza'] not in {'obligación legal','orientación oficial','evidencia','opinión'}: e('fuerza inválida')
        elif f['trata'] == 'no': revisar_ausencia(f, a, e, tema)
        else: e('trata debe ser sí o no')
    repetidas([f for f in filas if f['trata'] == 'sí'], 'cita_literal', 3, err)
    return err

def muestra(lote):
    # Semilla fija: el adversario no elige qué revisar, y cualquiera puede repetir la muestra.
    filas = leer(f'pares-{lote}.csv'); rnd = random.Random('043-' + lote)
    elegidos = [f for f in filas if f['veredicto'] != 'respaldada' or PARES[f['par']]['respaldo'] == 'investigacion-solida']
    resto = [f for f in filas if f not in elegidos]
    elegidos += rnd.sample(resto, min(len(resto), max(10, round(len(resto) * 0.3))))
    with open(os.path.join(R, f'muestra-{lote}.csv'), 'w', encoding='utf-8-sig', newline='') as h:
        w = csv.writer(h, delimiter=';'); w.writerow(['par']); w.writerows([[f['par']] for f in sorted(elegidos, key=lambda f: f['par'])])
    print(f'muestra-{lote}.csv: {len(elegidos)} pares'); return []

if __name__ == '__main__':
    modo, lote = sys.argv[1], sys.argv[2]
    err = {'pares': pares, 'matriz': matriz, 'muestra': muestra}[modo](lote)
    if modo != 'muestra': print(f'{modo} {lote}: ' + ('correcto' if not err else f'{len(err)} problemas'))
    for x in err[:200]:
        try: print('  ' + x)
        except BrokenPipeError: break
    sys.exit(1 if err else 0)

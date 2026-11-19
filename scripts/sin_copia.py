"""Comprueba que un archivo del repositorio no copie texto de una fuente que no se puede reproducir (regla 7 de AGENTS.md).
Uso: python3 scripts/sin_copia.py <archivo_del_repo> <texto_fuente_local> [n=8]
Falla si comparten una secuencia de n o más palabras seguidas. El texto fuente no se guarda en el repositorio."""
import re, sys

def palabras(ruta):
    return re.findall(r"[\wáéíóúñü']+", open(ruta, encoding='utf-8').read().lower())

def main():
    repo, fuente = sys.argv[1], sys.argv[2]
    n = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    f = palabras(fuente); vistos = {tuple(f[i:i + n]) for i in range(len(f) - n + 1)}
    r = palabras(repo)
    copias = {' '.join(r[i:i + n]) for i in range(len(r) - n + 1) if tuple(r[i:i + n]) in vistos}
    for c in sorted(copias)[:20]: print('Copia:', c)
    print('Sin copia.' if not copias else f'{len(copias)} secuencias de {n} palabras copiadas.')
    sys.exit(1 if copias else 0)

main()

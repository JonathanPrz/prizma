"""Unifica solo los niveles de media; conserva los bytes fuera de las listas niveles."""
import json
import re
from collections import Counter
from pathlib import Path

PATRON = re.compile(r'("niveles"\s*:\s*)(\[[^\]]*\])')

def unificar(texto):
    antes = json.loads(texto)
    def reemplazar(m):
        lista = json.loads(m[2])
        nueva = list(dict.fromkeys("media" if n in ("media-ch", "media-tp") else n for n in lista))
        if nueva == lista:
            return m[0]
        if "\n" in m[2]:
            sangria = re.search(r'\n([ \t]*)"', m[2])[1]
            cierre = m[2].splitlines()[-1][:-1]
            valor = "[\n" + ",\n".join(sangria + json.dumps(n) for n in nueva) + "\n" + cierre + "]"
        else:
            valor = json.dumps(nueva, ensure_ascii=False)
        return m[1] + valor
    resultado = PATRON.sub(reemplazar, texto)
    despues = json.loads(resultado)
    assert PATRON.sub(r'\1[]', texto) == PATRON.sub(r'\1[]', resultado)
    assert len(antes) == len(despues)
    for a, d in zip(antes, despues):
        assert {k: v for k, v in a.items() if k != "niveles"} == {k: v for k, v in d.items() if k != "niveles"}
        assert d["niveles"] == list(dict.fromkeys("media" if n in ("media-ch", "media-tp") else n for n in a["niveles"]))
    return resultado

if __name__ == "__main__":
    ruta = Path(__file__).resolve().parents[1] / "data/recomendaciones.json"
    texto = ruta.read_text(encoding="utf-8")
    nuevo = unificar(texto)
    antes, despues = json.loads(texto), json.loads(nuevo)
    conteo = lambda registros: dict(Counter(n for r in registros for n in r["niveles"]))
    print(json.dumps({"fichas": len(antes), "fichas_modificadas": sum(a != d for a, d in zip(antes, despues)),
                      "antes": conteo(antes), "despues": conteo(despues)}, ensure_ascii=False, indent=2))
    if nuevo != texto:
        ruta.write_text(nuevo, encoding="utf-8")

"""Prueba la transformación e idempotencia sin escribir en data/."""
import json
from unificar_media import unificar

entrada = '''[
  {"id":"a", "titulo":"media-ch y media-tp no se cambian aquí", "niveles": [
    "basica",
    "media-tp",
    "media-ch",
    "superior"
  ], "otros":{"texto":"media-tp"}},
  {"id":"b", "niveles": ["media", "media-ch", "media-tp"]},
  {"id":"c", "niveles": []}
]\n'''
salida = unificar(entrada)
a, d = json.loads(entrada), json.loads(salida)
assert d[0]['niveles'] == ['basica', 'media', 'superior']
assert d[1]['niveles'] == ['media']
assert d[2] == a[2]
assert d[0]['titulo'] == a[0]['titulo'] and d[0]['otros'] == a[0]['otros']
assert unificar(salida) == salida
print('Correcto: transformación exclusiva de niveles, orden, deduplicación e idempotencia.')

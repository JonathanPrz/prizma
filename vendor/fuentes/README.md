# Fuentes

**Public Sans** (versión variable, pesos 100 a 900), de The Public Sans Project Authors. Licencia SIL Open Font License 1.1 (`OFL.txt`).

Fuente original: https://github.com/uswds/public-sans (copia en `google/fonts`, `ofl/publicsans`).

`public-sans-latin.woff2` es un subconjunto latino (español, signos tipográficos y €). Se generó una sola vez con fonttools, una herramienta de desarrollo que la página no necesita:

```bash
python3 -m fontTools.subset "PublicSans[wght].ttf" --flavor=woff2 \
  --output-file=public-sans-latin.woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+2713,U+2715"
```

La fuente no trae ✓ ni ✕: esos signos los dibuja la letra de respaldo.

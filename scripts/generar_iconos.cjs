const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

async function generarIconos() {
  const assets = path.resolve(__dirname, '../assets');
  const svg = await fs.readFile(path.join(assets, 'favicon.svg'), 'utf8');
  const navegador = await chromium.launch({
    executablePath: process.env.CHROMIUM_BIN || undefined,
    args: ['--no-sandbox']
  });
  try {
    const pagina = await navegador.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
    await pagina.setContent(`<!doctype html><style>body { margin: 0 } svg { display: block; width: 100vw; height: 100vh }</style>${svg}`);
    await pagina.screenshot({ path: path.join(assets, 'apple-touch-icon.png'), omitBackground: true });
  } finally {
    await navegador.close();
  }
}

generarIconos().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

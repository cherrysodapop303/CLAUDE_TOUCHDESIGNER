// td-live-kit/setup.mjs — run once on the machine where TouchDesigner is installed:
//   node td-live-kit/setup.mjs            -> prepares everything and prints the next steps
//   node td-live-kit/setup.mjs --register -> also runs `claude mcp add` for you
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';

const kit = dirname(fileURLToPath(import.meta.url));
const repo = resolve(kit, '..');
const routerPath = join(repo, 'td-bridge', 'router.py');
const tokenFile = join(kit, '.token');
const installerPath = join(kit, 'install_td_bridge.py');
const serverPath = join(repo, 'index.js');

if (!existsSync(join(repo, 'node_modules'))) {
  console.log('Installing dependencies (npm install)...');
  execSync('npm install --omit=dev', { cwd: repo, stdio: 'inherit' });
}

const py = (p) => p.replace(/\\/g, '/'); // forward slashes work in TD on Windows too
const out = readFileSync(join(kit, 'installer.template.py'), 'utf8')
  .replaceAll('__ROUTER_PATH__', py(routerPath))
  .replaceAll('__TOKEN_FILE__', py(tokenFile));
writeFileSync(installerPath, out);

const textportLine = `exec(open(r'${py(installerPath)}').read())`;
console.log(`
Listo. Pasos siguientes:

1) En TouchDesigner abre el Textport (Alt+T), pega esta línea y presiona Enter (una sola vez):

   ${textportLine}

   Crea /td_mcp con un Web Server DAT en el puerto 9981 y guarda el token en:
   ${tokenFile}

2) Registra el servidor MCP en Claude Code (en esta misma máquina):

   claude mcp add -s user touchdesigner -- node "${py(serverPath)}"

3) Abre Claude Code en esta máquina y dime "revisa el estado de TouchDesigner" (td_status).
`);

if (process.argv.includes('--register')) {
  // On Windows `claude` is a .cmd shim, which spawnSync can't resolve without a shell.
  const cmd = `claude mcp add -s user touchdesigner -- node "${serverPath}"`;
  const r = spawnSync(cmd, { stdio: 'inherit', shell: true });
  if (r.error || r.status) {
    console.error('\nNo se pudo registrar automáticamente. Ejecuta tú este comando:\n\n  ' + cmd + '\n');
    process.exit(r.status || 1);
  }
}

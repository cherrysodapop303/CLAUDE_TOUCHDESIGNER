// td-live-kit/build_portable.mjs — builds install_td_bridge_portable.py: a single self-contained file
// (router.py embedded) that works from any machine/path. Re-run after editing td-bridge/router.py.
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const kit = dirname(fileURLToPath(import.meta.url));
const router = readFileSync(join(kit, '..', 'td-bridge', 'router.py'));
const out = readFileSync(join(kit, 'installer.template.py'), 'utf8')
  .replaceAll('__ROUTER_PATH__', '')
  .replaceAll('__TOKEN_FILE__', '')
  .replace("ROUTER_B64 = ''", `ROUTER_B64 = '${router.toString('base64')}'`);
writeFileSync(join(kit, 'install_td_bridge_portable.py'), out);
console.log('wrote install_td_bridge_portable.py');

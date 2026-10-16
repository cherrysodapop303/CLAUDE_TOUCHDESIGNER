# td-live-kit — control en vivo de TouchDesigner con Claude

Importante: el control en vivo debe correr en la **misma máquina que TouchDesigner**.
Una sesión en la nube no puede alcanzar `127.0.0.1:9981` de tu computadora.

## Instalación (una vez)
Requisitos: Node 20+, TouchDesigner 2025, Claude Code instalado localmente.

```
git clone https://github.com/bottobot/touchdesigner-mcp-server
cd touchdesigner-mcp-server
node td-live-kit/setup.mjs --register
```
Luego pega en el Textport de TD (Alt+T) la línea `exec(open(r'...install_td_bridge.py').read())` que imprime el script.

## Uso
Abre Claude Code en tu máquina y pide cosas como "crea un feedback loop con noise y colorízalo".
Claude edita solo `/td_mcp/sandbox`; Python libre está desactivado por defecto.

## Si usas Codespaces / un entorno en la nube (TouchDesigner en tu PC)
`setup.mjs` genera rutas del sistema donde corre, así que en un Codespace crea rutas de Linux que TouchDesigner (en Windows) no puede abrir. Usa el instalador portátil, que lleva `router.py` incrustado y no depende de ninguna ruta.

**1. Instalar el puente en TouchDesigner (una vez).** En el Textport (Alt+T), pega una de estas opciones:

- Descarga `td-live-kit/install_td_bridge_portable.py` a tu PC y ejecuta:
  `exec(open(r'C:\ruta\a\install_td_bridge_portable.py').read())`
- O, sin descargar nada (ejecuta el código de tu fork, léelo antes):
  `exec(__import__('urllib.request').request.urlopen('https://raw.githubusercontent.com/cherrysodapop303/claude_touchdesigner/main/td-live-kit/install_td_bridge_portable.py').read().decode())`

El Textport imprime `TD_MCP_TOKEN = ...`. Cópialo.

**2. Conectar tu PC con el Codespace.** El servidor MCP del Codespace no alcanza `127.0.0.1:9981` de tu PC; hay que abrir un túnel inverso. En PowerShell, en tu PC (requiere GitHub CLI con sesión iniciada) y déjalo abierto:
```
gh codespace ssh -- -R 9981:127.0.0.1:9981
```

**3. Registrar el servidor en el Codespace**, con el token del paso 1:
```
claude mcp add -s user -e TD_MCP_TOKEN=<token> touchdesigner -- node /workspaces/CLAUDE_TOUCHDESIGNER/index.js
```

Si cambias el router, regenera el portátil con `node td-live-kit/build_portable.mjs`.

## Seguridad
Token aleatorio por sesión (guardado en `td-live-kit/.token`, ignorado por git), guardia CSRF y sandbox.
El Web Server DAT escucha en todas las interfaces: bloquea el puerto 9981 entrante en tu firewall.

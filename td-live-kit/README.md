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

## Seguridad
Token aleatorio por sesión (guardado en `td-live-kit/.token`, ignorado por git), guardia CSRF y sandbox.
El Web Server DAT escucha en todas las interfaces: bloquea el puerto 9981 entrante en tu firewall.

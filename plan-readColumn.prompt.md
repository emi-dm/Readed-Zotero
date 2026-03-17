# Plan: Zotero "Read" Checkbox Column Extension

**TL;DR** — Crear un plugin para Zotero 7 que añade una columna "Read" con un checkbox. El usuario hace clic para marcar artículos como leídos/no leídos. El estado se persiste usando tags de Zotero (`_read`).

---

## Fase 1: Estructura del Proyecto

1. Crear `manifest.json` con metadatos del plugin (id: `read-column@emi.dev`, nombre: "Read Status Column", min version 7.0)
2. Crear `bootstrap.js` con hooks de ciclo de vida (`install`, `startup`, `shutdown`, `uninstall`, `onMainWindowLoad`, `onMainWindowUnload`)
3. Crear archivo principal `content/read-column.js`

## Fase 2: Lógica Principal (`content/read-column.js`)

4. Definir módulo `ReadColumn` con `init()`, `addToWindow()`, `removeFromWindow()`, etc.
5. Registrar columna personalizada vía `Zotero.ItemTreeManager.registerColumn()`:
   - `dataKey: 'read-status'`, `label: 'Read'`, `width: 60px`
   - `dataProvider`: devuelve `'✓'` si el item tiene tag `_read`, sino `''`
   - `renderCell`: renderiza celda con checkmark verde
6. Implementar `toggleReadStatus(item)` — añade/quita tag `_read` y guarda
7. Añadir click handler en la columna para alternar estado

## Fase 3: Persistencia con Tags

8. `item.addTag('_read', 1)` para marcar como leído (tipo 1 = automático/no sincronizado)
9. `item.removeTag('_read')` para marcar como no leído
10. `item.hasTag('_read')` para verificar estado

## Fase 4: Empaquetado

11. Crear archivo `.xpi` (zip) con: `manifest.json`, `bootstrap.js`, `content/read-column.js`

---

## Archivos a crear

- `manifest.json` — metadatos del plugin
- `bootstrap.js` — hooks de ciclo de vida
- `content/read-column.js` — lógica principal

## Verificación

1. Instalar plugin en Zotero 7 vía Tools → Plugins → Install Plugin From File
2. Verificar que la columna "Read" aparece en la lista (puede requerir activarla en el selector de columnas)
3. Hacer clic en una celda → verificar que el checkmark alterna y persiste tras reiniciar Zotero
4. Verificar que ordenar por columna "Read" funciona
5. Verificar que desinstalar el plugin elimina la columna limpiamente

## Decisiones

- **Almacenamiento**: Tags (`_read`) — lo más simple, sobrevive a sincronización
- **UI**: Checkmark de texto (`✓`) con color verde — simple, sin necesidad de iconos
- **Solo Zotero 7**: Usa API `ItemTreeManager.registerColumn`

## Further Considerations

1. Could add a keyboard shortcut to toggle read status
2. Could add a bulk "mark all as read" option via right-click menu
3. Could add statistics (e.g., "42/100 articles read") in a status bar

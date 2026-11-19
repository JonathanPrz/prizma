# Autorrevisión de la tarea 046

Skill aplicada: `.agents/skills/ponytail-review/SKILL.md`. Escala prevista: página estática de uso individual, hasta diez casos por ámbito, sin servidor de datos.

What this change does: It lets people choose which work sections to share. It fixes document defaults, school agreements, keyboard focus, legal labels and PDF language without adding dependencies.

Looks good. Ship.

Checked: changed functions and their callers, storage and backup normalization, document preparation, shared HTML/PDF model, selection rendering, role validation, keyboard flow and the connected historical tests. The new browser test checks all eight section combinations, real PDF download, same-origin requests, mobile focus and contrast in both themes. Historical test changes follow the new labels, instruments and privacy defaults; they retain their existing flows.

During review, fixed the migration notice after importing an old backup, as well as loading one. Kept the generic support-team role for existing data, but it cannot satisfy the new objective-agreement requirement. Preserved the original 042 measurement files; rerun outputs live under `046-correcciones/adversarial`.

Not checked: real screen-reader sessions, legal advice or the catalogue changes assigned to Claude. The PDF remains untagged; the page now states this and offers the HTML preview.

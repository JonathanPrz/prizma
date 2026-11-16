# ponytail-review

What this change does: This change keeps frequencies when an area is closed, makes workshop edits wait for Save, and sends Print through the same pdfmake definition as Download. It also applies the task's exact labels, makes repeated-barrier actions save and show results, and removes duplicate footer links.

Looks good. Ship.

Checked the full diff and connected handlers: both area builders and radio listeners, case switching and normalization, saved description and agreement state, workshop draft creation/reset/save, level changes, repeated-barrier buttons, view filters, shared card groups, step navigation, the footer, document inclusion, and the course, placement-centre and Work PDF models. The expected load is one person using a local static page with at most ten cases per domain and the existing 240-card catalog.

The shared area button only changes visibility and aria-expanded. It never writes case data or invalidates agreements. Restored cases reopen areas with positive frequencies; No aplica still removes only its dimension. Save commits the workshop draft while retaining the current global level and reflection. Creating a draft during an input event does not repaint and erase that new input. Repeated barriers save once and focus the results; restrictive view filters are cleared only if needed to reveal Para empezar.

Print and Download call definicionPdf. pdfmake's existing print method throws when its window is blocked, and the handler exposes the exact fallback text. The regression checks equal definitions for all three document types and the blocked-window branch. Print CSS resets the modal's positioning and margins; the eight repeated document comparisons have no empty CSS pages or missing action titles. No library or product data migration was added.

Reviewed the audit changes too: output can go to a separate folder, old result files are preserved, area actions now use buttons, workshop comparisons explicitly save, and document snapshots wait for the asynchronous preview to open. Event logs distinguish pdfmake.print from CSS print events. The final application hashes match those recorded in the repeated audit. All 20 probar_*.cjs scripts passed, the catalog validator passed, and the focused browser regression passed in both themes and widths.

Not checked: The native print dialog and a physical printer are blocked by managed Chromium policies; spoken screen-reader output, other engines and tagged-PDF accessibility were not checked. P7's long case-to-case navigation remains an observation because this task does not prescribe a fix for it.

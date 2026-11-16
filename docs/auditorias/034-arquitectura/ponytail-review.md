# ponytail-review

What this change does: It records the current page structure, texts, level rules, and catalog counts. It runs six first-visit paths and saves screenshots and sample PDFs. It does not change the page or suggest a new design.

Looks good. Ship.

Checked: Read the task, AGENTS.md, the audit script and report, and the connected page functions. Compared catalog counts with the runtime lists. Checked six fresh browser contexts, six PDF downloads, screenshot coverage, report links, and unchanged hashes for page and data files. Checked that the change only adds files under docs/auditorias/034-arquitectura/. The report separates observed facts from expert guesses and records existing product problems without fixing them.

Expected load: One reviewer runs this script locally against this catalog snapshot. The script uses isolated browser state and writes evidence only in its own folder. It does not add a package or change stored user data.

Not checked: Real users, other browsers, physical phones, full WCAG compliance, legal accuracy, printer output, or every backup and failure path. Dark mode was sampled in the inventory, not tested through all six paths.

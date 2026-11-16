# ponytail-review

What this change does: It compares six names without choosing one. It records public name conflicts, search results, language and visual limits, and the measured places where a rename would reach.

Looks good. Ship.

Checked: Read AGENTS.md, task 035, the full report, both counting scripts and their generated results. Checked the linked primary sources and the saved search metadata. The report separates exact names, similar names, and ordinary words. It labels partial access, avoids legal availability claims, and asks for the missing INAPI results at the start. Checked 376 text matches across 96 files and 85 extracted-text matches in 12 PDFs. Checked that text totals equal the sum of file and line totals, that this audit does not count itself, and that the diff only adds files in the allowed folder.

Expected load: One local audit of this repository snapshot. The counters do not change product files, follow symbolic links, install packages, or contact external services. PDF extraction uses the already installed PyMuPDF package.

Not checked: INAPI name-search results, trademark clearance, real users' reactions, screen-reader pronunciation, or the owner's original account logo. Those limits are explicit in the report. Search order is a dated observation, not a stable SEO ranking.

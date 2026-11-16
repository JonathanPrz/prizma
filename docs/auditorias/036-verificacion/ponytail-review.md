# ponytail-review

What this change does: It separates Education and Work and explains each path before the person chooses supports. It keeps existing data and backups, adds a validated scope, and marks unfinished agreements as drafts.

Looks good. Ship.

Checked: Read the changed code with its state, backup, selection, dialog, and PDF callers. Checked old and new state migration, rejected scope values, canceling a level change, independent privacy acknowledgments, independent clearing, and student consent for the practice document. Ran the catalog validator and all 18 test scripts. The new test uses real Chromium in both themes and at 390/1280 px, with keyboard and focus checks. Re-ran the six audit paths and checked downloaded PDFs and the before/after scroll measurements.

Expected load: One person, up to ten student cases and ten work cases in one browser. There is no server state, new dependency, or catalog migration. The existing selection IDs, storage key and backup version remain compatible.

Not checked: A person using NVDA/VoiceOver, physical phones, other browser engines, printed paper, or a full WCAG review. The browser tests check semantic controls and focus, not a human screen-reader session.

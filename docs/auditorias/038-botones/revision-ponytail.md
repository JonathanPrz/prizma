# ponytail-review

What this change does: This change adds audit evidence for the controls and filters in Education and Work. It records six browser journeys, eight downloaded documents, print CSS comparisons, and the managed browser printing limit. It does not change the app.

Looks good. Ship.

Checked the audit scripts, their callers, the current task, AGENTS.md, and the app handlers they describe. Traced selection, saved descriptions, frequencies, global workshop state, repeated supports, agreement status, document inclusion, the preview, pdfmake download, and window.print. Assumed one local audit run with the current 240-card catalog, not a public audit server. No new app dependency or data export was added. The scripts use isolated browser profiles and write evidence only inside this folder.

The final report includes corrections made during review: visible field labels are present; collapsed groups are reset and measured with checkVisibility; note/reflection checks use the actual fixture strings; a BODY focus snapshot during asynchronous document preparation is not reported as a lasting focus failure. A separate settled-view probe confirms focus on Download PDF. Protected file hashes match, all six journeys have no page errors, all eight downloaded PDFs contain every expected action title, and both centre PDFs omit the tested initials.

The product findings in README.md are audit results, not fixes in this change. Missing native print evidence is explicitly left as a partial acceptance criterion. Print CSS files are not described as print-dialog captures.

Not checked: A native print dialog or real printer (managed policy blocks printing), spoken screen-reader output, other browser engines, tagged-PDF accessibility, every external source URL, all malformed backups, and complete Work journeys.

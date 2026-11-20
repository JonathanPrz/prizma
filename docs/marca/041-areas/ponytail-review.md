What this change does:
The frequency block appears only while at least one area is open, in both student and work views. Area buttons show + or −, reuse the pressed button colors, keep the marked count, and reveal questions under an area heading.

Looks good. Ship.

Checked the shared helper, both callers, HTML containers, CSS selectors, README, and regression tests. Checked empty areas, multiple open areas, closing a marked area, reopening it, and restoring marked areas after reload. The browser test covers Enter and Space, visible focus, AA text contrast on open buttons, both themes, and no horizontal overflow at 390 and 1280 px. No new dependencies, storage changes, or external requests. Expected load: one person using a static page locally in their browser.

Not checked: manual screen reader testing and browsers other than Chromium.

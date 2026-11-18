# Targeted visual polish — Dr. Srikanth Nakka

## Scope

The user's clarification is controlling: “not completely just adjust the patchs as apple and starbucks level website apperence.” This is a selective appearance refinement, **not** a complete site redesign. Keep the existing homepage sections in their present order, retain every verified passage and fact, preserve the Sri Purna logo and both authentic doctor photos, keep the current navigation, Know Your Heart pages, appointment form, WhatsApp destination, map, structured data, responsive and reduced-motion behavior, and GitHub Pages stack. Do not add pages, reorganize information architecture, replace the public-facing content wholesale, create testimonials or claims, or add image/JavaScript dependencies.

## Design direction

Treat the Apple and Starbucks references as broad craft cues—clean hierarchy and measured spacing paired with warm, human hospitality—not as copied brands or interface elements. Keep the existing pomegranate red and medical navy recognizable. Soften surrounding surfaces with restrained warm ivory and mineral neutrals. Use the existing system-sans/bold type system and avoid external font requests. Refine only selected visual “patches”: sticky header/brand lockup, hero portrait and CTA area, physician profile and qualifications, service cards, the appointment panel and contact/map card. Improve edge quality, whitespace, typography scale, contrast, borders, image framing, shadows and short easing while keeping the same content and layout sequence.

The human story will be expressed through the way existing text is presented—not new, unverified patient stories or medical claims. No new assets are planned; the existing optimized WebP portrait and logo remain the source of truth. All doctor qualifications, clinic details, phone/email, services/hours, patient education disclosures and the notice that WhatsApp appointment requests are not confirmed must remain accurate and functional.

## Implementation and structure

- `styles.css`: make targeted changes to the existing design tokens and current selectors; avoid a wholesale rewrite and avoid a growing stack of redundant overrides.
- `index.html`: leave the copy, order, factual metadata and interactions intact; change markup only if a small class/label adjustment is required for a visual treatment.
- `script.js`: retain the existing mobile menu and form behavior; no logic changes are planned.
- `know-your-heart/`: preserve its existing static routes and educational content; changes are limited to inherited shared design tokens if they improve visual consistency without altering its functionality.
- `images/`: reuse the current clinic logo and optimized authentic portraits; do not generate a doctor likeness or replace assets.
- `.github/workflows/static.yml`: preserve static GitHub Pages publication and its file allowlist.

This remains a no-build static site with HTML, CSS, vanilla JavaScript, WebP/SVG assets, and GitHub Pages. The WebDev MCP has no attached project resource for this repository; do not create a duplicate managed project.

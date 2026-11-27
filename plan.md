# Targeted visual polish — Dr. Srikanth Nakka

## Scope

The latest user requests add the supplied family photograph to Dr. Nakka’s profile and the supplied DM Cardiology batchmates photograph to the homepage Career gallery, with polished contextual copy and the provided names. The previously requested standalone patient-education experience remains removed from source, navigation, sitemap, and deployment. Keep verified clinic/doctor facts and avoid unsupported claims.

## Design direction

Treat the Apple and Starbucks references as broad craft cues—clean hierarchy and measured spacing paired with warm, human hospitality—not as copied brands or interface elements. Keep the existing pomegranate red and medical navy recognizable. Soften surrounding surfaces with restrained warm ivory and mineral neutrals. Use the existing system-sans/bold type system and avoid external font requests. Refine only selected visual “patches”: sticky header/brand lockup, hero portrait and CTA area, physician profile and qualifications, service cards, the appointment panel and contact/map card. Improve edge quality, whitespace, typography scale, contrast, borders, image framing, shadows and short easing while keeping the same content and layout sequence.

Use the exact user-supplied family and batchmates photos as WebP assets; do not generate or retouch people in the images. Add accessible alt text and captions, and use the supplied doctor names in the batchmates caption. Keep all doctor qualifications, clinic details, phone/email, services/hours, and the notice that WhatsApp appointment requests are not confirmed accurate and functional.

For this homepage refinement, remove the redundant “Cardiologist in Kompally, Hyderabad” eyebrow directly beneath the “Healthy Heart, Better Tomorrow” hero heading, without removing the separate physician-section location label. Replace the small profile text link with a prominent, accessible “View Dr. Nakka’s Full Profile” CTA, using existing verified journey details to invite exploration without adding new medical claims.

## Implementation and structure

- `styles.css`: make targeted changes to the existing design tokens and current selectors; avoid a wholesale rewrite and avoid a growing stack of redundant overrides.
- `index.html`: remove the former education teaser and its navigation/footer links; add the batchmates photo and contextual story in the Career gallery.
- `script.js`: retain the existing mobile menu and form behavior; no logic changes are planned.
- `dr-srikanth-nakka/`: keep the profile route and add the supplied family photograph with appropriate alt text and a caption.
- `images/`: use the user-supplied family and batchmates photos alongside the existing clinic assets; do not generate or retouch people.
- `.github/workflows/static.yml`: publish only the current homepage, doctor profile and required assets through GitHub Pages.

This remains a no-build static site with HTML, CSS, vanilla JavaScript, WebP/SVG assets, and GitHub Pages. The WebDev MCP has no attached project resource for this repository; do not create a duplicate managed project.

# Sri Purna Cardiac Care Website

A responsive static clinic website with a separate patient-education experience, **Know Your Heart**. Existing doctor information, clinic details, contact routes, responsive menu and WhatsApp appointment request flow remain on the main page.

## Technology

- HTML5 for semantic pages, metadata and clinic structured data.
- CSS3 for responsive layouts and accessibility states.
- Vanilla JavaScript (ES6) for the mobile navigation, appointment request flow, structure search, and selectable circulation steps.
- SVG/CSS motion vectors for the circulation infographic—no large video download, media framework, or third-party runtime. Playback respects reduced-motion preferences.
- WebP assets for the clinic logo, doctor portrait and homepage hero.
- GitHub Actions and GitHub Pages for deployment. No build step, framework, package manager, backend or database is required.

## Phase 1 pages

- `index.html` — clinic homepage with a short introduction to Know Your Heart.
- `know-your-heart/index.html` — education hub and search for the current anatomy guide.
- `know-your-heart/anatomy/index.html` — concise patient-reference guide, labelled heart illustration, and animated, step-selectable circulation infographic.
- `know-your-heart/education.css` and `know-your-heart/education.js` — styles and browser interactions for the education pages.
- `know-your-heart/content/heart-guide.json` — researched draft explanations, source links and circulation steps.
- `images/heart-diagram-en.svg` — unmodified diagram by ZooFari, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Attribution and source links appear on the anatomy page. The image is separately identified and remains under its own license.

The disease, symptom, diagnostic-test and procedure article library is intentionally outside this first release. Do not describe the current educational draft as medically reviewed. All new medical explanations must be reviewed by Dr. Srikanth Nakka before approval for clinical publication.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000> and <http://localhost:8000/know-your-heart/>.

## Publishing

The `.github/workflows/static.yml` workflow copies the clinic page, image assets and `know-your-heart/` directory to the GitHub Pages artifact on pushes to `main`. Pages routes use directory index files, so the education pages work as `/know-your-heart/` and `/know-your-heart/anatomy/`.

## Medical and operational notes

Education content is general information, not diagnosis or individual medical advice. The anatomy page links supporting references and explicitly marks physician review as pending. The existing appointment form opens a prefilled WhatsApp message for the visitor to review and send; there is no online booking backend.

Before expanding or promoting the education library, have Dr. Srikanth Nakka approve the content, verify clinic details and local emergency wording, set the production domain for canonical URLs and sitemap entries, and review applicable medical-advertising and privacy requirements.

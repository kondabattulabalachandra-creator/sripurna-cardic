# Sri Purna Cardiac Care Website

A responsive, single-page clinic website for Sri Purna Cardiac Care. It is intentionally built as a lightweight static site.

## Tech stack

- **HTML5** for semantic page structure, metadata and physician/clinic structured data.
- **CSS3** for the responsive layout, design tokens, form styling and reduced-motion support.
- **Vanilla JavaScript (ES6)** for the mobile menu, appointment form validation and WhatsApp request draft.
- **WebP image assets** for the hero, doctor portrait and clinic logo. The logo retains transparency.
- **GitHub Actions and GitHub Pages** for static deployment.
- **Google Fonts** (Inter and Lora), with system-font fallbacks.

There is no frontend framework, package manager, bundler, server-side application, API or booking database. No npm install or build step is required.

## Project files

- `index.html` — page content, search/social metadata and JSON-LD.
- `styles.css` — all responsive styling and visual components.
- `script.js` — mobile navigation, current year and appointment form behavior.
- `images/` — the image assets referenced by the page.
- `robots.txt` — crawler access rules.
- `.github/workflows/static.yml` — copies only the site files into a clean deployment artifact and publishes it to GitHub Pages.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Appointment requests

The appointment form checks required fields in the browser and opens a prefilled WhatsApp draft. The visitor must review and send the message; the clinic then confirms the appointment. Form submissions are not stored by this site, and there is no online booking backend.

## Before launch

1. Set the production domain before adding canonical URLs, absolute social image URLs or a sitemap.
2. Verify the clinic phone numbers, address, map pin, consultation hours, doctor credentials and service availability with the clinic.
3. Confirm professional, privacy and medical-advertising requirements for the launch region.

The site uses an original implementation and locally maintained assets; it does not include third-party theme source code.

# Sri Purna Cardiac Care Website

A responsive static clinic website for Sri Purna Cardiac Care and Dr. Srikanth Nakka. The site includes clinic and doctor information, cardiac services, contact details, directions, and a WhatsApp appointment-request flow.

## Pages

- `index.html` — clinic homepage with doctor, services, clinic details, and appointment request.
- `dr-srikanth-nakka/index.html` — Dr. Nakka’s professional profile, qualifications, experience, and family photo.

## Technology

- Semantic HTML5 with page metadata and clinic structured data.
- CSS3 for responsive layout and accessibility states.
- Vanilla JavaScript for the mobile navigation, appointment request, and homepage carousel.
- WebP image assets, including clinic and doctor photographs.
- GitHub Actions and GitHub Pages for deployment; no build step, framework, package manager, backend, or database is required.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000> and <http://localhost:8000/dr-srikanth-nakka/>.

## Publishing

The `.github/workflows/static.yml` workflow copies the clinic homepage, doctor profile, and required assets into the GitHub Pages artifact on pushes to `main`. The sitemap lists the homepage and doctor profile.

## Medical and operational notes

Clinic information is general and is not a substitute for emergency medical care. The appointment form opens a prefilled WhatsApp message for the visitor to review and send; it does not confirm an appointment or use an online booking backend. Keep clinic facts, contact details, and public photos accurate and approved before publishing changes.

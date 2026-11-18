const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });

  document.addEventListener('click', (event) => {
    if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Appointment form (contact section) -> WhatsApp */
(function () {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = data.get('patientName') || '';
    const email = data.get('patientEmail') || 'Not provided';
    const phone = data.get('patientPhone') || '';
    const appointmentDate = data.get('appointmentDate') || 'Flexible';
    const service = data.get('appointmentService') || '';
    const details = data.get('patientMessage') || 'None provided';

    const text = [
      '*New Appointment Request – Sri Purna Cardiac Care*',
      '',
      'Patient Name: ' + name,
      'Email: ' + email,
      'Phone: ' + phone,
      'Preferred Date: ' + appointmentDate,
      'Service: ' + service,
      'Additional Details: ' + details,
      '',
      'Please confirm appointment slot.'
    ].join('\n');

    const url = 'https://wa.me/917013092422?text=' + encodeURIComponent(text);
    const opened = window.open(url, '_blank', 'noopener');

    if (!opened) {
      window.location.href = url;
      return;
    }

    if (status) {
      status.textContent =
        'Thank you. Your request has been prepared in WhatsApp — please press send there to deliver it to the clinic.';
      status.classList.add('is-visible');
    }

    form.reset();
  });
})();

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

/* Appointment form modal -> WhatsApp */
(function () {
  const modal = document.getElementById('appointmentModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const openBtn = document.getElementById('openAppointmentForm');
  const form = document.getElementById('appointmentForm');

  if (!modal || !form) return;

  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('patientName') || '';
    const phone = fd.get('patientPhone') || '';
    const age = fd.get('patientAge') || '';
    const gender = fd.get('patientGender') || 'Not specified';
    const problem = fd.get('heartProblem') || '';
    const address = fd.get('patientAddress') || 'Not provided';
    const message = fd.get('patientMessage') || 'None provided';

    const text = [
      '*New Appointment Request – Sri Purna Cardiac Care*',
      '',
      '👤 *Patient Name:* ' + name,
      '📞 *Phone:* ' + phone,
      '🎂 *Age:* ' + age,
      '⚧ *Gender:* ' + gender,
      '❤️ *Heart Problem:* ' + problem,
      '📍 *Address:* ' + address,
      '📝 *Additional Details:* ' + message,
      '',
      'Please confirm appointment slot.'
    ].join('\n');

    window.open('https://wa.me/917013092422?text=' + encodeURIComponent(text), '_blank');
    closeModal();
    form.reset();
  });
})();

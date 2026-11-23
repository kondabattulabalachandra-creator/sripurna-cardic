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

/* Doctor journey carousel */
(function () {
  const carousel = document.querySelector('[data-journey-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('[data-journey-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-journey-dot]'));
  const previous = carousel.querySelector('[data-journey-prev]');
  const next = carousel.querySelector('[data-journey-next]');
  const status = carousel.querySelector('[data-journey-status]');
  const announcement = carousel.querySelector('[data-journey-announcement]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intervalMs = 6500;
  let activeIndex = 0;
  let timer = null;
  let touchStartX = null;

  if (slides.length < 2) return;

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    if (document.hidden || reducedMotion.matches) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1, false), intervalMs);
  }

  function showSlide(index, announceChange) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-current', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (status) status.innerHTML = String(activeIndex + 1).padStart(2, '0') + ' <i></i> ' + String(slides.length).padStart(2, '0');
    if (announceChange && announcement) {
      const title = slides[activeIndex].querySelector('h3');
      announcement.textContent = 'Slide ' + (activeIndex + 1) + ' of ' + slides.length + ': ' + (title ? title.textContent : '');
    }
    startTimer();
  }

  if (previous) previous.addEventListener('click', () => showSlide(activeIndex - 1, true));
  if (next) next.addEventListener('click', () => showSlide(activeIndex + 1, true));
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.journeyDot), true)));

  carousel.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1, true);
    }
  });

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 48) showSlide(activeIndex + (distance < 0 ? 1 : -1), true);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });
  const handleMotionPreferenceChange = () => {
    startTimer();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', handleMotionPreferenceChange);
  else if (reducedMotion.addListener) reducedMotion.addListener(handleMotionPreferenceChange);
  startTimer();
})();

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

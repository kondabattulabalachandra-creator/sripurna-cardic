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

/* Reveal career gallery cards as they enter view. */
(function () {
  const gallery = document.querySelector('.career-gallery');
  if (!gallery || gallery.closest('[data-career-carousel]') || !('IntersectionObserver' in window)) return;

  const cards = Array.from(gallery.querySelectorAll('[data-career-reveal]'));
  if (!cards.length) return;

  gallery.classList.add('is-motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  cards.forEach((card, index) => {
    card.style.setProperty('--reveal-delay', (index % 3) * 70 + 'ms');
    observer.observe(card);
  });
})();

/* Slowly advance the career photo carousel; native scrolling remains available. */
(function () {
  const viewport = document.querySelector('[data-career-carousel]');
  const track = viewport && viewport.querySelector('[data-carousel-track]');
  const gallery = track && track.querySelector('.career-gallery');
  if (!viewport || !track || !gallery) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  const duplicate = gallery.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.classList.add('career-gallery-clone');
  duplicate.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
  duplicate.querySelectorAll('img').forEach((image) => {
    image.alt = '';
    image.loading = 'lazy';
  });
  track.appendChild(duplicate);

  let hoverPaused = false;
  let focusPaused = false;
  let interactionPaused = false;
  let visible = true;
  let frameId = 0;
  let lastTimestamp = 0;
  let loopDistance = 0;
  let interactionTimer = 0;

  function canAdvance() {
    return !reducedMotion.matches && !document.hidden && visible && !hoverPaused && !focusPaused && !interactionPaused;
  }

  function stop() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    lastTimestamp = 0;
  }

  function step(timestamp) {
    frameId = 0;
    if (!canAdvance()) return;
    if (lastTimestamp) {
      const elapsed = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      viewport.scrollLeft += elapsed * 30;
      if (loopDistance > 0 && viewport.scrollLeft >= loopDistance) {
        viewport.scrollLeft -= loopDistance;
      }
    }
    lastTimestamp = timestamp;
    frameId = window.requestAnimationFrame(step);
  }

  function syncMotion() {
    if (canAdvance()) {
      if (!frameId) {
        lastTimestamp = 0;
        frameId = window.requestAnimationFrame(step);
      }
    } else {
      stop();
    }
  }

  function measureLoop() {
    loopDistance = duplicate.getBoundingClientRect().left - gallery.getBoundingClientRect().left;
    if (loopDistance > 0 && viewport.scrollLeft >= loopDistance) {
      viewport.scrollLeft %= loopDistance;
    }
    syncMotion();
  }

  function pauseAfterInteraction() {
    interactionPaused = true;
    window.clearTimeout(interactionTimer);
    syncMotion();
  }

  function resumeAfterInteraction() {
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      interactionPaused = false;
      syncMotion();
    }, 1800);
  }

  viewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { hoverPaused = true; syncMotion(); }
  });
  viewport.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') { hoverPaused = false; syncMotion(); }
  });
  viewport.addEventListener('focusin', () => { focusPaused = true; syncMotion(); });
  viewport.addEventListener('focusout', (event) => {
    if (!viewport.contains(event.relatedTarget)) {
      focusPaused = false;
      syncMotion();
    }
  });
  viewport.addEventListener('pointerdown', pauseAfterInteraction);
  window.addEventListener('pointerup', resumeAfterInteraction);
  window.addEventListener('pointercancel', resumeAfterInteraction);
  viewport.addEventListener('wheel', pauseAfterInteraction, { passive: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    pauseAfterInteraction();
    viewport.scrollBy({
      left: event.key === 'ArrowRight' ? 280 : -280,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  window.addEventListener('resize', measureLoop, { passive: true });

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      syncMotion();
    }, { threshold: 0.05 });
    visibilityObserver.observe(viewport);
  }

  measureLoop();
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

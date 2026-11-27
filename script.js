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

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !primaryNav.classList.contains('open')) return;
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
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

/* Premium center-focus 3D card deck for the professional-journey photos. */
(function () {
  const carousel = document.querySelector('[data-career-carousel]');
  const stage = carousel && carousel.querySelector('[data-carousel-stage]');
  const gallery = stage && stage.querySelector('.career-gallery');
  const cards = gallery ? Array.from(gallery.querySelectorAll('.career-photo')) : [];
  const previousButton = carousel && carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel && carousel.querySelector('[data-carousel-next]');
  const toggleButton = carousel && carousel.querySelector('[data-carousel-toggle]');
  if (!carousel || !stage || !gallery || !cards.length || !previousButton || !nextButton || !toggleButton) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionDuration = 850;
  const autoplayDelay = 5000;
  const deckImageSizes = '(max-width: 1198px) 90vw, 1070px';
  const stateClasses = ['is-current', 'is-next', 'is-previous', 'is-hidden', 'is-leaving-left', 'is-leaving-right', 'is-resetting'];
  let currentIndex = cards.findIndex((card) => card.hasAttribute('data-carousel-featured'));
  if (currentIndex < 0) currentIndex = 0;
  let autoTimer = 0;
  let clickSuppressTimer = 0;
  let suppressClick = false;
  let swipeStartX = null;
  let animating = false;
  let manuallyPaused = false;
  let interactionPaused = false;
  let visible = true;

  function storeImageSources() {
    cards.forEach((card) => {
      const image = card.querySelector('img');
      if (!image) return;
      image.dataset.carouselSrc = image.getAttribute('src') || '';
      image.dataset.carouselSrcset = image.getAttribute('srcset') || '';
      image.loading = 'lazy';
      image.removeAttribute('src');
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
    });
  }

  function loadImagesAround(index) {
    const count = cards.length;
    const needed = new Set([index, (index + 1) % count, (index - 1 + count) % count]);
    cards.forEach((card, cardIndex) => {
      const image = card.querySelector('img');
      if (!image) return;
      if (!needed.has(cardIndex)) return;

      // Keep each image source once loaded so mobile browsers do not refetch it on later loops.
      image.loading = 'eager';
      if (!image.hasAttribute('src') && image.dataset.carouselSrc) image.setAttribute('src', image.dataset.carouselSrc);
      if (image.dataset.carouselSrcset && image.getAttribute('srcset') !== image.dataset.carouselSrcset) {
        image.setAttribute('srcset', image.dataset.carouselSrcset);
      }
      if (image.getAttribute('sizes') !== deckImageSizes) image.setAttribute('sizes', deckImageSizes);
    });
  }

  function setAccessibleCard(index) {
    cards.forEach((card, cardIndex) => {
      const active = cardIndex === index;
      const link = card.querySelector('a');
      if (active) {
        card.removeAttribute('aria-hidden');
        card.removeAttribute('inert');
        if (link) link.removeAttribute('tabindex');
      } else {
        card.setAttribute('aria-hidden', 'true');
        card.setAttribute('inert', '');
        if (link) link.setAttribute('tabindex', '-1');
      }
    });
  }

  function renderDeck() {
    const previousIndex = (currentIndex - 1 + cards.length) % cards.length;
    const nextIndex = (currentIndex + 1) % cards.length;
    cards.forEach((card, index) => {
      stateClasses.forEach((className) => card.classList.remove(className));
      if (index === currentIndex) card.classList.add('is-current');
      else if (index === nextIndex) card.classList.add('is-next');
      else if (index === previousIndex) card.classList.add('is-previous');
      else card.classList.add('is-hidden');
    });
    setAccessibleCard(currentIndex);
  }

  function updateToggleButton() {
    const icon = toggleButton.querySelector('span');
    const reduced = reducedMotion.matches;
    toggleButton.disabled = reduced;
    toggleButton.setAttribute('aria-pressed', String(manuallyPaused));
    toggleButton.setAttribute('aria-label', reduced
      ? 'Automatic playback is off because reduced motion is enabled'
      : manuallyPaused ? 'Resume automatic playback' : 'Pause automatic playback');
    if (icon) icon.textContent = manuallyPaused ? '▶' : 'Ⅱ';
  }

  function canAutoplay() {
    return !reducedMotion.matches && !document.hidden && visible && !manuallyPaused && !interactionPaused;
  }

  function scheduleAutoplay(delay = autoplayDelay, reset = false) {
    if (reset || !canAutoplay()) {
      window.clearTimeout(autoTimer);
      autoTimer = 0;
    }
    if (!canAutoplay() || autoTimer) return;
    autoTimer = window.setTimeout(() => {
      autoTimer = 0;
      transitionTo(1);
    }, delay);
  }

  function transitionTo(direction) {
    if (animating || cards.length < 2) return;
    window.clearTimeout(autoTimer);
    autoTimer = 0;

    const outgoingIndex = currentIndex;
    const incomingIndex = (currentIndex + direction + cards.length) % cards.length;
    const outgoing = cards[outgoingIndex];
    const incoming = cards[incomingIndex];
    loadImagesAround(incomingIndex);

    outgoing.classList.add(direction > 0 ? 'is-leaving-left' : 'is-leaving-right');
    outgoing.classList.remove('is-current');
    incoming.classList.remove('is-next', 'is-previous', 'is-hidden');
    incoming.classList.add('is-current');
    currentIndex = incomingIndex;
    setAccessibleCard(currentIndex);
    animating = true;

    window.setTimeout(() => {
      animating = false;
      renderDeck();
      outgoing.classList.add('is-resetting');
      void outgoing.offsetWidth;
      window.requestAnimationFrame(() => outgoing.classList.remove('is-resetting'));
      scheduleAutoplay();
    }, transitionDuration);
  }

  function navigateManually(direction) {
    interactionPaused = false;
    transitionTo(direction);
    scheduleAutoplay(autoplayDelay, true);
  }

  function pauseForInteraction() {
    interactionPaused = true;
    window.clearTimeout(autoTimer);
    autoTimer = 0;
  }

  function resumeAfterInteraction() {
    if (!interactionPaused) return;
    interactionPaused = false;
    scheduleAutoplay(autoplayDelay, true);
  }

  storeImageSources();
  loadImagesAround(currentIndex);
  renderDeck();
  carousel.classList.add('is-initializing', 'is-ready');
  updateToggleButton();
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => carousel.classList.remove('is-initializing')));

  carousel.addEventListener('pointerdown', (event) => {
    pauseForInteraction();
    if ((event.pointerType === 'touch' || event.pointerType === 'pen') && !event.target.closest('.career-carousel-controls')) {
      swipeStartX = event.clientX;
    }
  });
  window.addEventListener('pointerup', (event) => {
    if (swipeStartX !== null) {
      const distance = event.clientX - swipeStartX;
      if (Math.abs(distance) > 55) {
        suppressClick = true;
        window.clearTimeout(clickSuppressTimer);
        clickSuppressTimer = window.setTimeout(() => { suppressClick = false; }, 450);
        navigateManually(distance < 0 ? 1 : -1);
        swipeStartX = null;
        return;
      }
    }
    swipeStartX = null;
    resumeAfterInteraction();
  });
  window.addEventListener('pointercancel', () => {
    swipeStartX = null;
    resumeAfterInteraction();
  });
  carousel.addEventListener('click', (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  carousel.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    navigateManually(event.key === 'ArrowRight' ? 1 : -1);
  });
  previousButton.addEventListener('click', () => navigateManually(-1));
  nextButton.addEventListener('click', () => navigateManually(1));
  toggleButton.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    updateToggleButton();
    scheduleAutoplay(autoplayDelay, true);
  });
  document.addEventListener('visibilitychange', scheduleAutoplay);
  reducedMotion.addEventListener('change', () => {
    updateToggleButton();
    scheduleAutoplay();
  });

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      scheduleAutoplay();
    }, { threshold: 0.05 });
    visibilityObserver.observe(carousel);
  }

  scheduleAutoplay();
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

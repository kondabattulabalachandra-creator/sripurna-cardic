(() => {
  'use strict';
  const dataUrl = new URL('content/heart-guide.json', document.currentScript.src);
  const markers = {
    'right-atrium': [40.5, 50], 'left-atrium': [67, 46],
    'right-ventricle': [42, 77], 'left-ventricle': [71, 67],
    'tricuspid-valve': [47, 61], 'pulmonary-valve': [56, 51],
    'mitral-valve': [69, 61], 'aortic-valve': [62, 51],
    'aorta': [54, 21], 'pulmonary-artery': [61, 35],
    'pulmonary-veins': [68, 39], 'superior-vena-cava': [40, 25],
    'inferior-vena-cava': [42, 84], 'interventricular-septum': [61, 73]
  };
  const fallbackId = (item) => item.topic_id || item.id;
  const escapeText = (value) => String(value ?? '');
  const makeLink = (href, text) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank';
    link.rel = 'noopener';
    return link;
  };

  const getAnatomyEls = () => ({
    list: document.getElementById('structureList'),
    card: document.getElementById('structureCard'),
    hotspots: document.getElementById('diagramHotspots'),
    search: document.getElementById('structureSearch')
  });
  const getFlowEls = () => ({
    track: document.getElementById('flowTrack'),
    title: document.getElementById('flowStepTitle'),
    description: document.getElementById('flowStepDescription'),
    label: document.getElementById('flowStepLabel'),
    count: document.getElementById('stepCount'),
    type: document.getElementById('circulationType'),
    oxygen: document.getElementById('oxygenStatus'),
    sources: document.getElementById('flowSources'),
    list: document.getElementById('flowTextAlternative'),
    particle: document.getElementById('flowParticle'),
    previous: document.getElementById('flowPrevious'),
    next: document.getElementById('flowNext'),
    play: document.getElementById('flowPlay'),
    pause: document.getElementById('flowPause'),
    reset: document.getElementById('flowReset')
  });

  function init(data) {
    const parts = Array.isArray(data.anatomy) ? data.anatomy : [];
    const steps = Array.isArray(data.circulation?.steps) ? data.circulation.steps : [];
    initAnatomy(parts);
    initFlow(steps, data.circulation?.sources || []);
    initHubSearch(parts);
  }

  function initAnatomy(parts) {
    const els = getAnatomyEls();
    if (!els.list || !parts.length) return;
    let selectedId = null;
    const buttonById = new Map();
    const markerById = new Map();
    const sortedParts = parts.slice();

    function select(item) {
      const id = fallbackId(item);
      if (!id) return;
      selectedId = id;
      buttonById.forEach((button, key) => button.setAttribute('aria-pressed', String(key === id)));
      markerById.forEach((button, key) => button.setAttribute('aria-pressed', String(key === id)));
      renderPart(item);
    }

    function renderPart(item) {
      const title = document.getElementById('structureTitle');
      const category = document.getElementById('structureCategory');
      const intro = document.getElementById('structureIntro');
      const copy = document.getElementById('structureCopy');
      const sources = document.getElementById('structureSources');
      const refSummary = document.getElementById('structureReferenceSummary');
      if (!title || !copy) return;
      title.textContent = escapeText(item.name);
      if (category) category.textContent = item.category || 'HEART STRUCTURE';
      if (intro) intro.textContent = escapeText(item.plain_explanation || item.function);
      copy.replaceChildren();
      const facts = [
        ['Where it is', item.location],
        ['Why it matters', item.when_it_does_not_work]
      ];
      facts.forEach(([heading, value]) => {
        if (!value) return;
        const section = document.createElement('section');
        const h = document.createElement('h4');
        const p = document.createElement('p');
        h.textContent = heading;
        p.textContent = value;
        section.append(h, p);
        copy.append(section);
      });
      if (sources) {
        sources.replaceChildren(document.createTextNode('Sources: '));
        (item.sources || []).forEach((source, index) => {
          if (!/^https:\/\//i.test(source.url || '')) return;
          if (index) sources.append(document.createTextNode(' · '));
          sources.append(makeLink(source.url, source.title || 'Medical reference'));
        });
      }
      if (refSummary) refSummary.textContent = `Sources and science notes (${(item.sources || []).length})`;
    }

    function buildControls(list) {
      els.list.replaceChildren();
      els.hotspots?.replaceChildren();
      buttonById.clear();
      markerById.clear();
      const noResults = document.getElementById('structureNoResults');
      if (noResults) noResults.hidden = list.length !== 0;
      list.forEach((item) => {
        const id = fallbackId(item);
        if (!id) return;
        const number = parts.indexOf(item) + 1;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'structure-choice';
        button.setAttribute('aria-pressed', String(id === selectedId));
        const badge = document.createElement('span');
        badge.className = 'structure-choice-number';
        badge.textContent = String(number);
        const name = document.createElement('span');
        name.textContent = escapeText(item.name);
        button.append(badge, name);
        button.addEventListener('click', () => select(item));
        els.list.append(button);
        buttonById.set(id, button);

        const point = markers[id];
        if (point && els.hotspots) {
          const marker = document.createElement('button');
          marker.type = 'button';
          marker.className = 'diagram-hotspot';
          marker.style.left = `${point[0]}%`;
          marker.style.top = `${point[1]}%`;
          marker.textContent = String(number);
          marker.setAttribute('aria-label', `Select ${item.name}`);
          marker.setAttribute('aria-pressed', String(id === selectedId));
          marker.addEventListener('click', () => select(item));
          els.hotspots.append(marker);
          markerById.set(id, marker);
        }
      });
    }

    buildControls(sortedParts);
    if (els.search) {
      els.search.addEventListener('input', () => {
        const query = els.search.value.trim().toLocaleLowerCase();
        const filtered = sortedParts.filter((item) => {
          const terms = [item.name, item.location, item.function, ...(item.related_conditions || [])].join(' ').toLocaleLowerCase();
          return terms.includes(query);
        });
        buildControls(filtered);
      });
    }
    const requested = new URLSearchParams(window.location.search).get('structure');
    const initial = sortedParts.find((item) => fallbackId(item) === requested) || sortedParts[0];
    if (initial) select(initial);
  }

  function initFlow(steps, sources) {
    const els = getFlowEls();
    if (!els.track || !steps.length) return;
    let index = 0;
    let timer = null;
    const intervalMs = 4200;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionNote = document.getElementById('flowMotionNote');
    const regularMotionNote = 'Play advances the explanation every few seconds. You can pause, step forward or back, or reset at any time.';
    const pointXs = [68, 176, 284, 390, 500, 610, 718, 826, 932];
    const flowKind = (step) => {
      const value = String(step.circulation || '').toLowerCase();
      if (value.includes('systemic')) return 'Systemic circulation';
      if (value.includes('pulmonary')) return 'Pulmonary circulation';
      return 'Blood circulation';
    };
    const isRich = (step) => /oxygen-rich|oxygenated|rich/i.test(String(step.oxygen_status || ''));

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      els.track.closest('.flow-map')?.classList.remove('is-playing');
      if (els.pause) els.pause.disabled = true;
      if (els.play) {
        els.play.disabled = motionPreference.matches;
        els.play.setAttribute('aria-pressed', 'false');
      }
    }
    function render() {
      const step = steps[index];
      if (!step) return;
      if (els.title) els.title.textContent = step.title || step.structure || `Step ${index + 1}`;
      if (els.description) els.description.textContent = step.description || '';
      if (els.label) els.label.textContent = `Step ${index + 1} · ${step.structure || 'Heart and circulation'}`;
      if (els.count) els.count.textContent = `Step ${index + 1} of ${steps.length}`;
      if (els.type) els.type.textContent = flowKind(step);
      if (els.oxygen) {
        els.oxygen.textContent = step.oxygen_status || 'Blood flow';
        els.oxygen.classList.toggle('oxygen-rich', isRich(step));
      }
      if (els.particle) {
        els.particle.setAttribute('cx', String(pointXs[index] ?? 68));
        els.particle.setAttribute('cy', '105');
      }
      document.querySelectorAll('[data-flow-node]').forEach((node, nodeIndex) => {
        node.classList.toggle('is-current', nodeIndex === index);
      });
      if (els.sources) {
        els.sources.replaceChildren(document.createTextNode('Sources: '));
        (sources || []).forEach((source, sourceIndex) => {
          if (!/^https:\/\//i.test(source.url || '')) return;
          if (sourceIndex) els.sources.append(document.createTextNode(' · '));
          els.sources.append(makeLink(source.url, source.title || 'Medical reference'));
        });
      }
      [...els.track.children].forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      const map = document.getElementById('flowMapScroll');
      const currentStop = els.track.children[index];
      if (map && currentStop) {
        const stopCenter = currentStop.offsetLeft + currentStop.offsetWidth / 2;
        const left = Math.max(0, stopCenter - map.clientWidth / 2);
        map.scrollTo({ left, behavior: motionPreference.matches ? 'auto' : 'smooth' });
      }
      if (els.previous) els.previous.disabled = index === 0;
      if (els.next) els.next.disabled = index === steps.length - 1;
      document.querySelectorAll('#flowTextAlternative li').forEach((item, itemIndex) => {
        item.toggleAttribute('aria-current', itemIndex === index);
      });
    }
    function goTo(nextIndex) {
      index = Math.max(0, Math.min(steps.length - 1, nextIndex));
      render();
    }

    steps.forEach((step, stepIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'flow-map-stop';
      button.setAttribute('aria-label', `Go to step ${stepIndex + 1}: ${step.title || step.structure || ''}`);
      const mapX = pointXs[stepIndex] ?? pointXs[pointXs.length - 1];
      button.style.left = `${mapX / 10}%`;
      button.style.top = `${(105 / 220) * 100}%`;
      button.textContent = String(stepIndex + 1);
      button.addEventListener('click', () => { stop(); goTo(stepIndex); });
      els.track.append(button);
      const li = document.createElement('li');
      li.textContent = `${step.title || step.structure}: ${step.description || ''}`;
      els.list?.append(li);
    });
    els.previous?.addEventListener('click', () => { stop(); goTo(index - 1); });
    els.next?.addEventListener('click', () => { stop(); goTo(index + 1); });
    els.reset?.addEventListener('click', () => { stop(); goTo(0); });
    els.play?.addEventListener('click', () => {
      if (motionPreference.matches) return;
      if (index >= steps.length - 1) goTo(0);
      els.play.disabled = true;
      els.play.setAttribute('aria-pressed', 'true');
      els.track.closest('.flow-map')?.classList.add('is-playing');
      if (els.pause) els.pause.disabled = false;
      timer = window.setInterval(() => {
        if (index >= steps.length - 1) { stop(); return; }
        goTo(index + 1);
      }, intervalMs);
    });
    els.pause?.addEventListener('click', stop);
    if (motionPreference.matches && els.play) {
      els.play.disabled = true;
      els.play.title = 'Automatic playback is disabled by your reduced-motion preference. Use the step controls instead.';
      if (motionNote) motionNote.textContent = 'Automatic playback is off because your device requests reduced motion. Use Previous, Next step or the numbered stops instead.';
    }
    motionPreference.addEventListener?.('change', (event) => {
      if (event.matches) {
        stop();
        if (els.play) {
          els.play.disabled = true;
          els.play.title = 'Automatic playback is disabled by your reduced-motion preference. Use the step controls instead.';
        }
        if (motionNote) motionNote.textContent = 'Automatic playback is off because your device requests reduced motion. Use Previous, Next step or the numbered stops instead.';
      } else {
        if (els.play) {
          els.play.disabled = false;
          els.play.removeAttribute('title');
        }
        if (motionNote) motionNote.textContent = regularMotionNote;
      }
    });
    render();
  }

  function initHubSearch(parts) {
    const input = document.getElementById('hubSearch');
    const results = document.getElementById('hubSearchResults');
    if (!input || !results) return;
    function render() {
      const query = input.value.trim().toLocaleLowerCase();
      results.replaceChildren();
      if (!query) return;
      const matches = parts.filter((item) => {
        const terms = [item.name, item.location, item.function, ...(item.related_conditions || [])].join(' ').toLocaleLowerCase();
        return terms.includes(query);
      }).slice(0, 6);
      if (!matches.length) {
        const note = document.createElement('p');
        note.textContent = 'No matching anatomy topic in this first guide. Try a chamber, valve or vessel name.';
        results.append(note);
        return;
      }
      matches.forEach((item) => {
        const link = document.createElement('a');
        link.href = `anatomy/?structure=${encodeURIComponent(fallbackId(item))}`;
        link.textContent = `${item.name} — open anatomy guide →`;
        results.append(link);
      });
    }
    input.addEventListener('input', render);
  }

  fetch(dataUrl, { credentials: 'same-origin' })
    .then((response) => {
      if (!response.ok) throw new Error(`Guide data could not be loaded (${response.status}).`);
      return response.json();
    })
    .then(init)
    .catch(() => {
      const loading = document.getElementById('structureLoading');
      if (loading) loading.textContent = 'The interactive guide could not load. Please refresh the page or return later.';
      const flowTitle = document.getElementById('flowStepTitle');
      if (flowTitle) flowTitle.textContent = 'The guide is temporarily unavailable';
      const hubResults = document.getElementById('hubSearchResults');
      if (hubResults) hubResults.textContent = 'The anatomy search is temporarily unavailable.';
    });
})();

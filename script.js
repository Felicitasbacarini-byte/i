// ============================================================
// APEX — main script
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
   * 1. SCROLL REVEAL — todos los elementos .reveal van apareciendo
   * --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------
   * 2. VOLANTE — zonas clickeables con overlay duotone
   * --------------------------------------------------------- */
  const zoneInfo = {
    'zone-left':   { overlay: 'wheel-overlay-left',   tag: '// BOTONES IZQUIERDA', text: 'Pulsadores mecánicos para FLASH, ENABLE y MUTE. Acceso instantáneo sin soltar el volante.' },
    'zone-right':  { overlay: 'wheel-overlay-right',  tag: '// BOTONES DERECHA', text: 'PIT LIMIT, RADIO y RESET. Funciones críticas de carrera al alcance del pulgar.' },
    'zone-screen': { overlay: 'wheel-overlay-screen', tag: '// PANTALLA LCD DE TELEMETRÍA', text: 'Panel central con marcha, tiempos por vuelta, velocidad y estado térmico de neumáticos en tiempo real.' },
    'zone-paddles':{ overlay: 'wheel-overlay-paddles',tag: '// GRIPS Y PADDLES', text: 'Ergonomía de competición: paddles de cambio y grips diseñados para sesiones largas sin fatiga.' },
  };

  const tooltip = document.getElementById('wheel-tooltip');
  const tooltipTag = document.getElementById('tooltip-tag');
  const tooltipText = document.getElementById('tooltip-text');
  let activeZone = null;

  Object.keys(zoneInfo).forEach(zoneId => {
    const btn = document.getElementById(zoneId);
    if (!btn) return;
    btn.addEventListener('click', () => activateZone(zoneId));
  });

  function activateZone(zoneId) {
    if (activeZone) {
      document.getElementById(zoneInfo[activeZone].overlay)?.classList.remove('is-active');
    }
    document.getElementById(zoneInfo[zoneId].overlay)?.classList.add('is-active');
    activeZone = zoneId;

    const info = zoneInfo[zoneId];
    tooltipTag.textContent = info.tag;
    tooltipText.textContent = info.text;
    tooltip.classList.add('is-visible');
  }

  /* ---------------------------------------------------------
   * 3. SCROLL-DRIVEN: el volante arranca al lado del texto
   *    (como en la referencia) y con el scroll baja, se centra
   *    horizontalmente y crece, dejando de competir con el texto.
   * --------------------------------------------------------- */
  const wheelStage = document.getElementById('wheel-stage');
  const wheelWrapEl = document.getElementById('wheel-wrap');
  const introEl = document.getElementById('tecnologia-intro');

  function updateWheelScroll() {
    if (!wheelStage) return;
    const rect = wheelStage.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    let progress = (-rect.top) / total;
    progress = Math.min(Math.max(progress, 0), 1);

    // el volante permanece quieto mientras el texto se desvanece (0 -> 0.4),
    // y solo después de eso empieza a moverse hacia el centro y crecer
    const moveProgress = Math.max(0, (progress - 0.35) / 0.65);
    const top = 46 + (moveProgress * 24);       // 46% -> 70%
    const left = 74 - (moveProgress * 24);      // 74% -> 50%
    const scale = 1 + (moveProgress * 0.55);    // 1   -> 1.55

    wheelWrapEl.style.setProperty('--wheel-top', `${top}%`);
    wheelWrapEl.style.setProperty('--wheel-left', `${left}%`);
    wheelWrapEl.style.setProperty('--wheel-scale', scale.toFixed(3));

    // el texto se desvanece en la primera mitad del scroll, completamente
    // disuelto antes de que el volante cruce hacia el centro
    const introOpacity = 1 - Math.min(1, progress / 0.4);
    introEl.style.opacity = Math.max(0, introOpacity).toFixed(2);
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateWheelScroll);
  }, { passive: true });
  window.addEventListener('resize', updateWheelScroll);
  updateWheelScroll();


  /* ---------------------------------------------------------
   * 4. CURSOS — click: se agranda mínimamente con un glow
   * --------------------------------------------------------- */
  const programaCards = document.querySelectorAll('.programa-card');
  programaCards.forEach(card => {
    card.addEventListener('click', () => {
      programaCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });


  /* ---------------------------------------------------------
   * 5. CIRCUITOS — flechas cambian la imagen central
   * --------------------------------------------------------- */
  const circuitos = [
    { src: 'assets/lusail.png',   label: 'LUSAIL INTERNATIONAL CIRCUIT — QATAR' },
    { src: 'assets/shanghai.png', label: 'SHANGHAI INTERNATIONAL CIRCUIT — CHINA' },
    { src: 'assets/lusail.png',   label: 'PRÓXIMO CIRCUITO — AUSTRALIA (PRÓXIMAMENTE)' },
  ];

  let circIndex = 0;
  const circImg = document.getElementById('circuito-img');
  const circLabel = document.getElementById('circuito-label');
  const flagBtns = document.querySelectorAll('.flag-btn');

  function renderCircuito(newIndex) {
    circImg.classList.remove('active');
    setTimeout(() => {
      const data = circuitos[newIndex];
      circImg.src = data.src;
      circLabel.textContent = data.label;
      circImg.classList.add('active');
    }, 220);

    flagBtns.forEach((btn, i) => btn.classList.toggle('active', i === newIndex));
    circIndex = newIndex;
  }

  document.getElementById('circ-prev').addEventListener('click', () => {
    const next = (circIndex - 1 + circuitos.length) % circuitos.length;
    renderCircuito(next);
  });
  document.getElementById('circ-next').addEventListener('click', () => {
    const next = (circIndex + 1) % circuitos.length;
    renderCircuito(next);
  });
  flagBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => renderCircuito(i));
  });

});

gsap.registerPlugin(ScrollTrigger);

// ─── Initial states ───────────────────────────────────────────────────────────

gsap.set('.hero-line', { y: 60, opacity: 0 });
gsap.set('.hero-name', { opacity: 0 });

// ─── Page load: hero text ─────────────────────────────────────────────────────

const loadTl = gsap.timeline({ delay: 0.25, defaults: { ease: 'power3.out' } });

loadTl
  .to('.hero-line', {
    y: 0,
    opacity: 1,
    duration: 1.3,
    stagger: 0.18,
  })
  .to('.hero-name', {
    opacity: 1,
    duration: 1.1,
  }, '-=0.7');

// ─── Scroll reveal helper ─────────────────────────────────────────────────────

function revealOnScroll(selector, opts = {}) {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: opts.y ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.95,
        ease: opts.ease ?? 'power2.out',
        delay: opts.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─── Pixel clip-path edges ───────────────────────────────────────────────────

function seededRand(seed) {
  let s = (seed * 7919 + 1) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pixelClipPath(seed, S = 3) {
  const rng = seededRand(seed);
  const n = Math.ceil(100 / S);
  const pts = [];
  const f = (x, y) => `${+x.toFixed(1)}% ${+y.toFixed(1)}%`;

  // Top edge: going right, y jitters between 0 and S
  let pj = rng() > 0.5 ? S : 0;
  pts.push(f(0, pj));
  for (let i = 1; i <= n; i++) {
    const x = Math.min(i * S, 100);
    const j = i < n ? (rng() > 0.5 ? S : 0) : pj;
    pts.push(f(x, pj));
    if (j !== pj) pts.push(f(x, j));
    pj = j;
  }
  pts.push(f(100, 0)); // top-right corner

  // Right edge: going down, x jitters between 100-S and 100
  pj = rng() > 0.5 ? S : 0;
  pts.push(f(100 - pj, 0));
  for (let i = 1; i <= n; i++) {
    const y = Math.min(i * S, 100);
    const j = i < n ? (rng() > 0.5 ? S : 0) : pj;
    pts.push(f(100 - pj, y));
    if (j !== pj) pts.push(f(100 - j, y));
    pj = j;
  }
  pts.push(f(100, 100)); // bottom-right corner

  // Bottom edge: going left, y jitters between 100-S and 100
  pj = rng() > 0.5 ? S : 0;
  pts.push(f(100, 100 - pj));
  for (let i = 1; i <= n; i++) {
    const x = Math.max(100 - i * S, 0);
    const j = i < n ? (rng() > 0.5 ? S : 0) : pj;
    pts.push(f(x, 100 - pj));
    if (j !== pj) pts.push(f(x, 100 - j));
    pj = j;
  }
  pts.push(f(0, 100)); // bottom-left corner

  // Left edge: going up, x jitters between 0 and S
  pj = rng() > 0.5 ? S : 0;
  pts.push(f(pj, 100));
  for (let i = 1; i <= n; i++) {
    const y = Math.max(100 - i * S, 0);
    const j = i < n ? (rng() > 0.5 ? S : 0) : pj;
    pts.push(f(pj, y));
    if (j !== pj) pts.push(f(j, y));
    pj = j;
  }
  pts.push(f(0, 0));

  return `polygon(${pts.join(', ')})`;
}

// Photos now use the Stardew canvas border (CSS) — no clip-path needed.

// ─── Photos: each slides up on its own as you scroll ─────────────────────────

gsap.utils.toArray('.photo').forEach((photo) => {
  gsap.fromTo(photo,
    { opacity: 0, y: 70 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: photo,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
  );
});

// ─── Content reveals ──────────────────────────────────────────────────────────

revealOnScroll('.story-text');

revealOnScroll('.person-name', { y: 50, duration: 1.1, ease: 'power3.out' });
revealOnScroll('.person-bio', { delay: 0.15 });

gsap.utils.toArray('.detail-item').forEach((item, i) => {
  gsap.fromTo(item.querySelector('.detail-label'),
    { opacity: 0, y: 35 },
    {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: item, start: 'top 86%', toggleActions: 'play none none none' },
    }
  );
  gsap.fromTo(item.querySelector('.detail-value'),
    { opacity: 0, y: 18 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: i * 0.1 + 0.14,
      scrollTrigger: { trigger: item, start: 'top 86%', toggleActions: 'play none none none' },
    }
  );
});

revealOnScroll('.rsvp-title');
revealOnScroll('.rsvp-text', { delay: 0.15 });
revealOnScroll('.rsvp-buttons', { delay: 0.28 });

// ─── RSVP ────────────────────────────────────────────────────────────────────

(function setupRSVP() {
  // ← Paste your Google Apps Script Web App URL here after deploying
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyP30f9RmgSm7E8gA_HxqNn1qbMwq_lbUdufTWnXrnBLhFtpmtdpsbfXI0K3AnyY5-uFg/exec';

  // Read guest name from URL: ?guest=Marko
  const guestName = new URLSearchParams(window.location.search).get('guest') || '';

  // Show personalised greeting if name present
  const greetingEl = document.getElementById('rsvp-greeting');
  if (guestName && greetingEl) {
    greetingEl.textContent = `Hey ${guestName}!`;
  }

  function submit(response) {
    // Disable both buttons immediately to prevent double clicks
    document.getElementById('btn-yes').disabled = true;
    document.getElementById('btn-no').disabled  = true;

    // Send to Google Sheets (no-cors = fire and forget, data still saves)
    const body = new URLSearchParams({
      name:      guestName || 'Guest',
      response:  response,
    });
    fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    // Swap to confirmation screen
    const form    = document.getElementById('rsvp-form');
    const confirm = document.getElementById('rsvp-confirm');
    const msg     = document.getElementById('rsvp-confirm-msg');

    const name = guestName ? `, ${guestName}` : '';

    msg.textContent = response === 'yes'
      ? `See you on August 8th${name}! 🎉`
      : `We'll miss you${name}. Thanks for letting us know. 🤍`;

    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete() {
        form.style.display = 'none';
        confirm.style.display = 'flex';
        gsap.from(confirm, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      }
    });
  }

  document.getElementById('btn-yes').addEventListener('click', () => submit('yes'));
  document.getElementById('btn-no').addEventListener('click',  () => submit('no'));
}());

// ─── Waving sprite (RSVP section) ────────────────────────────────────────────

(function setupWave() {
  const sprite = document.getElementById('wave-sprite');
  const frames = ['wave-1.png', 'wave-2.png', 'wave-3.png'];
  let idx = 0;

  // Cycle frames at ~4fps for a natural pixel-art wave
  setInterval(() => {
    idx = (idx + 1) % frames.length;
    sprite.src = frames[idx];
  }, 220);

  // Fade in on page load — delayed so it feels like they walked into frame
  gsap.to('.wave-stage', {
    opacity: 1,
    duration: 1.2,
    ease: 'power2.out',
    delay: 1.5,
  });
}());

// ─── Stardew Valley decorations ──────────────────────────────────────────────

// Stars scattered across the dark hero
(function createStars() {
  const hero = document.querySelector('.hero');
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('div');
    s.className = `star${Math.random() > 0.5 ? ' cross' : ''}`;
    s.style.left  = `${3 + Math.random() * 94}%`;
    s.style.top   = `${2 + Math.random() * 70}%`;
    s.style.setProperty('--dur',   `${1.3 + Math.random() * 2.8}s`);
    s.style.setProperty('--delay', `${Math.random() * 5}s`);
    hero.appendChild(s);
  }
}());

// Fireflies drifting upward through every section
(function createFireflies() {
  document.querySelectorAll('.card').forEach(section => {
    const count = section.classList.contains('card--green') ? 4 : 7;
    for (let i = 0; i < count; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      f.style.left = `${6 + Math.random() * 88}%`;
      f.style.top  = `${20 + Math.random() * 65}%`;
      f.style.setProperty('--dur',   `${3.5 + Math.random() * 4.5}s`);
      f.style.setProperty('--delay', `${Math.random() * 8}s`);
      f.style.setProperty('--x1', `${(Math.random() - 0.5) * 80}px`);
      f.style.setProperty('--y1', `${-12 - Math.random() * 38}px`);
      f.style.setProperty('--x2', `${(Math.random() - 0.5) * 60}px`);
      f.style.setProperty('--y2', `${-38 - Math.random() * 42}px`);
      f.style.setProperty('--x3', `${(Math.random() - 0.5) * 100}px`);
      f.style.setProperty('--y3', `${-65 - Math.random() * 55}px`);
      section.appendChild(f);
    }
  });
}());

// Pixel grass tufts along the top edge of each cream card
(function createGrass() {
  const dk = '#3d7a42', md = '#4d9a54', lt = '#5db965';
  const variants = [
    // Tall centre spike
    `0 -4px 0 0 ${md}, -4px -4px 0 0 ${dk}, 4px -4px 0 0 ${md}, 0 -8px 0 0 ${md}, -4px -8px 0 0 ${md}, 4px -8px 0 0 ${dk}, 0 -12px 0 0 ${lt}`,
    // Wide squat bush
    `0 -4px 0 0 ${md}, -4px -4px 0 0 ${md}, 4px -4px 0 0 ${dk}, -8px -4px 0 0 ${dk}, 8px -4px 0 0 ${md}, 0 -8px 0 0 ${lt}, -4px -8px 0 0 ${md}, 4px -8px 0 0 ${md}`,
    // Skinny blade
    `0 -4px 0 0 ${md}, 0 -8px 0 0 ${lt}, 4px -4px 0 0 ${dk}`,
    // Double spike
    `0 -4px 0 0 ${md}, 8px -4px 0 0 ${dk}, 0 -8px 0 0 ${lt}, 8px -8px 0 0 ${md}, 0 -12px 0 0 ${md}`,
  ];

  document.querySelectorAll('.card--cream').forEach(section => {
    const strip = document.createElement('div');
    strip.className = 'grass-strip';
    section.insertBefore(strip, section.firstChild);

    let x = 6;
    const W = window.innerWidth;
    while (x < W - 16) {
      const el = document.createElement('div');
      el.className = 'grass-tuft';
      el.style.left      = `${x}px`;
      el.style.background = dk;
      el.style.boxShadow  = variants[Math.floor(Math.random() * variants.length)];
      strip.appendChild(el);
      x += 12 + Math.random() * 22;
    }
  });
}());

// ─── Character walk-in ───────────────────────────────────────────────────────

function setupCharacter({ cardId, charId, walkFrames, idleFrame, fromLeft }) {
  const card  = document.getElementById(cardId);
  const charEl = document.getElementById(charId);
  if (!card || !charEl) return;

  const img = charEl.querySelector('img');

  // Start off-screen, facing direction of travel
  gsap.set(charEl, {
    x: fromLeft ? '-110vw' : '110vw',
    scaleX: fromLeft ? 1 : -1,   // face the way they're walking
  });

  let frameIdx   = 0;
  let walkTimer  = null;

  function startWalk() {
    walkTimer = setInterval(() => {
      frameIdx = (frameIdx + 1) % walkFrames.length;
      img.src  = walkFrames[frameIdx];
    }, 120); // ~8 fps
  }

  function stopWalk() {
    clearInterval(walkTimer);
    img.src = idleFrame;
    // Snap to face front
    gsap.set(charEl, { scaleX: 1 });
  }

  ScrollTrigger.create({
    trigger: card,
    start: 'top 65%',
    once: true,
    onEnter() {
      startWalk();
      gsap.to(charEl, {
        x: 0,
        duration: 2.8,
        ease: 'none',       // constant speed = natural walk
        onComplete: stopWalk,
      });
    },
  });
}

// Eda — walks in from the left
setupCharacter({
  cardId:     'card-eda',
  charId:     'char-eda',
  walkFrames: ['eda_walk1.png', 'eda_walk2.png', 'eda_walk3.png'],
  idleFrame:  'eda_idle.png',
  fromLeft:   true,
});

// Onat — walks in from the right
setupCharacter({
  cardId:     'card-onat',
  charId:     'char-onat',
  walkFrames: ['onat-walk1.png', 'onat-walk2.png', 'onat-walk3.png'],
  idleFrame:  'onat-idle.png',
  fromLeft:   false,
});

// Golden diamond corner ornaments on person cards
(function createCornerOrnaments() {
  document.querySelectorAll('.person-card').forEach(card => {
    [
      { top: '20px',    left: '20px'  },
      { top: '20px',    right: '20px' },
      { bottom: '20px', left: '20px'  },
      { bottom: '20px', right: '20px' },
    ].forEach(pos => {
      const el = document.createElement('div');
      el.className = 'px-corner';
      Object.assign(el.style, pos);
      card.appendChild(el);
    });
  });
}());

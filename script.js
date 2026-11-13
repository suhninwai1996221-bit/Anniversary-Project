/* ═══════════════════════════════════════════════
   Maung Thar Htet Paing ♥ Ma Su Hnin Wai
   Anniversary — 2 Years & 4 Months (since 01.08.2024)
   ═══════════════════════════════════════════════ */
'use strict';

/* ── 1. LIVE ANNIVERSARY COUNTER ─────────────────────────────── */
(function initCounter() {
  const START = new Date(2024, 7, 1, 0, 0, 0); // months are 0-indexed → 1 Aug 2024

  const el = {
    years: document.getElementById('cYears'),
    months: document.getElementById('cMonths'),
    days: document.getElementById('cDays'),
    hours: document.getElementById('cHours'),
    minutes: document.getElementById('cMinutes'),
    seconds: document.getElementById('cSeconds'),
    totalDays: document.getElementById('totalDays'),
  };

  function elapsed(now) {
    let y = now.getFullYear() - START.getFullYear();
    let m = now.getMonth() - START.getMonth();
    let d = now.getDate() - START.getDate();

    if (d < 0) {
      m -= 1;
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); // days in previous month
    }
    if (m < 0) { y -= 1; m += 12; }

    const anchor = new Date(START);
    anchor.setFullYear(START.getFullYear() + y);
    anchor.setMonth(START.getMonth() + m);
    anchor.setDate(START.getDate() + d);
    let rest = Math.max(0, now - anchor);

    const h = Math.floor(rest / 3600000); rest -= h * 3600000;
    const min = Math.floor(rest / 60000); rest -= min * 60000;
    const s = Math.floor(rest / 1000);

    const totalDays = Math.floor((now - START) / 86400000);
    return { y, m, d, h, min, s, totalDays };
  }

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const t = elapsed(new Date());
    el.years.textContent = t.y;
    el.months.textContent = t.m;
    el.days.textContent = t.d;
    el.hours.textContent = pad(t.h);
    el.minutes.textContent = pad(t.min);
    el.seconds.textContent = pad(t.s);
    el.totalDays.textContent = t.totalDays.toLocaleString();
  }

  tick();
  setInterval(tick, 1000);
})();

/* ── 2. FALLING ROSE PETALS ───────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petals');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#e2607e', '#f08ca0', '#f6c9d4', '#d44d6c', '#e890aa'];
  const COUNT = Math.min(46, Math.floor(window.innerWidth / 32));

  function makePetal(scattered) {
    return {
      x: Math.random() * W,
      y: scattered ? Math.random() * H : -30 - Math.random() * H * 0.3,
      len: 9 + Math.random() * 12,
      wid: 6 + Math.random() * 8,
      vy: 0.5 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.6,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.012,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.75 + Math.random() * 0.25,
    };
  }

  let petals = Array.from({ length: COUNT }, () => makePetal(true));

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x + Math.sin(p.sway) * 22, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.wid, p.len, 0, 0, Math.PI * 2);
    ctx.fill();
    // petal crease
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.strokeStyle = '#a63a55';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -p.len + 2);
    ctx.quadraticCurveTo(p.wid * 0.4, 0, 0, p.len - 2);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vrot;
      p.sway += p.swaySpeed;
      if (p.y > H + 40) Object.assign(p, makePetal(false));
      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── 3. SCROLL REVEALS ────────────────────────────────────────── */
(function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((i) => i.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach((i) => io.observe(i));
})();

/* ── 4. NAV SHRINK ON SCROLL ──────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 5. LIGHTBOX ──────────────────────────────────────────────── */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.frame').forEach((frame) => {
    const img = frame.querySelector('img');
    frame.addEventListener('click', () => open(img.src, img.alt));
    frame.setAttribute('role', 'button');
    frame.setAttribute('tabindex', '0');
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.src, img.alt); }
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

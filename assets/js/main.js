/* =========================================================
   IVORA Immobilier — interactions & animations
   ========================================================= */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 760px)').matches;

  /* ---------------- Données du portefeuille ---------------- */
  var I = {
    home: '<svg><use href="#i-sofa"/></svg>',
    car: '<svg><use href="#i-car"/></svg>'
  };
  var DATA = {
    appartements: [
      { img: 'assets/img/plateau-tours.jpg', title: 'Résidence Azur Lagune', loc: 'Le Plateau', price: 'dès 85 M FCFA', plan: 'sur 10 ans', apport: '15 M FCFA', date: '09/2027' },
      { img: 'assets/img/interieur-salon.jpg', title: 'Les Jardins de la Riviera', loc: 'Riviera Golf', price: 'dès 120 M FCFA', plan: 'sur 8 ans', apport: '20 M FCFA', date: '03/2027' },
      { img: 'assets/img/penthouse.jpg', title: 'Penthouse Ébrié', loc: 'Cocody Ambassades', price: 'dès 310 M FCFA', plan: 'sur 5 ans', apport: '60 M FCFA', date: '12/2026' },
      { img: 'assets/img/appartement.jpg', title: 'Résidence Les Cocotiers', loc: 'Marcory Zone 4', price: 'dès 65 M FCFA', plan: 'sur 10 ans', apport: '12 M FCFA', date: '06/2027' },
      { img: 'assets/img/plateau-vue.jpg', title: 'Tour Horizon Plateau', loc: 'Le Plateau', price: 'dès 140 M FCFA', plan: 'sur 7 ans', apport: '25 M FCFA', date: '01/2028' }
    ],
    villas: [
      { img: 'assets/img/villa-luxe.jpg', title: 'Villa Corail', loc: 'Assinie-Mafia', price: 'dès 450 M FCFA', plan: 'sur 5 ans', apport: '90 M FCFA', date: '11/2026' },
      { img: 'assets/img/villa-moderne.jpg', title: 'Villa Fromager', loc: 'Cocody Riviera 3', price: 'dès 280 M FCFA', plan: 'sur 6 ans', apport: '55 M FCFA', date: '04/2027' },
      { img: 'assets/img/villa-palmiers.jpg', title: 'Domaine des Palmiers', loc: 'Bingerville', price: 'dès 190 M FCFA', plan: 'sur 8 ans', apport: '35 M FCFA', date: '08/2027' },
      { img: 'assets/img/piscine-vue.jpg', title: 'Villa Horizon Océan', loc: 'Grand-Bassam', price: 'dès 360 M FCFA', plan: 'sur 5 ans', apport: '70 M FCFA', date: '02/2027' },
      { img: 'assets/img/vacances.jpg', title: 'Lodge Lagune Aby', loc: 'Assinie', price: 'dès 150 M FCFA', plan: 'sur 6 ans', apport: '30 M FCFA', date: '07/2027' }
    ],
    location: [
      { img: 'assets/img/interieur-salon.jpg', title: 'Appartement meublé F4', loc: 'Cocody II Plateaux', price: '1,2 M FCFA/mois', plan: 'bail 1 an', apport: '3 mois', date: 'Immédiat' },
      { img: 'assets/img/bureau.jpg', title: 'Plateau de bureaux', loc: 'Le Plateau', price: '4,5 M FCFA/mois', plan: 'bail 3 ans', apport: '6 mois', date: 'Immédiat' },
      { img: 'assets/img/villa-moderne.jpg', title: 'Villa duplex 5 pièces', loc: 'Riviera Palmeraie', price: '2,8 M FCFA/mois', plan: 'bail 2 ans', apport: '3 mois', date: '01/2027' },
      { img: 'assets/img/appartement.jpg', title: 'Studio standing', loc: 'Marcory Biétry', price: '450 000 FCFA/mois', plan: 'bail 1 an', apport: '2 mois', date: 'Immédiat' },
      { img: 'assets/img/lagune.jpg', title: 'Résidence bord de lagune', loc: 'Cocody Blockhaus', price: '1,9 M FCFA/mois', plan: 'bail 1 an', apport: '3 mois', date: '12/2026' }
    ]
  };
  var PINS = [
    [5.3236, -4.0187], [5.3556, -3.9851], [5.3700, -3.9620], [5.3020, -3.9800], [5.3480, -4.0040],
    [5.3640, -4.0090], [5.3880, -3.9430], [5.3390, -3.9570], [5.3550, -4.0700], [5.2950, -3.9550]
  ];

  function cardHTML(d, i) {
    return '' +
      '<article class="pcard" style="--i:' + i + '">' +
        '<img src="' + d.img + '" alt="' + d.title + ', ' + d.loc + '" loading="lazy">' +
        '<span class="p-title-top">' + d.title + '</span>' +
        '<a href="#contact" class="p-arrow" aria-label="Voir ' + d.title + '"><svg><use href="#i-arrow-ur"/></svg></a>' +
        '<span class="p-loc"><svg><use href="#i-pin"/></svg>' + d.loc + '</span>' +
        '<span class="p-title">' + d.title + '</span>' +
        '<div class="p-info">' +
          '<div><small>Prix</small>' + d.price + '</div>' +
          '<div><small>Plan de paiement</small>' + d.plan + '</div>' +
          '<div><small>Apport initial</small>' + d.apport + '</div>' +
          '<div><small>Équipements</small><span class="feat">' + I.home + I.car + '</span></div>' +
          '<div><small>Livraison</small>' + d.date + '</div>' +
        '</div>' +
      '</article>';
  }
  function mapCardHTML() {
    return '<article class="pcard map"><div class="pmap" id="pmap"></div><span class="map-label">Trouver sur la carte</span>' +
      '<a href="#contact" class="p-arrow" aria-label="Ouvrir la carte"><svg><use href="#i-arrow-ur"/></svg></a></article>';
  }

  var grid = document.getElementById('pgrid');
  var pmap = null;

  function renderGrid(key) {
    grid.innerHTML = DATA[key].map(cardHTML).join('') + mapCardHTML();
    initPortfolioMap();
  }

  function initPortfolioMap() {
    if (typeof L === 'undefined') return;
    if (pmap) { pmap.remove(); pmap = null; }
    pmap = L.map('pmap', {
      center: [5.345, -3.995], zoom: 12, zoomControl: false, attributionControl: true,
      scrollWheelZoom: false, dragging: !isMobile, doubleClickZoom: false
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(pmap);
    var icon = L.divIcon({ className: 'pin', html: '<svg viewBox="0 0 24 24"><path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>', iconSize: [26, 26], iconAnchor: [13, 26] });
    PINS.forEach(function (p, i) {
      var m = L.marker(p, { icon: icon }).addTo(pmap);
      var el = m.getElement();
      if (el && hasGSAP && !reduce) {
        gsap.from(el.querySelector('svg'), { y: -30, opacity: 0, duration: .7, delay: .2 + i * .06, ease: 'back.out(2)' });
      }
    });
  }

  renderGrid('appartements');

  /* ---------------- Vidéo skyline : lecture seulement quand visible ---------------- */
  var skyVideo = document.querySelector('.sky-video');
  if (skyVideo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = skyVideo.play(); if (p && p.catch) p.catch(function () {}); }
        else skyVideo.pause();
      });
    }, { threshold: 0.05 }).observe(skyVideo);
  }

  /* ---------------- Onglets ---------------- */
  var tabs = document.querySelectorAll('.tab');
  var ind = document.querySelector('.tabs-ind');
  function moveInd(t) {
    ind.style.width = t.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + (t.offsetLeft - 3) + 'px)';
  }
  moveInd(document.querySelector('.tab.active'));
  window.addEventListener('resize', function () { moveInd(document.querySelector('.tab.active')); });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.classList.contains('active')) return;
      tabs.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-selected', 'true');
      moveInd(t);
      var key = t.dataset.tab;
      if (hasGSAP && !reduce) {
        gsap.to('.pcard', { opacity: 0, y: 20, scale: .98, duration: .35, stagger: .04, ease: 'power2.in', onComplete: function () {
          renderGrid(key);
          gsap.from('.pcard', { opacity: 0, y: 40, scale: .97, duration: .8, stagger: .07, ease: 'power3.out' });
          ScrollTrigger.refresh();
        } });
      } else { renderGrid(key); }
    });
  });

  /* ---------------- Menu ---------------- */
  var menu = document.getElementById('menu');
  document.querySelectorAll('[data-menu-open]').forEach(function (b) {
    b.addEventListener('click', function () { menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); });
  });
  document.querySelectorAll('[data-menu-close]').forEach(function (b) {
    b.addEventListener('click', function () { menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); });
  });
  menu.addEventListener('click', function (e) { if (e.target === menu) menu.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.classList.remove('open'); });

  /* ---------------- Favori ---------------- */
  var like = document.querySelector('.like');
  if (like) like.addEventListener('click', function () {
    like.classList.toggle('on');
    if (hasGSAP) gsap.fromTo(like, { scale: .7 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.4)' });
  });

  /* ---------------- FAQ (accordéon fluide) ---------------- */
  document.querySelectorAll('.qa').forEach(function (d) {
    var s = d.querySelector('summary'), body = d.querySelector('.qa-body');
    s.addEventListener('click', function (e) {
      if (!hasGSAP || reduce) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: .45, ease: 'power3.inOut', onComplete: function () { d.open = false; body.style.height = ''; } });
        d.classList.remove('is-open');
        s.querySelector('svg').style.transform = '';
      } else {
        // ferme les autres
        document.querySelectorAll('.qa[open]').forEach(function (o) { if (o !== d) o.querySelector('summary').click(); });
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: 'auto', duration: .55, ease: 'power3.out', onComplete: function () { body.style.height = ''; } });
        gsap.from(body.querySelector('p'), { y: -8, opacity: 0, duration: .5, delay: .1 });
      }
    });
  });

  /* ---------------- Carte du footer ---------------- */
  if (typeof L !== 'undefined') {
    var fm = L.map('footmap', { center: [5.3705, -3.9935], zoom: 14, zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(fm);
    L.marker([5.3705, -3.9935], { icon: L.divIcon({ className: 'pin', html: '<svg viewBox="0 0 24 24"><path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>', iconSize: [22, 22], iconAnchor: [11, 22] }) }).addTo(fm);
  }

  /* =========================================================
     ANIMATIONS GSAP
     ========================================================= */
  if (!hasGSAP || reduce) {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
    var cc = document.querySelector('.circle-center'); if (cc) cc.style.opacity = 1;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* -------- Défilement fluide (Lenis) -------- */
  if (typeof window.Lenis !== 'undefined') {
    var lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -10, duration: 1.6 });
      });
    });
  }

  /* -------- Pilule qui s'étire (cercle -> pilule) -------- */
  function pillTimeline(el, delay) {
    var label = el.querySelector('.pill-label');
    var h = el.offsetHeight;
    var full = el.scrollWidth;
    gsap.set(el, { width: h, paddingRight: 0 });
    gsap.set(label, { opacity: 0, x: -8 });
    var tl = gsap.timeline({ delay: delay || 0 });
    tl.to(el, { width: full, duration: 1, ease: 'expo.inOut', clearProps: 'width,paddingRight' })
      .to(label, { opacity: 1, x: 0, duration: .5, ease: 'power2.out' }, '-=.35');
    return tl;
  }

  /* -------- Intro du HERO -------- */
  var heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroTl
    .from('.hero-img', { clipPath: 'inset(8% 8% 8% 8% round 14px)', duration: 1.6, ease: 'expo.inOut' }, 0)
    .from('.hero-img img', { scale: 1.25, duration: 2.2, ease: 'expo.out' }, 0.1)
    .from('.topbar', { y: -20, opacity: 0, duration: 1 }, .3)
    .from('.hero-title .line > span', { yPercent: 110, duration: 1.3, stagger: .12 }, .45)
    .from('[data-hero-fade]', { opacity: 0, y: 14, duration: 1, stagger: .08 }, .7);
  var heroPill = document.querySelector('.hero [data-expand]');
  if (heroPill) heroTl.add(pillTimeline(heroPill), .9);

  /* Parallaxe douce de l'image hero */
  gsap.to('.hero-img img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* -------- Skyline : l'image s'agrandit au scroll -------- */
  var skyTl = gsap.timeline({ scrollTrigger: { trigger: '.sky-sec', start: 'top 65%', end: 'top -45%', scrub: 1 } });
  skyTl.fromTo('.sky-media', { width: isMobile ? '86%' : '64%', height: '62%', borderRadius: 14 },
    { width: '100%', height: '100%', borderRadius: 0, ease: 'power2.inOut' })
    .fromTo('.sky-video', { scale: 1.2 }, { scale: 1, ease: 'none' }, 0);
  gsap.fromTo('.sky-marquee', { xPercent: 20 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: '.sky-sec', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* -------- Titres : révélation -------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* -------- Portefeuille : cartes en cascade -------- */
  ScrollTrigger.batch('.pcard', {
    start: 'top 92%', once: true,
    onEnter: function (b) { gsap.from(b, { y: 70, opacity: 0, scale: .96, duration: 1.1, stagger: .12, ease: 'expo.out' }); }
  });

  /* -------- Chiffres : compteur -------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(o.v); }
    });
  });
  gsap.from('.stat', { y: 30, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
  gsap.from('.avatars img', { x: -16, opacity: 0, duration: .8, stagger: .08, ease: 'back.out(2)', scrollTrigger: { trigger: '.team', start: 'top 90%' } });
  gsap.to('[data-parallax]', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.offer-card', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.about-media', start: 'top 60%' } });
  gsap.from('.about-contact', { scale: .6, opacity: 0, duration: .9, ease: 'back.out(2)', scrollTrigger: { trigger: '.about-media', start: 'top 70%' } });

  /* -------- Solutions : pilules qui se déploient -------- */
  var pills = gsap.utils.toArray('.sol-pill');
  ScrollTrigger.create({
    trigger: '.sol-list', start: 'top 80%', once: true,
    onEnter: function () {
      pills.forEach(function (p, i) {
        var txt = p.querySelectorAll('.sol-txt, :scope > svg');
        gsap.timeline({ delay: i * .15 })
          .fromTo(p, { width: 50 }, { width: '100%', duration: 1.2, ease: 'expo.inOut', clearProps: 'width' })
          .fromTo(txt, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: .6, ease: 'power2.out' }, '-=.45');
        gsap.from(p.querySelector('.sol-img'), { scale: 0, rotate: -90, duration: .8, delay: i * .15, ease: 'back.out(1.8)' });
      });
    }
  });
  gsap.fromTo('.big-track', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.solutions', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* -------- Chemin vers la propriété : cercles qui fusionnent -------- */
  (function () {
    var c1 = '.circle.c1', c2 = '.circle.c2', c3 = '.circle.c3';
    var R = document.querySelector('.circle').offsetWidth;
    var gap = R * 0.82;
    var labels = gsap.utils.toArray('.circle span');
    var btn = document.querySelector('.path-btn');
    var btnLabel = btn.querySelector('.pill-label');
    gsap.set(c1, { x: -gap, y: 0 }); gsap.set(c2, { x: 0, y: 0 }); gsap.set(c3, { x: gap, y: 0 });
    gsap.set(btn, { width: btn.offsetHeight, paddingRight: 0, opacity: 0 });
    gsap.set(btnLabel, { opacity: 0 });
    var full = btn.scrollWidth;

    var tl = gsap.timeline({ scrollTrigger: { trigger: '.path-sec', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tl.from('.circle', { scale: .6, opacity: 0, stagger: .1, duration: .6, ease: 'power2.out' })
      // triangle
      .to(c1, { x: -R * .42, y: R * .22, duration: 1, ease: 'power2.inOut' }, '+=.2')
      .to(c2, { x: 0, y: -R * .32, duration: 1, ease: 'power2.inOut' }, '<')
      .to(c3, { x: R * .42, y: R * .22, duration: 1, ease: 'power2.inOut' }, '<')
      .to(labels, { opacity: 0, duration: .4 }, '<.3')
      // rapprochement
      .to(c1, { x: -R * .2, y: R * .1, duration: 1, ease: 'power2.inOut' })
      .to(c2, { x: 0, y: -R * .16, duration: 1, ease: 'power2.inOut' }, '<')
      .to(c3, { x: R * .2, y: R * .1, duration: 1, ease: 'power2.inOut' }, '<')
      .to('.circle-center', { opacity: 1, duration: .5 }, '<.4')
      // fusion
      .to('.circle', { x: 0, y: 0, duration: 1, ease: 'power3.inOut', stagger: .05 })
      .to(['.c1', '.c3'], { opacity: 0, duration: .3 }, '-=.2')
      .to(c2, { borderColor: 'rgba(255,255,255,.7)', duration: .3 }, '<')
      // bouton
      .to(btn, { opacity: 1, duration: .2 })
      .to(btn, { width: full, duration: 1, ease: 'expo.inOut' })
      .to(btnLabel, { opacity: 1, duration: .4 }, '-=.3')
      .to({}, { duration: .6 });
  })();

  /* -------- Pourquoi la CI -------- */
  var whyPill = document.querySelector('[data-expand-scroll]');
  if (whyPill) {
    var whyTl = pillTimeline(whyPill).pause();
    ScrollTrigger.create({ trigger: whyPill, start: 'top 85%', once: true, onEnter: function () { whyTl.play(); } });
  }
  ScrollTrigger.batch('.why-item', {
    start: 'top 90%', once: true,
    onEnter: function (b) { gsap.from(b, { y: 40, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }); }
  });

  /* -------- Types de biens : colonnes en parallaxe -------- */
  gsap.utils.toArray('.mcol').forEach(function (col) {
    var s = +col.dataset.speed || 0;
    gsap.fromTo(col, { y: s }, { y: -s * 1.6, ease: 'none', scrollTrigger: { trigger: '.masonry', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  ScrollTrigger.batch('.tcard', {
    start: 'top 95%', once: true,
    onEnter: function (b) { gsap.from(b, { opacity: 0, scale: .9, duration: 1, stagger: .06, ease: 'expo.out' }); }
  });
  gsap.from('.types-cta > *', { y: 20, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.types-cta', start: 'top 90%' } });

  /* -------- FAQ -------- */
  gsap.from('.qa', { y: 20, opacity: 0, duration: .8, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.faq-list', start: 'top 85%' } });

  /* -------- CTA : l'image grandit -------- */
  gsap.fromTo('.cta-media', { scale: .86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cta-sec', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.fromTo('.cta-media img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.cta-sec', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.cta-copy > *', { y: 30, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.cta-media', start: 'top 70%' } });
  gsap.to('.cta-deco', { rotate: 360, duration: 14, repeat: -1, ease: 'none' });

  /* -------- Footer -------- */
  gsap.from('.footer .f-top > *, .footer .f-bottom > *', { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

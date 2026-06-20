(function () {
  // bare mode for dashboard thumbnails
  if (new URLSearchParams(location.search).has('bare')) document.documentElement.classList.add('ds-bare');

  // Mobile nav drawer — inject a hamburger toggle + dismiss backdrop (CSS turns the
  // sidebar into an off-canvas drawer under 760px). Skip thumbnails, which hide the nav.
  (function () {
    if (document.documentElement.classList.contains('ds-bare')) return;
    var nav = document.querySelector('.ds-nav');
    if (!nav) return;
    var body = document.body;
    var btn = document.createElement('button');
    btn.className = 'ds-navbtn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg class="ic-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>'
      + '<svg class="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M6 18 18 6"/></svg>';
    var backdrop = document.createElement('div');
    backdrop.className = 'ds-nav-backdrop';
    function setOpen(open) { body.classList.toggle('nav-open', open); btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', function () { setOpen(!body.classList.contains('nav-open')); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    // picking a destination (or the logo) dismisses the drawer
    nav.addEventListener('click', function (e) { if (e.target.closest('.ds-link, .ds-pop-item, .ds-logo')) setOpen(false); });
    body.appendChild(backdrop);
    body.appendChild(btn);
  })();

  // Interactive component playground (live props) — type-dispatched.
  // <div class="pg" data-pg="<type>"> with a [data-pg-el] preview + [data-pg-prop] controls.
  var X_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M6 18L18 6"></path></svg>';
  var ALERT_ICONS = {
    info: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
    success: '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
    warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    danger: '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path>'
  };
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function reflow() { window.dispatchEvent(new Event('resize')); }
  var PG_RENDER = {
    button: function (el, s) {
      var c = ['btn', 'btn-' + s.variant]; if (s.size) c.push(s.size); if (s.loading) c.push('is-loading');
      el.className = c.join(' '); el.disabled = !!s.disabled;
      el.innerHTML = (s.loading ? '<span class="btn-spinner"></span>' : '') + esc(s.label || ' ');
    },
    pill: function (el, s) {
      el.className = 'pill pill-' + s.variant;
      el.innerHTML = (s.dot ? '<span class="dot"></span>' : '') + esc(s.label || ' ') + (s.removable ? '<button class="pill-x" aria-label="Remove">' + X_SVG + '</button>' : '');
    },
    badge: function (el, s) { el.className = 'badge badge-' + s.tier; el.textContent = s.score || ''; },
    avatar: function (el, s) {
      var px = { sm: 28, md: 36, lg: 44 }[s.size] || 28;
      el.className = 'av'; el.style.width = px + 'px'; el.style.height = px + 'px'; el.style.fontSize = Math.round(px * 0.4) + 'px';
      if (s.tone === 'user') { el.style.background = 'var(--av-user-gradient)'; el.style.color = '#fff'; }
      else { el.style.background = 'var(--av-' + s.tone + '-bg)'; el.style.color = 'var(--av-' + s.tone + '-fg)'; }
      el.textContent = (s.initials || '').slice(0, 2).toUpperCase();
    },
    alert: function (el, s) {
      el.className = 'mt-alert is-' + s.variant;
      el.innerHTML = '<svg class="mt-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + (ALERT_ICONS[s.variant] || ALERT_ICONS.info) + '</svg>'
        + '<div class="mt-alert-body"><div class="mt-alert-title">' + esc(s.title || ' ') + '</div>' + (s.desc ? '<div class="mt-alert-desc">' + esc(s.desc) + '</div>' : '') + '</div>'
        + (s.closable ? '<button class="mt-alert-close" aria-label="Dismiss">' + X_SVG + '</button>' : '');
    },
    toggle: function (el, s) {
      var kind = s.kind || 'switch';
      var attrs = (s.checked ? ' checked' : '') + (s.disabled ? ' disabled' : '');
      var lg = s.size === 'is-lg' ? ' is-lg' : '';
      var label = '<span class="' + (kind === 'switch' ? 'mt-switch' : 'mt-' + (kind === 'checkbox' ? 'check' : 'radio')) + '-label">' + esc(s.label || '') + '</span>';
      // Show only the controls that apply to the chosen component.
      var pg = el.closest('.pg');
      if (pg) {
        var v = pg.querySelector('[data-pg-prop="variant"]'), z = pg.querySelector('[data-pg-prop="size"]');
        if (v) v.closest('.pg-ctrl').style.display = kind === 'switch' ? '' : 'none';
        if (z) z.closest('.pg-ctrl').style.display = kind === 'switch' ? 'none' : '';
      }
      if (kind === 'checkbox') {
        el.className = 'mt-check' + lg;
        el.innerHTML = '<input type="checkbox"' + attrs + '><span class="mt-check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11"></path></svg></span>' + label;
      } else if (kind === 'radio') {
        el.className = 'mt-radio' + lg;
        el.innerHTML = '<input type="radio" name="pg-radio"' + attrs + '><span class="mt-radio-dot"></span>' + label;
      } else {
        el.className = 'mt-switch' + (s.variant ? ' ' + s.variant : '');
        el.innerHTML = '<input type="checkbox"' + attrs + '><span class="mt-switch-track"></span>' + label;
      }
    },
    field: function (el, s) {
      el.className = 'mt-input' + (s.size ? ' ' + s.size : '') + (s.invalid ? ' is-error' : '');
      el.type = s.type || 'text'; el.placeholder = s.placeholder || ''; el.disabled = !!s.disabled;
    },
    stat: function (el, s) {
      var trend = s.trend || 'up';
      var ARROWS = { up: '<path d="M7 17 17 7M8 7h9v9"/>', down: '<path d="M7 7l10 10M17 8v9H8"/>', flat: '' };
      var arrow = ARROWS[trend] || '';
      var pill = s.delta
        ? '<span class="delta-pill ' + trend + '">' + (arrow ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + arrow + '</svg>' : '') + esc(s.delta) + '</span>'
        : '';
      var foot = pill ? '<div class="foot">' + pill + '</div>' : '';
      var label = '<div class="label">' + esc(s.label || '') + '</div>';
      var val = '<div class="val">' + esc(s.value || '') + '</div>';
      var style = s.style || 'plain';
      if (style === 'line') {
        el.className = 'stat has-spark';
        el.innerHTML = label + '<div class="stat-row"><div class="stat-main">' + val + foot + '</div>'
          + '<div class="spark-slot"><svg class="spark ' + trend + '" viewBox="0 0 84 52" preserveAspectRatio="none" data-spark data-points="9,11,8,13,12,16,15,19,18,22,26" data-area="1"></svg></div></div>';
      } else if (style === 'bar') {
        el.className = 'stat';
        el.innerHTML = label + val + '<div class="bar-slot"><div class="bar" data-bar data-points="5,7,6,9,8,11,10,13,12,15,14,18"></div></div>' + foot;
      } else {
        el.className = 'stat';
        el.innerHTML = label + val + foot;
      }
      if (window.MantelStatGraphics) window.MantelStatGraphics(el);
    },
    live: function (el, s) {
      el.style.cssText = s.variant === 'plain'
        ? 'display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-700);'
        : 'display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:8px;background:var(--accent-green-bg);color:var(--accent-green);font-size:13px;font-weight:600;';
      el.innerHTML = '<span class="live-dot"></span>' + esc(s.label || '');
    },
    category: function (el, s) { el.className = 'mt-category is-' + s.variant; el.textContent = s.label || ''; },
    segmented: function (el, s) {
      ['is-brand', 'is-outline', 'is-sm', 'is-lg', 'is-stretch'].forEach(function (x) { el.classList.remove(x); });
      if (s.variant && s.variant !== 'default') el.classList.add('is-' + s.variant);
      if (s.size && s.size !== 'default') el.classList.add('is-' + s.size);
      if (s.stretch) el.classList.add('is-stretch');
      reflow();
    },
    tabs: function (el, s) { el.classList.toggle('is-vertical', s.variant === 'vertical'); reflow(); },
    crumbs: function (el, s) {
      // Trail pool mirrors the front-end kit: first crumb + middles + current.
      var SEP = '<li class="mt-crumb-sep" role="presentation" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg></li>';
      var mids = ['Active', 'Northwest Region'];
      var depth = Math.max(2, Math.min(4, parseInt(s.depth, 10) || 3));
      var links = ['Proposals'].concat(mids.slice(0, depth - 2));
      var html = links.map(function (label) {
        return '<li class="mt-crumb-item"><a href="#">' + esc(label) + '</a></li>' + SEP;
      }).join('');
      html += '<li class="mt-crumb-item"><span class="mt-crumb-current" aria-current="page">Robert &amp; Linda Tan</span></li>';
      el.innerHTML = html;
    }
  };
  document.querySelectorAll('[data-pg]').forEach(function (pg) {
    var type = pg.getAttribute('data-pg'); var render = PG_RENDER[type];
    var el = pg.querySelector('[data-pg-el]'); if (!render || !el) return;
    var state = {};
    var ctrls = pg.querySelectorAll('[data-pg-prop]');
    ctrls.forEach(function (ctrl) {
      var prop = ctrl.dataset.pgProp;
      state[prop] = ctrl.classList.contains('pg-switch') ? ctrl.getAttribute('aria-pressed') === 'true' : ctrl.value;
    });
    function run() { render(el, state); }
    ctrls.forEach(function (ctrl) {
      var prop = ctrl.dataset.pgProp;
      if (ctrl.classList.contains('pg-switch')) {
        ctrl.addEventListener('click', function () { state[prop] = !state[prop]; ctrl.setAttribute('aria-pressed', String(state[prop])); run(); });
      } else if (ctrl.tagName === 'SELECT') {
        ctrl.addEventListener('change', function () { state[prop] = ctrl.value; run(); });
      } else {
        ctrl.addEventListener('input', function () { state[prop] = ctrl.value; run(); });
      }
    });
    run();
  });

  // sidebar + dashboard search filter
  var s = document.querySelector('.ds-search');
  if (!s) return;
  function f() {
    var q = s.value.trim().toLowerCase();
    document.querySelectorAll('.ds-link').forEach(function (a) {
      a.classList.toggle('ds-hide', !!q && a.dataset.name.indexOf(q) < 0);
    });
    document.querySelectorAll('.ds-card').forEach(function (c) {
      c.classList.toggle('ds-hide', !!q && (c.dataset.name || '').indexOf(q) < 0);
    });
  }
  s.addEventListener('input', function () { f(); pop(); });

  /* Frequently-used popover — curated shortlist, shown on focus when empty.
     Items cloned from the live nav links so hrefs stay correct on any page. */
  var FREQUENT = ['buttons', 'status pills', 'form inputs', 'modal', 'table', 'avatars'];
  var wrap = document.createElement('div');
  wrap.className = 'ds-search-wrap';
  s.parentNode.insertBefore(wrap, s);
  wrap.appendChild(s);

  var menu = document.createElement('div');
  menu.className = 'ds-search-pop ds-hide';
  menu.innerHTML = '<div class="ds-pop-head">Frequently used</div>';
  FREQUENT.forEach(function (name) {
    var src = document.querySelector('.ds-link[data-name="' + name + '"]');
    if (!src) return;
    var item = document.createElement('a');
    item.className = 'ds-pop-item';
    item.href = src.getAttribute('href');
    item.innerHTML = '<span class="ds-pop-name"></span><span class="ds-pop-arrow">→</span>';
    item.querySelector('.ds-pop-name').textContent = src.textContent;
    menu.appendChild(item);
  });
  wrap.appendChild(menu);

  function pop() {
    menu.classList.toggle('ds-hide', !(document.activeElement === s && !s.value.trim()));
  }
  s.addEventListener('focus', pop);
  // hide on outside click; mousedown on an item still fires its navigation
  document.addEventListener('mousedown', function (e) {
    if (!wrap.contains(e.target)) menu.classList.add('ds-hide');
  });
  s.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { menu.classList.add('ds-hide'); s.blur(); }
  });
})();

  /* Dashboard thumbnails — drop the skeleton shimmer once each lazy iframe loads */
  (function () {
    document.querySelectorAll('.ds-thumb').forEach(function (thumb) {
      var iframe = thumb.querySelector('iframe');
      if (!iframe) return;
      iframe.addEventListener('load', function () { thumb.classList.add('is-loaded'); });
    });
  })();

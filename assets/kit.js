
  (function () {
    var backdrop = document.querySelector('[data-overlay-backdrop]');
    // Pages without overlay demos (e.g. Page header) have no backdrop — skip wiring.
    if (!backdrop) return;
    var openTargets = document.querySelectorAll('[data-open]');
    var current = null;
    var scrollEl = null, scrollHandler = null;

    // Toggle the scroll-edge shadows: header drops a shadow once scrolled away from
    // the top; footer lifts one while there is still body content below it.
    function syncScroll() {
      if (!current || !scrollEl) return;
      var scrollable = scrollEl.scrollHeight - scrollEl.clientHeight > 1;
      current.classList.toggle('is-scrollable', scrollable);
      current.classList.toggle('is-scrolled', scrollEl.scrollTop > 2);
      current.classList.toggle('is-end', scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1);
    }

    function open(id, size) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('is-small','is-wide','is-large','is-full','is-half','is-tall');
      if (size) { size.split(' ').forEach(function (c) { if (c) el.classList.add(c); }); }
      current = el;
      backdrop.classList.add('is-open');
      el.classList.remove('is-closing');
      // force reflow so the transform/opacity transition runs
      void el.offsetWidth;
      el.classList.add('is-open');
      // wire up scroll-edge shadows against the body (the lone scroll region)
      if (scrollEl && scrollHandler) scrollEl.removeEventListener('scroll', scrollHandler);
      el.classList.remove('is-scrollable','is-scrolled','is-end');
      scrollEl = el.querySelector('.mt-overlay-body');
      if (scrollEl) {
        scrollEl.scrollTop = 0;
        scrollHandler = syncScroll;
        scrollEl.addEventListener('scroll', scrollHandler);
        requestAnimationFrame(syncScroll);
      }
    }

    function close() {
      if (!current) return;
      var el = current;
      current = null;
      if (scrollEl && scrollHandler) { scrollEl.removeEventListener('scroll', scrollHandler); }
      scrollEl = null;
      el.classList.remove('is-scrollable','is-scrolled','is-end');
      backdrop.classList.remove('is-open');
      if (el.classList.contains('mt-sheet-bottom') || el.classList.contains('mt-sheet-right')) {
        el.classList.add('is-closing');
      }
      el.classList.remove('is-open');
    }

    openTargets.forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-open'), btn.getAttribute('data-size')); });
    });

    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    window.addEventListener('resize', function () { if (current) syncScroll(); });
  })();

;

  (function () {
    // Set the indeterminate checkbox state
    var indet = document.querySelector('#mt-check-indet input');
    if (indet) indet.indeterminate = true;

    // Toast spawner
    var viewport = document.getElementById('mt-toast-viewport');
    var TONES = {
      success: {
        cls: 'is-success',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Proposal sent',
        desc: 'Robert &amp; Linda will be notified.'
      },
      info: {
        cls: '',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
        title: 'Auto-save on',
        desc: 'Changes save to draft every 4 seconds.'
      },
      text: {
        cls: '',
        bare: true,
        msg: 'Link copied to clipboard'
      },
      warning: {
        cls: 'is-warning',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
        title: 'Credit hold flagged',
        desc: '2 proposals need lender review.'
      },
      danger: {
        cls: 'is-danger',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        title: 'Lender declined',
        desc: 'Re-route by Friday to keep the deal active.'
      },
      inverse: {
        cls: 'is-inverse',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Saved',
        desc: '442 Oak Ridge · just now.'
      },
      'cta-success': {
        cls: 'is-success',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Proposal sent to Robert &amp; Linda',
        desc: 'They\'ll get an email and a tracked secure link.',
        actions: [{ label: 'View seller' }, { label: 'Undo', muted: true }]
      },
      'cta-danger': {
        cls: 'is-danger',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        title: 'Lender declined',
        desc: 'Re-route by Friday to keep the deal active.',
        actions: [{ label: 'Re-route lender' }]
      },
      'cta-undo': {
        cls: 'is-inverse',
        icon: '<svg class="mt-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Saved · 442 Oak Ridge updated',
        desc: 'Last edit 2 seconds ago.',
        actions: [{ label: 'Undo' }]
      }
    };

    function renderActions(actions) {
      if (!actions || !actions.length) return '';
      return '<div class="mt-toast-actions">' + actions.map(function (a) {
        return '<button class="mt-toast-action' + (a.muted ? ' is-muted' : '') + '">' + a.label + '</button>';
      }).join('') + '</div>';
    }

    function spawn(toneKey) {
      var tone = TONES[toneKey] || TONES.info;
      var t = document.createElement('div');
      var closeBtn = '<button class="mt-toast-close" aria-label="Dismiss"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg></button>';
      if (tone.bare) {
        t.className = 'mt-toast is-bare ' + tone.cls;
        t.innerHTML = '<div class="mt-toast-msg">' + tone.msg + '</div>' + closeBtn;
      } else {
        t.className = 'mt-toast ' + tone.cls;
        t.innerHTML =
          tone.icon +
          '<div class="mt-toast-body"><div class="mt-toast-title">' + tone.title + '</div>' +
          '<div class="mt-toast-desc">' + tone.desc + '</div>' +
          renderActions(tone.actions) +
          '</div>' +
          closeBtn;
      }
      viewport.appendChild(t);

      var dismiss = function () {
        if (!t.parentNode) return;
        t.classList.add('is-closing');
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 280);
      };
      t.querySelector('.mt-toast-close').addEventListener('click', dismiss);
      // CTA toasts get a longer dwell so the user has time to act
      setTimeout(dismiss, tone.actions ? 6500 : 4200);
    }

    document.querySelectorAll('[data-toast]').forEach(function (btn) {
      btn.addEventListener('click', function () { spawn(btn.getAttribute('data-toast')); });
    });
  })();

;

  // Tabs — sliding label-width indicator
  (function () {
    document.querySelectorAll('.tabs').forEach(function (strip) {
      // Ensure indicator exists
      var indicator = strip.querySelector('.tab-indicator');
      if (!indicator) {
        indicator = document.createElement('span');
        indicator.className = 'tab-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        strip.appendChild(indicator);
      }

      // Auto-wrap label content for any .tab without a .tab-label
      strip.querySelectorAll('.tab').forEach(function (tab) {
        if (tab.querySelector('.tab-label')) return;
        var label = document.createElement('span');
        label.className = 'tab-label';
        var nodes = Array.prototype.slice.call(tab.childNodes);
        nodes.forEach(function (node) {
          if (node === indicator) return;
          if (node.nodeType === 1 && node.classList && node.classList.contains('cnt')) return;
          label.appendChild(node);
        });
        tab.insertBefore(label, tab.firstChild);
      });

      function measure() {
        var active = strip.querySelector('.tab.active');
        if (!active) {
          indicator.style.width = '0px';
          return;
        }
        var label = active.querySelector('.tab-label') || active;
        var stripRect = strip.getBoundingClientRect();
        var labelRect = label.getBoundingClientRect();
        var x = labelRect.left - stripRect.left + strip.scrollLeft;
        var w = labelRect.width;
        indicator.style.transform = 'translateX(' + x + 'px)';
        indicator.style.width = w + 'px';
        requestAnimationFrame(function () { strip.classList.add('is-ready'); });
      }

      // Wire up tab clicks
      strip.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          strip.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          // Bring the active tab into view if we're scrolled
          var tabRect = tab.getBoundingClientRect();
          var stripRect = strip.getBoundingClientRect();
          if (tabRect.left < stripRect.left) {
            strip.scrollBy({ left: tabRect.left - stripRect.left - 16, behavior: 'smooth' });
          } else if (tabRect.right > stripRect.right) {
            strip.scrollBy({ left: tabRect.right - stripRect.right + 16, behavior: 'smooth' });
          }
          measure();
        });
      });

      strip.addEventListener('scroll', measure, { passive: true });
      window.addEventListener('resize', measure);

      // Initial measurement — wait for fonts to settle
      requestAnimationFrame(measure);
      setTimeout(measure, 200);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure);
      }
    });
  })();

;

  // Animated segmented control — single thumb that measures each option's
  // offsetLeft / offsetWidth and springs between them. Transition is held
  // off until .is-ready so there's no slide-in on first paint.
  (function () {
    function initSegmented(seg) {
      var thumb = seg.querySelector('.mt-segmented-thumb');
      if (!thumb) {
        thumb = document.createElement('span');
        thumb.className = 'mt-segmented-thumb';
        thumb.setAttribute('aria-hidden', 'true');
        seg.insertBefore(thumb, seg.firstChild);
      }
      var options = Array.prototype.slice.call(seg.querySelectorAll('.mt-segmented-option'));
      if (!options.length) return;

      function move(active) {
        if (!active) return;
        thumb.style.transform = 'translateX(' + active.offsetLeft + 'px)';
        thumb.style.width = active.offsetWidth + 'px';
      }
      function activeOption() {
        return seg.querySelector('.mt-segmented-option.is-active') || options[0];
      }

      options.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (opt.disabled || opt.classList.contains('is-active')) return;
          options.forEach(function (o) {
            o.classList.remove('is-active');
            o.setAttribute('aria-selected', 'false');
          });
          opt.classList.add('is-active');
          opt.setAttribute('aria-selected', 'true');
          move(opt);
        });
      });

      // Position the thumb without animating, then enable the spring next frame.
      move(activeOption());
      requestAnimationFrame(function () { seg.classList.add('is-ready'); });
      window.addEventListener('resize', function () { move(activeOption()); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { move(activeOption()); });
      }
    }
    document.querySelectorAll('.mt-segmented').forEach(initSegmented);
  })();

;

  // Filter tabs (.mt-tabs) — sliding full-width underline. Measures each
  // .mt-tab's offsetLeft / offsetWidth to position .mt-tab-underline, and holds
  // the transition until the frame after first measure (.is-ready) so there is
  // no slide-in on load. Keys off [data-mt-tabs].
  (function () {
    function initTabs(root) {
      var buttons = Array.prototype.slice.call(root.querySelectorAll('.mt-tab'));
      var underline = root.querySelector('.mt-tab-underline');
      if (!buttons.length || !underline) return;

      function place(el, ready) {
        if (!el) return;
        underline.style.left = el.offsetLeft + 'px';
        underline.style.width = el.offsetWidth + 'px';
        if (ready && !underline.classList.contains('is-ready')) {
          requestAnimationFrame(function () { underline.classList.add('is-ready'); });
        }
      }
      function activeTab() { return root.querySelector('.mt-tab.is-active') || buttons[0]; }

      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('is-active')) return;
          buttons.forEach(function (o) { o.classList.toggle('is-active', o === b); });
          place(b, true);
        });
      });

      // First paint: measure WITHOUT transition, enable it next frame.
      place(activeTab(), false);
      requestAnimationFrame(function () { place(activeTab(), true); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(activeTab(), true); });
      window.addEventListener('resize', function () { place(activeTab()); });
    }
    document.querySelectorAll('[data-mt-tabs]').forEach(initTabs);
  })();

;

  // Responsive data table — freeze the first column, auto-scroll right on
  // mount/resize so the last columns + row action stay visible, and toggle
  // .is-scrolled (left-edge shadow) while scrolled.
  (function () {
    function sync(el) { el.classList.toggle('is-scrolled', el.scrollLeft > 4); }
    function alignRight(el) {
      if (el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth;
      sync(el);
    }
    document.querySelectorAll('[data-mt-table-responsive]').forEach(function (el) {
      el.addEventListener('scroll', function () { sync(el); }, { passive: true });
      window.addEventListener('resize', function () { alignRight(el); });
      // Three attempts to ensure layout has settled before scrolling right
      alignRight(el);
      requestAnimationFrame(function () { alignRight(el); });
      setTimeout(function () { alignRight(el); }, 120);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { alignRight(el); });
      }
    });
  })();

;

  // Table sort interaction — cycles inactive → asc → desc per column
  (function () {
    var ICONS = {
      unsorted: '<path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>',
      asc:      '<path d="M12 19V5M5 12l7-7 7 7"/>',
      desc:     '<path d="M12 5v14M19 12l-7 7-7-7"/>'
    };
    function makeSvg(key) {
      return '<svg class="mt-sort-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[key] + '</svg>';
    }
    // Column index of a sort button = position of its .mt-th in the head row,
    // so the same .mt-td index lines up in every body row.
    function colIndexOf(table, btn) {
      var th = btn.closest('.mt-th');
      var ths = table.querySelector('.mt-table-head').children;
      return Array.prototype.indexOf.call(ths, th);
    }
    // Pull a comparable value out of a cell. Type is declared on the header via
    // data-sort-type (num / date); anything else sorts as lowercased text.
    function rowSortValue(row, index, type) {
      var cell = row.children[index];
      var text = cell ? (cell.textContent || '').trim() : '';
      if (type === 'num') {
        var n = parseFloat(text.replace(/[^0-9.\-]/g, ''));
        return isNaN(n) ? -Infinity : n;
      }
      if (type === 'date') {
        if (!text || /no expiry|never/i.test(text)) return Infinity; // open-ended sorts last
        var s = /\d{4}/.test(text) ? text : text + ', ' + new Date().getFullYear();
        var d = Date.parse(s);
        return isNaN(d) ? Infinity : d;
      }
      return text.toLowerCase();
    }
    function initSortTable(table) {
      var state = { col: null, dir: 'asc' };
      var body = table.querySelector('.mt-table-body');
      var btns = table.querySelectorAll('.mt-th-sort[data-sort-col]');
      var meta = {};                                                  // sortCol -> { index, type }
      var original = body ? Array.prototype.slice.call(body.children) : [];
      btns.forEach(function (btn) {
        meta[btn.dataset.sortCol] = { index: colIndexOf(table, btn), type: btn.dataset.sortType || 'text' };
        var svg = btn.querySelector('.mt-sort-glyph');
        var key = btn.classList.contains('is-active') ? 'asc' : 'unsorted';
        if (svg) svg.outerHTML = makeSvg(key);
        if (btn.classList.contains('is-active')) state.col = btn.dataset.sortCol;
      });
      function apply() {
        if (!body) return;
        if (state.col === null) {                                     // unsorted — restore source order
          original.forEach(function (r) { body.appendChild(r); });
          return;
        }
        var info = meta[state.col];
        Array.prototype.slice.call(body.children).sort(function (a, b) {
          var av = rowSortValue(a, info.index, info.type);
          var bv = rowSortValue(b, info.index, info.type);
          var cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return state.dir === 'asc' ? cmp : -cmp;
        }).forEach(function (r) { body.appendChild(r); });
      }
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var col = btn.dataset.sortCol;
          if (state.col === col) {
            if (state.dir === 'asc') { state.dir = 'desc'; }
            else { state.col = null; state.dir = 'asc'; }
          } else { state.col = col; state.dir = 'asc'; }
          btns.forEach(function (b) {
            var isActive = state.col !== null && b.dataset.sortCol === state.col;
            b.classList.toggle('is-active', isActive);
            var svg = b.querySelector('.mt-sort-glyph');
            if (svg) svg.outerHTML = makeSvg(isActive ? state.dir : 'unsorted');
          });
          apply();
        });
      });
      apply();                                                        // honour the initial active column
    }
    document.querySelectorAll('[data-sort-table]').forEach(initSortTable);
  })();

  /* Stat card — sparkline + bar renderer (no external deps) */
  (function () {
    var NS = 'http://www.w3.org/2000/svg';
    function spark(svg) {
      var pts = svg.dataset.points.split(',').map(Number);
      var vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
      var flush = svg.dataset.flush === '1';
      var padX = flush ? 0 : 4, padT = 6, padB = flush ? 0 : 8;
      var min = Math.min.apply(null, pts), max = Math.max.apply(null, pts), range = (max - min) || 1;
      var step = (W - padX * 2) / (pts.length - 1);
      var xy = pts.map(function (p, i) { return [padX + i * step, padT + (1 - (p - min) / range) * (H - padT - padB)]; });
      var line = xy.map(function (c, i) { return (i ? 'L' : 'M') + c[0].toFixed(1) + ' ' + c[1].toFixed(1); }).join(' ');
      var uid = 'spk' + Math.round(xy[0][1] * 100 + pts.length) + '-' + Math.round(W);
      if (svg.dataset.area === '1') {
        var grad = document.createElementNS(NS, 'linearGradient');
        grad.setAttribute('id', uid); grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0'); grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
        var s0 = document.createElementNS(NS, 'stop'); s0.setAttribute('offset', '0'); s0.style.stopColor = 'var(--spk)'; s0.style.stopOpacity = '0.22';
        var s1 = document.createElementNS(NS, 'stop'); s1.setAttribute('offset', '1'); s1.style.stopColor = 'var(--spk)'; s1.style.stopOpacity = '0';
        grad.appendChild(s0); grad.appendChild(s1); svg.appendChild(grad);
        var area = document.createElementNS(NS, 'path');
        area.setAttribute('d', line + ' L ' + xy[xy.length - 1][0].toFixed(1) + ' ' + H + ' L ' + xy[0][0].toFixed(1) + ' ' + H + ' Z');
        area.setAttribute('fill', 'url(#' + uid + ')'); svg.appendChild(area);
      }
      var path = document.createElementNS(NS, 'path'); path.setAttribute('class', 'spark-line'); path.setAttribute('d', line); path.setAttribute('pathLength', '1'); svg.appendChild(path);
      var ex = xy[xy.length - 1][0], ey = xy[xy.length - 1][1];
      var halo = document.createElementNS(NS, 'circle'); halo.setAttribute('class', 'spark-halo'); halo.setAttribute('cx', ex); halo.setAttribute('cy', ey); halo.setAttribute('r', 3); halo.setAttribute('opacity', '0.5'); svg.appendChild(halo);
      var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('class', 'spark-dot'); dot.setAttribute('cx', ex); dot.setAttribute('cy', ey); dot.setAttribute('r', 3); svg.appendChild(dot);
    }
    function bar(el) {
      var pts = el.dataset.points.split(',').map(Number), max = Math.max.apply(null, pts);
      pts.forEach(function (p, i) {
        var b = document.createElement('i');
        b.style.height = Math.max(8, (p / max) * 100) + '%';
        b.style.animationDelay = (i * 0.04) + 's';
        if (i === pts.length - 1) b.className = 'hot';
        el.appendChild(b);
      });
    }
    // Expose so the playground can re-render graphics after it rebuilds a card.
    window.MantelStatGraphics = function (root) {
      var r = root || document;
      r.querySelectorAll('[data-spark]').forEach(spark);
      r.querySelectorAll('[data-bar]').forEach(bar);
    };
    window.MantelStatGraphics(document);
  })();

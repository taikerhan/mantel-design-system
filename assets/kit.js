
  (function () {
    var backdrop = document.querySelector('[data-overlay-backdrop]');
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
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Proposal sent',
        desc: 'Robert &amp; Linda will be notified.'
      },
      info: {
        cls: '',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
        title: 'Auto-save on',
        desc: 'Changes save to draft every 4 seconds.'
      },
      warning: {
        cls: 'is-warning',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
        title: 'Credit hold flagged',
        desc: '2 proposals need lender review.'
      },
      danger: {
        cls: 'is-danger',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        title: 'Lender declined',
        desc: 'Re-route by Friday to keep the deal active.'
      },
      inverse: {
        cls: 'is-inverse',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Saved',
        desc: '442 Oak Ridge · just now.'
      },
      'cta-success': {
        cls: 'is-success',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        title: 'Proposal sent to Robert &amp; Linda',
        desc: 'They\'ll get an email and a tracked secure link.',
        actions: [{ label: 'View seller' }, { label: 'Undo', muted: true }]
      },
      'cta-danger': {
        cls: 'is-danger',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        title: 'Lender declined',
        desc: 'Re-route by Friday to keep the deal active.',
        actions: [{ label: 'Re-route lender' }]
      },
      'cta-undo': {
        cls: 'is-inverse',
        icon: '<svg class="mt-toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
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
      t.className = 'mt-toast ' + tone.cls;
      t.innerHTML =
        tone.icon +
        '<div class="mt-toast-body"><div class="mt-toast-title">' + tone.title + '</div>' +
        '<div class="mt-toast-desc">' + tone.desc + '</div>' +
        renderActions(tone.actions) +
        '</div>' +
        '<button class="mt-toast-close" aria-label="Dismiss"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg></button>';
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
    function initSortTable(table) {
      var state = { col: null, dir: 'asc' };
      var btns = table.querySelectorAll('.mt-th-sort[data-sort-col]');
      btns.forEach(function (btn) {
        var svg = btn.querySelector('.mt-sort-glyph');
        var key = btn.classList.contains('is-active') ? 'asc' : 'unsorted';
        if (svg) svg.outerHTML = makeSvg(key);
        if (btn.classList.contains('is-active')) state.col = btn.dataset.sortCol;
      });
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
        });
      });
    }
    document.querySelectorAll('[data-sort-table]').forEach(initSortTable);
  })();

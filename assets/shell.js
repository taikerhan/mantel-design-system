(function () {
  // bare mode for dashboard thumbnails
  if (new URLSearchParams(location.search).has('bare')) document.documentElement.classList.add('ds-bare');
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
  var FREQUENT = ['buttons', 'status pills', 'form inputs', 'modal', 'table row', 'avatars'];
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

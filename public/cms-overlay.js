/* cms-overlay.js — loaded on site pages ONLY when opened with ?cms=1 (inside the
 * admin "Conținut site" editor). Maps rendered text/images to content paths so
 * the editor can: click element → select field, focus field → scroll/flash,
 * edit field → live-update the preview. Communicates with the parent via
 * postMessage ({source:'cms'} from here, {target:'cms'} from the editor). */
(function () {
  if (window.top === window.self) return; // only inside the editor iframe
  var map = {};
  var norm = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
  function stripTags(s) { var d = document.createElement('div'); d.innerHTML = s; return d.textContent || ''; }

  function indexContent(obj, path, out) {
    for (var k in obj) {
      var v = obj[k];
      var p = path ? path + '.' + k : k;
      if (v && typeof v === 'object') indexContent(v, p, out);
      else if (typeof v === 'string' && v.trim()) out.push({ path: p, value: v });
    }
  }

  function buildMap(content) {
    map = {};
    var leaves = [];
    indexContent(content, '', leaves);

    var textIndex = {};
    var els = document.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,li,button,figcaption,strong,em,small,label,td,th,blockquote');
    els.forEach(function (el) {
      var t = norm(el.textContent);
      if (!t || t.length > 400) return;
      var prev = textIndex[t];
      if (!prev || el.querySelectorAll('*').length < prev.querySelectorAll('*').length) textIndex[t] = el;
    });

    var imgs = Array.prototype.slice.call(document.images);
    leaves.forEach(function (leaf) {
      var isImg = /\.(webp|jpe?g|png|svg|avif|gif)(\?|$)/i.test(leaf.value);
      if (isImg) {
        var base = decodeURIComponent(leaf.value).split('/').pop().split('?')[0];
        var img = imgs.find(function (im) { return decodeURIComponent(im.getAttribute('src') || '').split('/').pop() === base; });
        if (img) map[leaf.path] = img;
      } else {
        var key = norm(stripTags(leaf.value));
        if (key && textIndex[key]) map[leaf.path] = textIndex[key];
      }
    });

    Object.keys(map).forEach(function (path) { map[path].setAttribute('data-cms', path); });
  }

  function send(type, payload) {
    var msg = { source: 'cms', type: type };
    if (payload) for (var k in payload) msg[k] = payload[k];
    parent.postMessage(msg, '*');
  }
  function flash(el) {
    el.classList.add('cms-active');
    setTimeout(function () { el.classList.remove('cms-active'); }, 1500);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cms]');
    if (el) { e.preventDefault(); e.stopPropagation(); send('select', { path: el.getAttribute('data-cms') }); flash(el); }
  }, true);
  document.addEventListener('mouseover', function (e) { var el = e.target.closest('[data-cms]'); if (el) el.classList.add('cms-hl'); });
  document.addEventListener('mouseout', function (e) { var el = e.target.closest('[data-cms]'); if (el) el.classList.remove('cms-hl'); });

  window.addEventListener('message', function (e) {
    var m = e.data || {};
    if (m.target !== 'cms') return;
    if (m.type === 'data') { buildMap(m.content); send('mapped', { count: Object.keys(map).length }); }
    else if (m.type === 'focus') { var el = map[m.path]; if (el) flash(el); }
    else if (m.type === 'update') {
      var t = map[m.path]; if (!t) return;
      if (t.tagName === 'IMG') t.src = m.value;
      else if (/[<>]/.test(m.value)) t.innerHTML = m.value;
      else t.textContent = m.value;
    }
  });

  var style = document.createElement('style');
  style.textContent =
    '[data-cms]{cursor:pointer;transition:outline .1s;}' +
    '.cms-hl{outline:2px solid #c9a96a !important;outline-offset:2px;background:rgba(201,169,106,.12) !important;}' +
    '.cms-active{outline:3px solid #b8975a !important;outline-offset:2px;box-shadow:0 0 0 6px rgba(184,151,90,.25) !important;}';
  document.head.appendChild(style);

  send('ready', {});
  window.addEventListener('load', function () { send('ready', {}); });
})();

/* cms-overlay.js — loaded on site pages ONLY when opened with ?cms=1 (inside the
 * admin "Conținut site" editor). Maps rendered text/images to content paths so
 * the editor can: click element → select field, focus field → scroll/flash,
 * edit field → live-update the preview. Communicates with the parent via
 * postMessage ({source:'cms'} from here, {target:'cms'} from the editor).
 *
 * Clicks are resolved LIVE and fuzzily (not via a pre-built exact-text map) so
 * that every text/image is clickable — including repeated text and array items. */
(function () {
  if (window.top === window.self) return; // only inside the editor iframe

  var leaves = [];   // [{ path, value, norm, isImg, base }]
  var map = {};      // path -> element (for focus highlight + live update)

  var norm = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
  var lc = function (s) { return norm(s).toLowerCase(); };
  function stripTags(s) { var d = document.createElement('div'); d.innerHTML = s; return d.textContent || ''; }
  function fileOf(s) { try { return decodeURIComponent(s || '').split('/').pop().split('?')[0].toLowerCase(); } catch (e) { return ''; } }
  var isImgVal = function (v) { return /\.(webp|jpe?g|png|svg|avif|gif)(\?|$)/i.test(v) || /^data:image/.test(v); };

  function indexContent(obj, path) {
    for (var k in obj) {
      var v = obj[k];
      var p = path ? path + '.' + k : k;
      if (v && typeof v === 'object') indexContent(v, p);
      else if (typeof v === 'string' && v.trim()) {
        var img = isImgVal(v);
        leaves.push({ path: p, value: v, norm: img ? '' : lc(stripTags(v)), isImg: img, base: img ? fileOf(v) : '' });
      }
    }
  }

  // Pre-map leaves to elements (used for hover + live updates). Best match = the
  // smallest element whose full text equals the value.
  function buildMap(content) {
    leaves = []; map = {};
    indexContent(content, '');

    var els = document.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,li,button,figcaption,strong,em,small,label,td,th,blockquote,div');
    var byText = {};
    els.forEach(function (el) {
      var t = lc(el.textContent);
      if (!t || t.length > 400) return;
      if (!byText[t] || el.querySelectorAll('*').length < byText[t].querySelectorAll('*').length) byText[t] = el;
    });
    var imgs = Array.prototype.slice.call(document.images);
    leaves.forEach(function (leaf) {
      if (leaf.isImg) { var im = imgs.find(function (x) { return fileOf(x.getAttribute('src')) === leaf.base; }); if (im) map[leaf.path] = im; }
      else if (leaf.norm && byText[leaf.norm]) map[leaf.path] = byText[leaf.norm];
    });
    Object.keys(map).forEach(function (p) { map[p].setAttribute('data-cms', p); });
  }

  // Resolve a clicked element to the most specific content path. Returns {path, el}.
  // `deep` enables the background-image scan (costly getComputedStyle) — used on
  // click, skipped on hover to keep mouse-move cheap.
  function resolve(target, deep) {
    if (!target || !target.closest) return null;

    // 1) already-mapped ancestor — most reliable
    var mapped = target.closest('[data-cms]');
    if (mapped) return { path: mapped.getAttribute('data-cms'), el: mapped };

    // 2) image (real <img> or a background-image element)
    var img = target.tagName === 'IMG' ? target : target.closest('img');
    if (img) {
      var base = fileOf(img.getAttribute('src'));
      for (var i = 0; i < leaves.length; i++) if (leaves[i].isImg && leaves[i].base === base) return { path: leaves[i].path, el: img };
    }
    if (deep) {
      var bgEl = target;
      for (var d0 = 0; bgEl && bgEl !== document.body && d0 < 4; d0++, bgEl = bgEl.parentElement) {
        var bg = getComputedStyle(bgEl).backgroundImage || '';
        var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (m) { var bf = fileOf(m[1]); for (var bi = 0; bi < leaves.length; bi++) if (leaves[bi].isImg && leaves[bi].base === bf) return { path: leaves[bi].path, el: bgEl }; }
      }
    }

    // 3) text — climb a few ancestors; first exact match wins, else best containment
    var el = target;
    for (var depth = 0; el && el !== document.body && depth < 6; depth++, el = el.parentElement) {
      var t = lc(el.textContent);
      if (!t || t.length > 400) continue;
      var best = null;
      for (var j = 0; j < leaves.length; j++) {
        var l = leaves[j];
        if (l.isImg || !l.norm) continue;
        if (l.norm === t) return { path: l.path, el: el };                 // exact
        if (l.norm.length < 5) continue;
        if (t.indexOf(l.norm) !== -1) { if (!best || l.norm.length > best.norm.length) best = l; }   // element wraps the value
        else if (t.length >= 5 && l.norm.indexOf(t) !== -1) { if (!best) best = l; }                 // element is part of the value
      }
      if (best) return { path: best.path, el: el };
    }
    return null;
  }

  // Find the element for a content path on demand (focus/update from the form),
  // so it works even if buildMap didn't pre-map it. Caches into `map`.
  function locate(path) {
    if (map[path] && document.contains(map[path])) return map[path];
    var leaf = null;
    for (var i = 0; i < leaves.length; i++) if (leaves[i].path === path) { leaf = leaves[i]; break; }
    if (!leaf) return null;
    var el = null;
    if (leaf.isImg) {
      var imgs = document.images;
      for (var a = 0; a < imgs.length; a++) if (fileOf(imgs[a].getAttribute('src')) === leaf.base) { el = imgs[a]; break; }
      if (!el) {
        var all = document.body.querySelectorAll('*');
        for (var b = 0; b < all.length; b++) { var bg = getComputedStyle(all[b]).backgroundImage || ''; var mm = bg.match(/url\(["']?([^"')]+)["']?\)/); if (mm && fileOf(mm[1]) === leaf.base) { el = all[b]; break; } }
      }
    } else if (leaf.norm) {
      var els = document.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,li,button,figcaption,strong,em,small,label,td,th,blockquote,div');
      var best = null;
      for (var c = 0; c < els.length; c++) { var t = lc(els[c].textContent); if (!t || t.length > 400) continue; if (t === leaf.norm || (leaf.norm.length >= 5 && t.indexOf(leaf.norm) !== -1)) { if (!best || els[c].querySelectorAll('*').length < best.querySelectorAll('*').length) best = els[c]; } }
      el = best;
    }
    if (el) map[path] = el;
    return el;
  }

  function send(type, payload) {
    var msg = { source: 'cms', type: type };
    if (payload) for (var k in payload) msg[k] = payload[k];
    parent.postMessage(msg, '*');
  }
  function flash(el) {
    if (!el) return;
    el.classList.add('cms-active');
    setTimeout(function () { el.classList.remove('cms-active'); }, 1400);
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var hit = resolve(e.target, true);
    if (!hit) return;
    e.preventDefault(); e.stopPropagation();
    // remember the element so live edits + focus highlight work for it too
    if (!map[hit.path] && hit.el) { map[hit.path] = hit.el; hit.el.setAttribute('data-cms', hit.path); }
    send('select', { path: hit.path });
    flash(map[hit.path] || hit.el);
  }, true);

  document.addEventListener('mouseover', function (e) {
    var hit = resolve(e.target, false);
    if (hit && hit.el) hit.el.classList.add('cms-hl');
  });
  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest && e.target.closest('.cms-hl');
    if (el) el.classList.remove('cms-hl');
  });

  window.addEventListener('message', function (e) {
    var m = e.data || {};
    if (m.target !== 'cms') return;
    if (m.type === 'data') { buildMap(m.content); send('mapped', { count: Object.keys(map).length }); }
    else if (m.type === 'focus') { flash(locate(m.path)); }
    else if (m.type === 'update') {
      var t = locate(m.path); if (!t) return;
      if (t.tagName === 'IMG') t.src = m.value;
      else if (/[<>]/.test(m.value)) t.innerHTML = m.value;
      else t.textContent = m.value;
    }
  });

  var style = document.createElement('style');
  style.textContent =
    '.cms-hl{outline:2px solid #c9a96a !important;outline-offset:2px;cursor:pointer;background:rgba(201,169,106,.12) !important;}' +
    '.cms-active{outline:3px solid #b8975a !important;outline-offset:2px;box-shadow:0 0 0 6px rgba(184,151,90,.25) !important;}';
  document.head.appendChild(style);

  send('ready', {});
  window.addEventListener('load', function () { send('ready', {}); });
})();

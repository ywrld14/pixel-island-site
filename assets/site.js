/* Pixel Island site: EN/FR switch. Elements carry data-fr (innerHTML),
   data-fr-alt, data-fr-aria, data-fr-src, data-fr-href; <html data-fr-title/desc>. */
(function () {
  var KEY = "pi-lang", root = document.documentElement;
  var btn = document.getElementById("lang");
  var meta = document.querySelector('meta[name="description"]');
  var orig = new WeakMap();

  function swap(el, attr, fr, on) {
    var cur = el.getAttribute(attr);
    if (on) { if (!orig.has(el)) orig.set(el, {}); var o = orig.get(el); if (!(attr in o)) o[attr] = cur; el.setAttribute(attr, fr); }
    else if (orig.has(el) && attr in orig.get(el)) el.setAttribute(attr, orig.get(el)[attr]);
  }
  function apply(lang) {
    var fr = lang === "fr";
    root.lang = fr ? "fr" : "en";
    document.querySelectorAll("[data-fr]").forEach(function (el) {
      if (!orig.has(el)) orig.set(el, { html: el.innerHTML });
      var o = orig.get(el);
      if (!("html" in o)) o.html = el.innerHTML;
      el.innerHTML = fr ? el.getAttribute("data-fr") : o.html;
    });
    [["alt", "data-fr-alt"], ["aria-label", "data-fr-aria"], ["src", "data-fr-src"], ["href", "data-fr-href"]].forEach(function (p) {
      document.querySelectorAll("[" + p[1] + "]").forEach(function (el) { swap(el, p[0], el.getAttribute(p[1]), fr); });
    });
    var t = root.getAttribute("data-fr-title");
    if (t) { if (!root._t) root._t = document.title; document.title = fr ? t : root._t; }
    var d = root.getAttribute("data-fr-desc");
    if (d && meta) { if (!root._d) root._d = meta.content; meta.content = fr ? d : root._d; }
    if (btn) { btn.textContent = fr ? "EN" : "FR"; btn.setAttribute("aria-label", fr ? "Switch to English" : "Passer en français"); }
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var start = saved || ((navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
  if (start === "fr") apply("fr");
  if (btn) btn.addEventListener("click", function () { apply(root.lang === "fr" ? "en" : "fr"); });
})();

/* Builds the navy-design CV as a PDF in the visitor's browser, from window.CV_DATA (cv-data.js).
   Any link ending in Brian_Machoka_CV.pdf, or any element with data-cv-download, triggers it.
   If anything fails, the visitor gets the static Brian_Machoka_CV.pdf instead. */
(function () {
  'use strict';
  var JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  var NAVY = [31, 56, 100], BLUE = [46, 117, 182], PALE = [234, 241, 251], INK = [26, 26, 26],
      GREY = [102, 102, 102], WHITE = [255, 255, 255], LINEC = [201, 214, 234];

  function loadLib() {
    return new Promise(function (resolve, reject) {
      if (window.jspdf && window.jspdf.jsPDF) return resolve();
      var s = document.createElement('script');
      s.src = JSPDF_URL;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('jsPDF failed to load')); };
      document.head.appendChild(s);
    });
  }

  function build(D, opts) {
    var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var LEAD = opts.compact ? 10.4 : 11.2, M = 40, CW = W - 2 * M, TOP = opts.compact ? 26 : 30, BOT = TOP, y = TOP;
    doc.setProperties({ title: D.name + ' - CV', author: D.name, subject: 'Curriculum Vitae' });

    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function ink(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function font(style, size) { doc.setFont('helvetica', style); doc.setFontSize(size); }
    function lines(t, w, style, size) { font(style, size); return doc.splitTextToSize(t, w); }
    function ensure(h) { if (y + h > H - BOT) { doc.addPage(); y = TOP; } }

    function para(t, x, w, size, lead, style, color) {
      lines(t, w, style, size).forEach(function (l) {
        ensure(lead); font(style, size); ink(color);
        doc.text(l, x, y + size * 0.95); y += lead;
      });
    }
    function bullet(t) {
      ensure(LEAD); fill(BLUE); doc.circle(M + 4, y + 5, 1.4, 'F');
      para(t, M + 12, CW - 12, 8.5, LEAD, 'normal', INK); y += 1.1;
    }
    function head(label) {
      ensure(40); font('bold', 9.6); ink(NAVY);
      doc.text(label.toUpperCase(), M, y + 10, { charSpace: 2.2 });
      stroke(BLUE); doc.setLineWidth(1.2); doc.line(M, y + 16, M + CW, y + 16); y += 24;
    }
    function entry(title, sub, dates, items) {
      ensure(44); font('bold', 10.3); ink(INK); doc.text(title, M, y + 10);
      font('italic', 8.3); ink(GREY); doc.text(dates, M + CW, y + 10, { align: 'right' }); y += 13;
      if (sub) { font('bold', 8.8); ink(BLUE); doc.text(sub, M, y + 9); y += 12; }
      y += 3; items.forEach(bullet);
    }

    /* ---- banner ---- */
    var bh = 104;
    fill(NAVY); doc.rect(M, y, CW, bh, 'F');
    var nm = D.name.toUpperCase(), cs = 1.6;
    font('bold', 22); ink(WHITE);
    doc.text(nm, (W - (doc.getTextWidth(nm) + cs * (nm.length - 1))) / 2, y + 34, { charSpace: cs });
    font('normal', 10.3); ink([230, 238, 251]); doc.text(D.title, W / 2, y + 54, { align: 'center' });
    var segs = [{ t: D.location }, { t: D.phone }, { t: D.email, u: 'mailto:' + D.email }, { t: 'GitHub', u: D.github },
                { t: D.portfolioLabel || 'Portfolio', u: D.portfolio }, { t: D.websiteLabel, u: D.website }];
    font('normal', 8.2);
    var sep = '  ·  ', sepW = doc.getTextWidth(sep), total = sepW * (segs.length - 1);
    segs.forEach(function (s) { s.w = doc.getTextWidth(s.t); total += s.w; });
    var x = (W - total) / 2, by = y + 73;
    segs.forEach(function (s, i) {
      if (s.u) { ink([188, 215, 255]); doc.textWithLink(s.t, x, by, { url: s.u }); } else { ink(WHITE); doc.text(s.t, x, by); }
      x += s.w;
      if (i < segs.length - 1) { ink([160, 185, 225]); doc.text(sep, x, by); x += sepW; }
    });
    font('italic', 8.2); ink([214, 228, 250]); doc.text(D.avail, W / 2, y + 91, { align: 'center' });
    y += bh + 8;

    /* ---- stats ---- */
    var sh = 44, sw = CW / 3;
    fill(BLUE); doc.rect(M, y, CW, sh, 'F');
    stroke(NAVY); doc.setLineWidth(1); doc.line(M + sw, y, M + sw, y + sh); doc.line(M + 2 * sw, y, M + 2 * sw, y + sh);
    D.stats.forEach(function (s, i) {
      var cx = M + sw * i + sw / 2;
      font('bold', 14.5); ink(WHITE); doc.text(s[0], cx, y + 20, { align: 'center' });
      font('normal', 7.8); ink([219, 232, 250]); doc.text(s[1], cx, y + 33, { align: 'center' });
    });
    y += sh + 8;

    /* ---- summary + competencies ---- */
    head('Professional Summary'); para(D.summary, M, CW, 8.7, 12.4, 'normal', INK); y += 6;
    head('Core Competencies');
    var rows = Math.ceil(D.competencies.length / 3), cw3 = CW / 3;
    ensure(rows * 22 + 8);
    D.competencies.forEach(function (c, i) {
      var cx = M + (i % 3) * cw3, cy = y + Math.floor(i / 3) * 22;
      fill(PALE); stroke(BLUE); doc.setLineWidth(0.7); doc.rect(cx, cy, cw3, 22, 'FD');
      font('normal', 8.5); ink(NAVY); doc.text(c, cx + cw3 / 2, cy + 14, { align: 'center' });
    });
    y += rows * 22 + 8;

    /* ---- experience ---- */
    head('Professional Experience');
    D.experience.forEach(function (e) { entry(e.title, e.org, e.dates, e.bullets); }); y += 6;

    /* ---- projects ---- */
    head('Projects & Portfolio');
    D.projects.forEach(function (p) {
      var h = 18 + 9 + 7;
      p.bullets.forEach(function (b) { h += lines(b, CW - 12, 'normal', 8.5).length * LEAD + 1.1; });
      ensure(h);
      font('bold', 9.8); ink(NAVY); doc.text(p.title, M, y + 10);
      var lx = M + doc.getTextWidth(p.title) + 8;
      p.links.forEach(function (l) {
        font('normal', 8); ink(BLUE); doc.textWithLink(l.label, lx, y + 10, { url: l.url }); lx += doc.getTextWidth(l.label) + 8;
      });
      y += 18; p.bullets.forEach(bullet);
      font('italic', 8.2); ink(GREY); doc.text('Tech stack: ' + p.stack, M + 12, y + 8); y += 16;
    });
    y += 2;

    /* ---- skills table ---- */
    head('Technical Skills');
    var lw = 105, vw = CW - lw - 14;
    D.skills.forEach(function (s) {
      var ls = lines(s[1], vw, 'normal', 8.5), rh = Math.max(ls.length, 1) * 11.5 + 6.4;
      ensure(rh);
      fill(PALE); doc.rect(M, y, lw, rh, 'F');
      stroke(NAVY); doc.setLineWidth(0.8); doc.line(M + lw, y, M + lw, y + rh);
      stroke(LINEC); doc.setLineWidth(0.5); doc.line(M, y + rh, M + CW, y + rh);
      font('bold', 8.6); ink(NAVY); doc.text(s[0], M + 7, y + 11);
      font('normal', 8.5); ink(INK);
      ls.forEach(function (l, i) { doc.text(l, M + lw + 7, y + 11 + i * 11.5); });
      y += rh;
    });
    y += 8;

    /* ---- education, certifications, languages ---- */
    head('Education');
    entry(D.education.title, D.education.school, D.education.dates, D.education.bullets); y += 6;
    head('Certifications & Professional Development'); D.certs.forEach(bullet); y += 6;
    head('Languages'); para(D.languages, M, CW, 8.8, 12, 'normal', INK); y += 6;

    /* ---- references ---- */
    if (opts.references !== false && D.references && D.references.length) {
      ensure(115); head('References');
      var rw = CW / 2 - 3, rh2 = 64;
      fill(PALE); doc.rect(M, y, CW, rh2, 'F');
      stroke(NAVY); doc.setLineWidth(1); doc.line(M + CW / 2, y, M + CW / 2, y + rh2);
      D.references.slice(0, 2).forEach(function (r, i) {
        var rx = M + i * (CW / 2) + 9;
        font('bold', 9.6); ink(NAVY); doc.text(r.name, rx, y + 14);
        font('italic', 8); ink(GREY); doc.text(r.role, rx, y + 26);
        font('normal', 8.8); ink(BLUE); doc.text(r.org, rx, y + 38);
        font('normal', 8); ink(GREY); doc.text(r.phone, rx, y + 49);
        ink(BLUE); doc.textWithLink(r.email, rx, y + 59, { url: 'mailto:' + r.email });
      });
      y += rh2 + 5;
      font('italic', 7.8); ink(GREY);
      doc.text('Full references and supporting documents available on request.', W / 2, y + 8, { align: 'center' });
    }

    /* ---- page numbers ---- */
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); font('normal', 7.5); ink(GREY);
      doc.text('Page ' + i + ' of ' + n, W - M, H - 18, { align: 'right' });
    }
    return doc;
  }

  function generate(opts) {
    opts = opts || {};
    return loadLib().then(function () {
      if (!window.CV_DATA) throw new Error('cv-data.js not loaded');
      var doc = build(window.CV_DATA, opts);
      // If the content spills onto a third page, rebuild a little tighter so it stays at two pages
      if (doc.getNumberOfPages() > 2 && !opts.compact) doc = build(window.CV_DATA, { references: opts.references, compact: true });
      doc.save(opts.fileName || 'Brian_Machoka_CV.pdf');
    });
  }
  window.CV = { generate: generate };

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a[href$="Brian_Machoka_CV.pdf"],[data-cv-download]');
    if (!el) return;
    e.preventDefault();
    if (el.getAttribute('data-busy')) return;
    el.setAttribute('data-busy', '1');
    var old = el.innerHTML;
    el.innerHTML = 'Preparing your CV…';
    generate().catch(function (err) {
      console.error(err);
      var href = el.getAttribute('href');
      if (href) window.location.href = href;
    }).then(function () {
      el.innerHTML = old; el.removeAttribute('data-busy');
    });
  });
})();

// Interactief prototype: tijdslijn en detailscherm van het pathologieverslag.
// Schermopbouw en inline stijlen komen uit Bijlage C mockups (ontwerp/); nieuwe onderdelen staan in assets/app.css.
(function () {
  var DATA = window.PGO_DATA;
  var DOCS = DATA.documenten;
  var OPSLAG = 'pgo-prototype-v1';

  // ---- Toestand (bewaard zolang het tabblad open is) ---------------------------
  var state = laad() || { verbeteringen: {}, weergave: 'verbeterd' };
  var selectie = [];
  var status = ''; // resultaat van de laatste handeling; hoort niet bij de bewaarde toestand

  function laad() {
    try { return JSON.parse(sessionStorage.getItem(OPSLAG)); } catch (e) { return null; }
  }
  function bewaar() {
    try { sessionStorage.setItem(OPSLAG, JSON.stringify(state)); } catch (e) { /* zonder opslag werkt alles binnen de pagina */ }
  }

  // ---- Hulpfuncties ----------------------------------------------------------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function svg(paths, style) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="' + style + '" aria-hidden="true">' + paths + '</svg>';
  }
  var ICON_PIJL_OMLAAG = svg('<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>', 'width: 14px; height: 14px;');
  var ICON_CHEVRON = svg('<path d="m9 18 6-6-6-6"></path>', 'width: 14px; height: 14px;');
  function sjabloon(id) { return document.getElementById(id).innerHTML; }
  function meervoud(n, een, meer) { return n + ' ' + (n === 1 ? een : meer); }

  function doc(id) { return DOCS.find(function (d) { return d.id === id; }); }
  function verbetering(id) { return state.verbeteringen[id] || {}; }
  function groepSamengevoegd(groep) {
    return DOCS.some(function (d) { return d.groep === groep && verbetering(d.id).samengevoegd; });
  }
  function groepLeden(groep) { return DOCS.filter(function (d) { return d.groep === groep; }); }
  // Een geselecteerd document staat voor alle versies in zijn groep.
  function metGroepsleden(ids) {
    var uit = [];
    ids.forEach(function (id) {
      var d = doc(id);
      (d.groep ? groepLeden(d.groep) : [d]).forEach(function (l) { if (uit.indexOf(l.id) === -1) uit.push(l.id); });
    });
    return uit;
  }

  // Regels zoals Sanne ze ziet: samengevoegde dubbele documenten tellen als één regel.
  function zichtbareDocs() {
    return DOCS.filter(function (d) {
      if (!d.groep || !groepSamengevoegd(d.groep)) return true;
      return groepLeden(d.groep)[0].id === d.id;
    });
  }
  // De metadata die Sanne ziet. Met toonVerbeterd = false altijd zoals de bron het levert.
  function weergaveVan(d, toonVerbeterd) {
    var b = d.bron;
    var verbeterd = toonVerbeterd !== false && verbetering(d.id).titels;
    return {
      titel: verbeterd ? d.verbeterd.titel : b.titel,
      soort: verbeterd ? d.verbeterd.soort : b.soort,
      groep: verbeterd ? d.verbeterd.groep : b.groep,
      datum: b.datum, organisatie: b.organisatie, verlener: b.verlener,
    };
  }

  // ---- Tijdslijn -------------------------------------------------------------
  var KOLOMMEN = 'grid-template-columns: 20px 276px 276px 104px 192px 120px; column-gap: 16px; align-items: center; padding: 0 12px 0 16px;';
  var KOP_CEL = 'font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-body);';
  var CEL = 'white-space: nowrap; font-size: var(--text-base); color: var(--text-body);';

  function renderTijdslijn() {
    var docs = zichtbareDocs();
    selectie = selectie.filter(function (id) { return docs.some(function (d) { return d.id === id; }); });
    var heeftVerbeteringen = Object.keys(state.verbeteringen).length > 0;

    var rijen = docs.map(function (d) {
      var w = weergaveVan(d);
      var v = verbetering(d.id);
      var titel = d.detail
        ? '<a href="#/pathologieverslag" style="white-space: nowrap; font-size: var(--text-base); color: var(--text-link);">' + esc(w.titel) + '</a>'
        : '<span style="white-space: nowrap; font-size: var(--text-base); color: var(--text-link);">' + esc(w.titel) + '</span>';
      var notities = [];
      if (d.groep && groepSamengevoegd(d.groep)) notities.push(notitieKnop(d, 'versies', meervoud(groepLeden(d.groep).length, 'versie', 'versies')));
      if (v.titels || v.uitleg) notities.push(notitieKnop(d, 'verbeterd', 'verbeterde versie'));
      var gekozen = selectie.indexOf(d.id) !== -1;
      return '<div class="app-row' + (gekozen ? ' is-selected' : '') + '" style="display: grid; ' + KOLOMMEN + ' height: 52px; border-bottom: 1px solid var(--gray-10);">'
        + '<span><input type="checkbox" class="app-check" data-id="' + d.id + '"' + (gekozen ? ' checked' : '') + ' aria-label="Selecteer ' + esc(w.titel) + ', ' + esc(w.datum) + '"></span>'
        + '<span style="min-width: 0; line-height: 1.25;">' + titel
        + (notities.length ? '<span class="app-notes">' + notities.join('<span aria-hidden="true">·</span>') + '</span>' : '')
        + '</span>'
        + '<span style="' + CEL + '">' + esc(w.soort) + '</span>'
        + '<span style="font-size: var(--text-base); color: var(--text-body);">' + esc(w.datum) + '</span>'
        + '<span style="' + CEL + '">' + esc(w.organisatie) + '</span>'
        + '<span style="' + CEL + '">' + esc(w.verlener) + '</span>'
        + '</div>';
    }).join('');

    var alles = selectie.length === docs.length;
    var kopVink = '<span><input type="checkbox" class="app-check" data-id="*"' + (alles ? ' checked' : '') + ' aria-label="Selecteer alle documenten"></span>';
    var kop = selectie.length
      ? kopVink + '<span class="app-selectbar"><span class="app-selectbar-count">' + meervoud(selectie.length, 'document', 'documenten') + ' geselecteerd</span>'
        + '<button type="button" class="ds-btn ds-btn-ghost ds-btn-sm" data-actie="wis">Selectie wissen</button>'
        + '<button type="button" class="ds-btn ds-btn-secondary ds-btn-sm" data-actie="verbeter">Verbeteren</button></span>'
      : kopVink
        + '<span style="display: flex; align-items: center; gap: 6px; ' + KOP_CEL + '">Document</span>'
        + '<span style="' + KOP_CEL + '">Documentsoort</span>'
        + '<span style="display: flex; align-items: center; gap: 5px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong);">Gemaakt op' + ICON_PIJL_OMLAAG + '</span>'
        + '<span style="' + KOP_CEL + '">Zorgorganisatie</span>'
        + '<span style="' + KOP_CEL + '">Gemaakt door</span>';

    var onder = '';
    if (status) onder += '<span class="app-status">' + esc(status) + '</span> ';
    onder += heeftVerbeteringen
      ? 'Bij een verbeterde versie zie je de titel zoals de bron die levert door de aanduiding aan te wijzen. Het document zelf verandert niet.'
      : 'Selecteer documenten om ze te laten verbeteren.';

    return {
      hoogte: 1043,
      main: '<main style="flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 32px 32px 0; box-sizing: border-box;">'
        + sjabloon('tpl-lijst-kop') + sjabloon('tpl-lijst-filters')
        + '<div style="flex: 1; min-height: 0; border: 1px solid var(--gray-10); border-bottom: none; border-radius: var(--radius-md) var(--radius-md) 0 0; background: var(--white); display: flex; flex-direction: column; overflow: hidden; position: relative;">'
        + '<div style="display: grid; ' + KOLOMMEN + ' height: 44px; flex: none; border-bottom: 1px solid var(--border-subtle); background: var(--white);">' + kop + '</div>'
        + '<div class="app-scroll" style="flex: 1; min-height: 0;">' + rijen + '</div>'
        + '</div>'
        + '<div style="padding: 14px 20px 20px; font-size: var(--text-sm); color: var(--text-muted);">' + onder + '</div>'
        + '</main>',
    };
  }

  // ---- Detailscherm pathologieverslag -----------------------------------------
  var LABEL = 'display: block; font-size: var(--text-sm); color: var(--text-muted);';
  var WAARDE = 'display: block; margin-top: 4px; font-size: var(--text-base); color: var(--text-strong);';
  var WAARDE_LEEG = 'display: block; margin-top: 4px; font-size: var(--text-base); color: var(--text-body);';

  function veld(label, waarde, extra) {
    return '<span style="display: block;' + (extra || '') + '"><span style="' + LABEL + '">' + esc(label) + '</span>'
      + '<span style="' + (waarde === DATA.LEEG ? WAARDE_LEEG : WAARDE) + '">' + esc(waarde) + '</span></span>';
  }

  function renderDetail() {
    var d = doc('patho');
    var v = verbetering('patho');
    var heeftVerbetering = !!(v.titels || v.uitleg);
    var weergave = heeftVerbetering ? state.weergave : 'bron';
    var w = weergaveVan(d, weergave === 'verbeterd');
    var uitleg = weergave === 'verbeterd' && v.uitleg;

    var wissel = heeftVerbetering
      ? '<div class="app-toggle" role="group" aria-label="Weergave">'
        + '<button type="button" data-weergave="verbeterd" aria-pressed="' + (weergave === 'verbeterd') + '">Verbeterde versie</button>'
        + '<button type="button" data-weergave="bron" aria-pressed="' + (weergave === 'bron') + '">Zoals de bron het levert</button></div>'
      : '';

    var inhoud = uitleg
      ? '<div style="flex: 1; min-height: 0; margin-top: 22px; display: grid; grid-template-columns: 548px 548px; column-gap: 16px;">'
        + sjabloon('tpl-viewer-klein') + sjabloon('tpl-uitleg-' + uitleg) + '</div>'
      : sjabloon('tpl-viewer-groot');

    return {
      hoogte: uitleg ? 1048 : 988,
      main: '<main style="flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 28px 32px 0; box-sizing: border-box;">'
        + '<div style="display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); color: var(--text-muted);">'
        + '<a href="#/" style="color: var(--text-link);">Documenten</a>' + ICON_CHEVRON + '<span>' + esc(w.titel) + '</span></div>'
        + '<div class="app-detail-kop"><h1 style="margin: 0; font-size: var(--text-xl); font-weight: var(--weight-semibold); color: var(--text-strong); letter-spacing: var(--tracking-tight);">' + esc(w.titel) + '</h1>' + wissel + '</div>'
        + '<div style="display: grid; grid-template-columns: repeat(3, 356px); column-gap: 22px; row-gap: 20px; padding-bottom: 22px; border-bottom: 1px solid var(--gray-10);">'
        + veld('Document', w.titel) + veld('Documentsoort', w.soort) + veld('Gemaakt op', w.datum)
        + veld('Zorgorganisatie', w.organisatie) + veld('Gemaakt door', w.verlener) + veld('Groep', w.groep)
        + veld('Achtergrond', d.achtergrond, ' grid-column: 1 / -1;')
        + '</div>'
        + inhoud
        + '</main>',
    };
  }

  // ---- Weergeven ----------------------------------------------------------------
  var frame = document.getElementById('app-frame');
  var live = document.getElementById('app-live');

  // Meldt een bericht aan schermlezers via de vaste live region buiten het frame.
  function meld(tekst) {
    live.textContent = '';
    setTimeout(function () { live.textContent = tekst; }, 50);
  }
  var popover = document.getElementById('app-popover');

  function route() { return location.hash === '#/pathologieverslag' ? 'detail' : 'tijdslijn'; }

  function render(focusSelector) {
    verbergPopover();
    var scherm = route() === 'detail' ? renderDetail() : renderTijdslijn();
    var oud = frame.querySelector('main');
    var scroll = frame.querySelector('.app-scroll');
    var scrollTop = scroll ? scroll.scrollTop : 0;
    var tmp = document.createElement('div');
    tmp.innerHTML = scherm.main;
    if (oud) frame.replaceChild(tmp.firstChild, oud); else frame.appendChild(tmp.firstChild);
    frame.style.height = scherm.hoogte + 'px';
    var nieuwScroll = frame.querySelector('.app-scroll');
    if (nieuwScroll && route() === 'tijdslijn') nieuwScroll.scrollTop = scrollTop;
    var kopVink = frame.querySelector('.app-check[data-id="*"]');
    if (kopVink) kopVink.indeterminate = selectie.length > 0 && !kopVink.checked;
    if (focusSelector) { var f = frame.querySelector(focusSelector); if (f) f.focus(); }
  }

  window.addEventListener('hashchange', function () {
    status = '';
    render();
    window.scrollTo(0, 0);
  });

  // ---- Selecteren --------------------------------------------------------------
  frame.addEventListener('change', function (e) {
    var t = e.target;
    if (!t.classList.contains('app-check')) return;
    var id = t.getAttribute('data-id');
    if (id === '*') {
      selectie = t.checked ? zichtbareDocs().map(function (d) { return d.id; }) : [];
    } else if (t.checked) {
      selectie.push(id);
    } else {
      selectie = selectie.filter(function (s) { return s !== id; });
    }
    render('.app-check[data-id="' + id + '"]');
  });

  frame.addEventListener('click', function (e) {
    var knop = e.target.closest('button');
    if (!knop) return;
    var actie = knop.getAttribute('data-actie');
    if (actie === 'wis') { selectie = []; render('.app-check[data-id="*"]'); }
    if (actie === 'verbeter') openDialoog();
    var w = knop.getAttribute('data-weergave');
    if (w) { state.weergave = w; bewaar(); render('[data-weergave="' + w + '"]'); }
    if (knop.getAttribute('data-nav') === 'documenten') location.hash = '#/';
    if (knop.classList.contains('app-note')) toonPopover(knop, true);
  });

  // ---- Pop-upvenster -----------------------------------------------------------
  var dialoog = document.getElementById('app-dialoog');
  var form = dialoog.querySelector('form');
  var info = document.getElementById('app-info');
  var infoKnop = document.getElementById('app-info-knop');

  function openDialoog() {
    document.getElementById('app-dialoog-aantal').textContent = meervoud(selectie.length, 'document', 'documenten') + ' geselecteerd';
    info.hidden = true;
    infoKnop.setAttribute('aria-expanded', 'false');
    werkDialoogBij();
    dialoog.showModal();
  }
  function werkDialoogBij() {
    form.elements.taal.disabled = !form.elements.uitleg.checked;
    form.querySelector('[data-actie="bevestig"]').disabled = !form.elements.titels.checked && !form.elements.uitleg.checked;
  }
  form.addEventListener('change', werkDialoogBij);
  infoKnop.addEventListener('click', function () {
    info.hidden = !info.hidden;
    infoKnop.setAttribute('aria-expanded', String(!info.hidden));
  });
  form.querySelector('[data-actie="annuleer"]').addEventListener('click', function () { dialoog.close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var opties = { titels: form.elements.titels.checked, uitleg: form.elements.uitleg.checked, taal: form.elements.taal.value };
    // Tellen per regel zoals Sanne die ziet: een groep dubbele documenten is één regel.
    var regels = {};
    selectie.forEach(function (id) { var d = doc(id); regels[d.groep || d.id] = id; });
    var voor = {};
    Object.keys(regels).forEach(function (k) { voor[k] = regelBeeld(regels[k]); });

    var resultaat = window.MockAI.verbeter(metGroepsleden(selectie), opties);
    Object.keys(resultaat).forEach(function (id) {
      var oud = state.verbeteringen[id] || {};
      var nieuw = resultaat[id];
      state.verbeteringen[id] = {
        titels: oud.titels || nieuw.titels || undefined,
        samengevoegd: oud.samengevoegd || nieuw.samengevoegd || undefined,
        uitleg: nieuw.uitleg || oud.uitleg || undefined,
      };
    });
    var sleutels = Object.keys(regels);
    var verbeterd = sleutels.filter(function (k) { return regelBeeld(regels[k]) !== voor[k]; }).length;
    var rest = sleutels.length - verbeterd;
    status = verbeterd === 0
      ? 'Voor de gekozen documenten was geen verbetering nodig.'
      : meervoud(verbeterd, 'document', 'documenten') + ' verbeterd.' + (rest ? ' Voor ' + meervoud(rest, 'document', 'documenten') + ' was geen verbetering nodig.' : '');
    state.weergave = 'verbeterd';
    selectie = [];
    bewaar();
    dialoog.close();
    render('.app-check[data-id="*"]');
    meld(status);
  });

  // Wat Sanne van de regel van dit document ziet. Verandert dit, dan is de regel verbeterd.
  function regelBeeld(id) {
    var d = doc(id);
    var kop = d.groep ? groepLeden(d.groep)[0] : d;
    return JSON.stringify([weergaveVan(kop), d.groep ? groepSamengevoegd(d.groep) : false, verbetering(kop.id).uitleg || null]);
  }

  // ---- Aanduidingen: brongegevens tonen ---------------------------------------
  // Inhoud van een aanduiding als blokken [label, waarden]; bron voor de pop-up en voor de beschrijving voor schermlezers.
  function notitieInhoud(d, soort) {
    if (soort === 'versies') {
      return [['Versies zoals de bron die levert', groepLeden(d.groep).map(function (l) { return l.bron.titel + ' · ' + l.bron.datum; })]];
    }
    var v = verbetering(d.id);
    var blokken = [];
    if (v.titels) {
      blokken.push(['Titel zoals de bron die levert', [d.bron.titel]]);
      if (d.bron.soort !== d.verbeterd.soort) blokken.push(['Documentsoort zoals de bron die levert', [d.bron.soort]]);
    }
    if (v.uitleg) blokken.push(['Uitleg in begrijpelijke taal', [DATA.talen[v.uitleg]]]);
    return blokken;
  }
  function notitieHtml(blokken) {
    return blokken.map(function (b) {
      return '<span style="display: block; color: var(--text-muted); font-size: var(--text-xs);">' + esc(b[0]) + '</span>'
        + b[1].map(function (w) { return '<span style="display: block; color: var(--text-strong);">' + esc(w) + '</span>'; }).join('');
    }).join('<span class="app-popover-gap"></span>');
  }
  function notitieTekst(blokken) {
    return blokken.map(function (b) { return b[0] + ': ' + b[1].join(', '); }).join('. ');
  }
  // Knop voor een aanduiding, met dezelfde inhoud als de pop-up als beschrijving voor schermlezers.
  function notitieKnop(d, soort, label) {
    var beschrijving = 'notitie-' + d.id + '-' + soort;
    return '<button type="button" class="app-note" data-note="' + soort + '" data-id="' + d.id + '" aria-describedby="' + beschrijving + '">' + label + '</button>'
      + '<span id="' + beschrijving + '" hidden>' + esc(notitieTekst(notitieInhoud(d, soort))) + '</span>';
  }
  // Een pop-up die door klik of focus is geopend, blijft staan tot focus weggaat, er ernaast wordt geklikt of Escape.
  var vastgezet = null;
  function toonPopover(knop, vast) {
    popover.querySelector('.app-popover-body').innerHTML = notitieHtml(notitieInhoud(doc(knop.getAttribute('data-id')), knop.getAttribute('data-note')));
    var r = knop.getBoundingClientRect();
    popover.style.left = Math.max(8, r.left - 16) + 'px';
    popover.style.top = (r.bottom + 10) + 'px';
    popover.hidden = false;
    if (vast) vastgezet = knop;
  }
  function verbergPopover() { popover.hidden = true; vastgezet = null; }
  frame.addEventListener('mouseover', function (e) { var n = e.target.closest('.app-note'); if (n) toonPopover(n); });
  frame.addEventListener('mouseout', function (e) {
    if (!e.target.closest('.app-note')) return;
    if (vastgezet && document.contains(vastgezet)) toonPopover(vastgezet, true); else verbergPopover();
  });
  frame.addEventListener('focusin', function (e) { if (e.target.classList.contains('app-note')) toonPopover(e.target, true); });
  frame.addEventListener('focusout', function (e) { if (e.target === vastgezet) verbergPopover(); });
  document.addEventListener('click', function (e) { if (vastgezet && !e.target.closest('.app-note')) verbergPopover(); });
  frame.addEventListener('scroll', verbergPopover, true);
  window.addEventListener('scroll', verbergPopover);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') verbergPopover(); });

  // ---- Opnieuw beginnen --------------------------------------------------------
  document.getElementById('app-reset').addEventListener('click', function () {
    state = { verbeteringen: {}, weergave: 'verbeterd' };
    status = '';
    selectie = [];
    form.reset();
    werkDialoogBij();
    bewaar();
    if (location.hash && location.hash !== '#/') location.hash = '#/'; else render();
    window.scrollTo(0, 0);
  });

  render();
})();

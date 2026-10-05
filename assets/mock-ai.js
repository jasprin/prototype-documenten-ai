// Nagebootste AI-dienst. Er wordt niets verstuurd: het resultaat komt uit assets/data.js.
// verbeter(ids, { titels, uitleg, taal }) geeft per document terug wat er is verbeterd.
window.MockAI = (function () {
  function verbeter(ids, opties) {
    var docs = window.PGO_DATA.documenten;
    var resultaat = {};
    ids.forEach(function (id) {
      var doc = docs.find(function (d) { return d.id === id; });
      if (!doc) return;
      var r = {};
      if (opties.titels) {
        if (doc.verbeterd) r.titels = true;
        // Dubbele documenten uit dezelfde bron worden samengevoegd onder de nieuwste versie.
        if (doc.groep) r.samengevoegd = doc.groep;
      }
      if (opties.uitleg && doc.uitleg && doc.uitleg.indexOf(opties.taal) !== -1) r.uitleg = opties.taal;
      if (r.titels || r.samengevoegd || r.uitleg) resultaat[id] = r;
    });
    return resultaat;
  }

  return { verbeter: verbeter };
})();

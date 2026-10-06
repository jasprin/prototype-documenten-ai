// Gegevens van het prototype: de tijdslijn van Sanne de Vries zoals de bronnen die leveren,
// en wat de nagebootste AI-dienst ervan maakt. Inhoud uit Bijlage C mockups (beeld 1, 2 en 4 t/m 6).
// `verbeterd` ontbreekt bij documenten waarvan de metadata al goed is.
window.PGO_DATA = (function () {
  var LEEG = '–';

  var documenten = [
    { id: 'ontslag-1', groep: 'ontslag', bron: { titel: 'Ontslagbrief opname cardiologie', soort: 'Ontslagbrief', datum: '14-03-2026', organisatie: 'Zuiderziekenhuis', verlener: 'J.X. van der Laan' } },
    { id: 'ontslag-2', groep: 'ontslag', bron: { titel: 'Ontslagbrief cardiologie def', soort: 'Ontslagbrief', datum: '13-03-2026', organisatie: 'Zuiderziekenhuis', verlener: 'J.X. van der Laan' } },
    { id: 'brief-internist', bron: { titel: 'General correspondence', soort: 'General correspondence', datum: '11-03-2026', organisatie: 'Zuiderziekenhuis', verlener: LEEG },
      verbeterd: { titel: 'Brief van internist aan huisarts', soort: 'Brief' } },
    { id: 'consult', bron: { titel: 'Consultverslag controle bloeddruk', soort: 'Consultverslag', datum: '09-03-2026', organisatie: 'Huisartsenpraktijk De Kern', verlener: 'H. Bakker' } },
    { id: 'brief-huisarts', bron: { titel: 'Healthcare communication document', soort: 'Healthcare communication document', datum: '06-03-2026', organisatie: 'Huisartsenpraktijk De Kern', verlener: LEEG },
      verbeterd: { titel: 'Brief van huisarts aan MDL-arts', soort: 'Brief' } },
    { id: 'medicatie', bron: { titel: 'Medicatieoverzicht', soort: 'Medicatieoverzicht', datum: '04-03-2026', organisatie: 'Apotheek Westerhof', verlener: 'R. Visser' } },
    { id: 'bloed-1', bron: { titel: 'Uitslag bloedonderzoek', soort: 'Laboratoriumuitslag', datum: '02-03-2026', organisatie: 'Zuiderziekenhuis', verlener: LEEG } },
    { id: 'weefsel', bron: { titel: 'document(3).pdf', soort: LEEG, datum: '28-02-2026', organisatie: 'Palga', verlener: LEEG },
      verbeterd: { titel: 'Uitslag weefselonderzoek', soort: 'Pathologieverslag' } },
    { id: 'verwijs', bron: { titel: 'Verwijsbrief MDL', soort: 'Verwijsbrief', datum: '27-02-2026', organisatie: 'Huisartsenpraktijk De Kern', verlener: 'H. Bakker' } },
    // Het enige document met een detailscherm (beeld 3 en 4). Groep en achtergrond staan alleen daar.
    { id: 'patho', detail: true, bron: { titel: 'Pathology report', soort: 'Pathology report', groep: 'Pathology study', datum: '26-02-2026', organisatie: 'Palga', verlener: LEEG },
      verbeterd: { titel: 'Pathologieverslag', soort: 'Pathologieverslag', groep: 'Pathologieonderzoek' },
      achtergrond: 'Histopathologisch onderzoek, aangevraagd tijdens poliklinisch consult MDL', uitleg: ['nl', 'tr'] },
    { id: 'radiologie', bron: { titel: 'Radiologieverslag echo abdomen', soort: 'Radiologieverslag', datum: '24-02-2026', organisatie: 'Zuiderziekenhuis', verlener: 'M. de Groot' } },
    { id: 'poli', bron: { titel: 'Polikliniekbrief MDL', soort: 'Polikliniekbrief', datum: '21-02-2026', organisatie: 'Zuiderziekenhuis', verlener: 'S. Wiersma' } },
    { id: 'operatie', bron: { titel: 'Operatieverslag', soort: 'Verslag', datum: '19-02-2026', organisatie: 'Zuiderziekenhuis', verlener: 'A. el Amrani' } },
    { id: 'bloed-2', bron: { titel: 'Uitslag bloedonderzoek', soort: 'Laboratoriumuitslag', datum: '12-02-2026', organisatie: 'Huisartsenpraktijk De Kern', verlener: LEEG } },
    { id: 'anesthesie', bron: { titel: 'Anesthesieverslag', soort: 'Verslag', datum: '10-02-2026', organisatie: 'Zuiderziekenhuis', verlener: 'T. Okonkwo' } },
  ];

  var talen = { nl: 'Nederlands', tr: 'Turks' };

  return { LEEG: LEEG, documenten: documenten, talen: talen };
})();

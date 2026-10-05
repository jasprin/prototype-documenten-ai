# Prototype: documenten verbeteren met AI

Interactief prototype van een persoonlijke gezondheidsomgeving (PGO), bij het interne memo *AI in het MedMij-stelsel* van Stichting MedMij. Geen werkend product, geen echte patiëntgegevens. Gebaseerd op de mockups van bijlage C; die staan in Claude Design.

## Flow

Sanne de Vries heeft documenten opgehaald bij haar zorgaanbieders.

1. **Tijdslijn.** Alle documenten, nieuw naar oud, met de metadata zoals de bronnen die leveren: Engelse termen, een bestandsnaam als titel, een dubbel document.
2. **Selecteren en verbeteren.** Sanne vinkt documenten aan en kiest *Verbeteren*. In het pop-upvenster kiest ze de acties (duidelijke titel en documentsoort, uitleg in begrijpelijke taal) en de taal van de uitleg (Nederlands of Turks). Uitleg en disclaimer staan achter de (i).
3. **Resultaat in de tijdslijn.** Verbeterde documenten krijgen de aanduiding *verbeterde versie*; dubbele documenten worden samengevoegd tot één regel met *2 versies*. Wie een aanduiding aanwijst, ziet de gegevens zoals de bron die levert.
4. **Detailscherm.** Alleen het pathologieverslag is te openen. Na verbetering wisselt Sanne tussen *Verbeterde versie* (origineel met uitleg ernaast) en *Zoals de bron het levert*.

*Opnieuw beginnen* in de balk bovenaan zet alles terug. De toestand blijft bewaard zolang het tabblad open is; er wordt niets opgeslagen of verstuurd. De AI-dienst is nagebootst in `assets/mock-ai.js`.

## Opbouw

```text
index.html              de PGO: tijdslijn (#/) en detailscherm (#/pathologieverslag)
assets/ds/              MedMij design system: tokens en Fira Sans, ongewijzigd
assets/app.css          prototypebalk en nieuwe onderdelen (alleen DS-tokens)
assets/app.js           schermen, toestand en navigatie
assets/data.js          documenten, brongegevens en verbeterde gegevens
assets/mock-ai.js       nagebootste AI-dienst
ontwerp/                Claude Design-export waarop de schermen zijn gebaseerd
.nojekyll               GitHub Pages serveert de bestanden zoals ze zijn
```

Statische site zonder build step en zonder externe bronnen: geen CDN, geen externe fonts, geen analytics. Vaste schermdelen (menu, viewer, uitlegpanelen) staan letterlijk uit het ontwerp als `<template>` in `index.html`; iconen (Lucide) staan als inline SVG.

Bedoeld voor desktop, ongeveer 1440 pixels breed. De pagina heeft `noindex`.

## Werkafspraken

**De repo is de bron.** Na de overdracht uit Claude Design is deze repo leidend, niet het project in Claude Design.

**Wijzigingen doe je in de code.** Teksten en gegevens staan in `assets/data.js` en `index.html`, gedrag in `assets/app.js`, de opmaak van nieuwe onderdelen in `assets/app.css`.

**Een nieuw ontwerp uit Claude Design is een nieuwe versie.**

1. Exporteer het project uit Claude Design en vervang het `.dc.html`-bestand in `ontwerp/`. De vorige versie blijft in de Git-geschiedenis en onder de tag van de vorige testronde.
2. Is het design system gewijzigd, neem dan de tokens en fonts over in `assets/ds/`, met dezelfde mapstructuur.
3. Verwerk de wijzigingen met de hand in `index.html` en `assets/`, met de export als referentie.
4. Controleer lokaal via een webserver, bijvoorbeeld `python -m http.server`, en open `http://localhost:8000`. Vanaf `file://` laden de fonts niet.
5. Commit en push naar `main`.

**Een nieuwe tag per testronde.** Tag de versie waarmee een testronde wordt gedaan, zodat altijd terug te vinden is wat deelnemers hebben gezien:

```sh
git tag -a testronde-1 -m "Testronde 1: <datum>, <wie>, <wat er getest wordt>"
git push origin testronde-1
```

## Publicatie

GitHub Pages, *Deploy from a branch*: branch `main`, map `/ (root)`. De map `ontwerp/` wordt ook geserveerd; die bevat niets wat niet al in het prototype staat.

## Licenties

- Fira Sans: SIL Open Font License 1.1, zie `assets/ds/assets/fonts/OFL.txt`.
- Lucide-iconen: ISC, zie `assets/LUCIDE-LICENSE.txt`.

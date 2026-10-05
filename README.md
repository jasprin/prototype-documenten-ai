# Bijlage C: mockups

Klikbaar prototype van zes schermen van een persoonlijke gezondheidsomgeving (PGO), bijlage C bij het interne memo *AI in het MedMij-stelsel* van Stichting MedMij. Geen werkend product, geen echte patiëntgegevens.

| Beeld | Toepassing | Situatie |
|---|---|---|
| 1 | Metadatering | Huidig |
| 2 | Metadatering | Gewenst |
| 3 | Uitleg in begrijpelijke taal | Huidig |
| 4 | Uitleg in begrijpelijke taal | Gewenst |
| 5 | Vertaling | Huidig (gelijk aan beeld 4; het verschil zit bij de gebruiker) |
| 6 | Vertaling | Gewenst (uitleg in het Turks) |

## Opbouw

```text
index.html              overzicht, direct naar elk beeld
beeld-1.html … beeld-6.html
assets/ds/              MedMij design system: tokens en Fira Sans, ongewijzigd
assets/mockup.css       paginastijl uit het ontwerp, ongewijzigd
assets/prototype.css    navigatie, bijschriften en footer (alleen DS-tokens)
assets/prototype.js     bladeren met de pijltjestoetsen
ontwerp/                export uit Claude Design waaruit de pagina's zijn opgebouwd
tools/bouw.js           bouwt index.html en beeld-*.html uit ontwerp/
tools/vendor/           Lucide-iconenbron die tools/bouw.js gebruikt
.nojekyll               GitHub Pages serveert de bestanden zoals ze zijn
```

De site zelf is statisch, zonder build step en zonder externe bronnen: geen CDN, geen externe fonts, geen analytics. Iconen (Lucide) staan als inline SVG in de pagina's. `tools/bouw.js` draai je alleen bij een nieuwe ontwerpversie (zie hieronder); GitHub Pages bouwt niets.

Klikbaar tussen de beelden: in beeld 1 en 2 opent de titel van het pathologieverslag het detailscherm (beeld 3 en 4), en de kruimel *Documenten* in beeld 3 tot en met 6 gaat terug naar het overzicht.

Bedoeld voor desktop, ongeveer 1440 pixels breed. De pagina's hebben `noindex`.

## Werkafspraken

**De repo is de bron.** Na de overdracht uit Claude Design is deze repo leidend, niet het project in Claude Design.

**Kleine wijzigingen doe je in de code.** Pas de HTML of CSS direct aan. Let op: bijschriften, kaartteksten op het overzicht en de links tussen de beelden staan in `tools/bouw.js`. Wijzig ze daar, anders verdwijnen ze bij de volgende ombouw.

**Een nieuw ontwerp uit Claude Design is een nieuwe versie.**

1. Exporteer het project uit Claude Design en vervang het `.dc.html`-bestand in `ontwerp/`. De vorige versie blijft in de Git-geschiedenis en onder de tag van de vorige testronde.
2. Is het design system gewijzigd, neem dan de tokens en fonts over in `assets/ds/`, met dezelfde mapstructuur.
3. Bouw de pagina's opnieuw op vanuit de root van de repo: `node tools/bouw.js` (vereist Node.js). Dit overschrijft `index.html` en `beeld-*.html`; handmatige wijzigingen in die bestanden voer je daarna opnieuw door of neem je op in `tools/bouw.js`. Gebruikt het nieuwe ontwerp onderdelen die het script nog niet kent, dan stopt het met een foutmelding en moet het script worden uitgebreid.
4. Controleer lokaal via een webserver, bijvoorbeeld `python -m http.server`, en open `http://localhost:8000`. Vanaf `file://` laden de fonts niet.
5. Commit en push naar `main`.

**Een nieuwe tag per testronde.** Tag de versie waarmee een testronde wordt gedaan, zodat altijd terug te vinden is wat deelnemers hebben gezien:

```sh
git tag -a testronde-1 -m "Testronde 1: <datum>, <wie>, <wat er getest wordt>"
git push origin testronde-1
```

## Publicatie

GitHub Pages, *Deploy from a branch*: branch `main`, map `/ (root)`. De mappen `ontwerp/` en `tools/` worden ook geserveerd; ze bevatten niets wat niet al op de site staat.

## Licenties

- Fira Sans: SIL Open Font License 1.1, zie `assets/ds/assets/fonts/OFL.txt`.
- Lucide-iconen: ISC, zie `assets/LUCIDE-LICENSE.txt`. Geldt ook voor `tools/vendor/lucide-0.417.0.js`.

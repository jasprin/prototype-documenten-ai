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

```
index.html              overzicht, direct naar elk beeld
beeld-1.html … beeld-6.html
assets/ds/              MedMij design system: tokens en Fira Sans, ongewijzigd
assets/mockup.css       paginastijl uit het ontwerp, ongewijzigd
assets/prototype.css    navigatie, bijschriften en footer (alleen DS-tokens)
assets/prototype.js     bladeren met de pijltjestoetsen
.nojekyll               GitHub Pages serveert de bestanden zoals ze zijn
```

Statische site zonder build step en zonder externe bronnen: geen CDN, geen externe fonts, geen analytics. De pagina's zijn eenmalig omgezet uit `Bijlage C mockups.dc.html` (Claude Design). Iconen (Lucide) staan als inline SVG in de pagina's. Wijzigingen doe je direct in de HTML.

Klikbaar tussen de beelden: in beeld 1 en 2 opent de titel van het pathologieverslag het detailscherm (beeld 3 en 4), en de kruimel *Documenten* in beeld 3 tot en met 6 gaat terug naar het overzicht.

Bedoeld voor desktop, ongeveer 1440 pixels breed. De pagina's hebben `noindex`.

## Publicatie

GitHub Pages, *Deploy from a branch*: branch `main`, map `/ (root)`.

## Licenties

- Fira Sans: SIL Open Font License 1.1, zie `assets/ds/assets/fonts/OFL.txt`.
- Lucide-iconen: ISC, zie `assets/LUCIDE-LICENSE.txt`.

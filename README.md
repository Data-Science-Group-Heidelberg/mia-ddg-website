# MiA DDG – Website

Statische Website, gebaut mit [Eleventy](https://www.11ty.dev/). Quellen liegen in `src/`, das Ergebnis (reines HTML/CSS) landet in `_site/`.

## Lokal ansehen

```bash
npm install     # einmalig
npm start       # http://localhost:8080, lädt bei jeder Änderung neu
```

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/*.html` | Seiten (nur der Inhalt von `<main>`, Kopf/Fuß kommen aus dem Layout) |
| `src/_includes/layouts/base.njk` | Gemeinsamer `<head>`, Kopfzeile, Navigation, Fußzeile |
| `src/_data/site.json` | Seitenname und Navigationspunkte |
| `src/aktuelles/*.md` | Blogbeiträge |
| `src/_data/publications.yaml` | Publikationsliste |
| `src/style.css`, `src/fonts/`, `src/unterlagen/` | werden unverändert kopiert |

## Neuen Beitrag schreiben

1. Datei `src/aktuelles/JJJJ-MM-TT-kurzer-titel.md` anlegen (das Datum im Namen wird aus der URL entfernt → `/aktuelles/kurzer-titel.html`).
2. Kopfbereich ausfüllen:
   ```yaml
   ---
   title: DDG-Herbsttagung 2026 in Leipzig
   date: 2026-11-07
   summary: Ein Satz für die Übersicht und die Startseite.
   image: /aktuelles/img/herbsttagung.jpg   # optional
   imageAlt: Unser Poster auf der Herbsttagung  # bei Bild Pflicht
   ---
   ```
3. Text darunter in Markdown schreiben. Bilder nach `src/aktuelles/img/` legen.
4. Committen. Die neuesten drei Beiträge erscheinen automatisch auf der Startseite.

## Publikation ergänzen

Eintrag in `src/_data/publications.yaml` hinzufügen (Felder sind dort oben beschrieben). Die Seite sortiert automatisch nach Jahr.

## Bauen und veröffentlichen

Die Website wird über **GitHub Pages** unter https://www.mia-ddg.de veröffentlicht. Jeder Push auf `main` startet den Workflow `.github/workflows/deploy.yml`: Er baut die Seite mit `npm run build` und stellt `_site/` online. Fortschritt und Fehler sind im Repository unter **Actions** zu sehen; dort lässt sich der Workflow auch von Hand starten („Run workflow“).

Lokal bauen (ohne Entwürfe), etwa um vorher zu prüfen:

```bash
npm run build
```

Beiträge mit `draft: true` im Kopfbereich erscheinen nur in der lokalen Vorschau (`npm start`), nie auf der veröffentlichten Seite.

### Einmalige Einrichtung

1. Im Repository unter **Settings → Pages** bei „Source“ **GitHub Actions** auswählen.
2. Ebenda unter „Custom domain“ `www.mia-ddg.de` eintragen und speichern.
3. Beim Domain-Anbieter folgende DNS-Einträge anlegen:
   - `www` als **CNAME** auf `<konto>.github.io`, wobei `<konto>` der Name der GitHub-Organisation bzw. des Kontos ist, dem das Repository gehört (nicht der Repository-Name)
   - für die Domain ohne `www` (`@`) vier **A**-Einträge: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub leitet dann auf `www` weiter)
4. Sobald GitHub die Domain geprüft hat (kann bis zu 24 Stunden dauern), unter **Settings → Pages** „Enforce HTTPS“ aktivieren.
5. Empfohlen: Die Domain in den Einstellungen der Organisation (**Settings → Pages → Verified domains**) verifizieren, damit niemand anderes sie mit GitHub Pages verwenden kann.

Links im Layout sind absolut (`/style.css`), die Seite muss also im Wurzelverzeichnis der Domain liegen. Das ist mit der eigenen Domain der Fall.

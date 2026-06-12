# CarLife AI — Projektanweisungen

Premium-Fahrzeug-Web-App (PWA): digitale Fahrzeugzentrale mit späterer KI-Bildanalyse.
Vollständiges Produktkonzept: siehe `CONCEPT.md`. Diese Datei regelt, WIE hier gearbeitet wird.

## Projektstand & Roadmap

- **Aktuelle Phase: 2 (MVP, in Arbeit)** — fertig: Kostenanalyse, Wartungsmanager (inkl. Rechnungsfotos), JSON-Export/-Import, App-Icon + Web-Manifest (Homescreen-Installation). Offen: Erinnerungen, Album, Service Worker (Offline), optional Supabase.
- Phase 1 (Prototyp) abgeschlossen: Dashboard, Fahrzeugakte, Tankbuch; Daten in localStorage, kein Backend.
- Phase 3 (KI): Claude API (Vision) über serverseitige Edge Function — API-Key niemals im Frontend.
- Phase 4 (Premium): AutoScore-Gamification, Abo, Capacitor-Native-App.

Beim Phasenwechsel diesen Abschnitt aktualisieren.

## Tech-Stack

Vite + React + TypeScript + Tailwind CSS v4 · Recharts (Diagramme) · lucide-react (Icons) · react-router-dom · localStorage hinter eigener Storage-Schicht.

## Befehle

Alle im Unterordner `carlife-ai/` ausführen:

```
npm run dev      # Dev-Server (Vite)
npm run build    # Produktions-Build inkl. TypeScript-Check — muss vor jedem Commit fehlerfrei sein
npm run preview  # Build lokal testen
```

## Deployment

- Live-App: https://marcel-fe.github.io/carlife-ai/ (GitHub Pages, öffentliches Repo `Marcel-Fe/carlife-ai`)
- Jeder Push auf `master` deployt automatisch via `.github/workflows/deploy.yml` (Build mit `--base=/carlife-ai/`).
- Router ist HashRouter — Pflicht für GitHub Pages, nicht auf BrowserRouter umstellen.

## Projektstruktur

```
CONCEPT.md                 Produktkonzept (11 Module, Roadmap, Architektur)
CLAUDE.md                  diese Datei
carlife-ai/src/
  types.ts                 zentrales Datenmodell — Änderungen NUR hier, nie inline-Typen
  storage/store.ts         einzige Stelle mit localStorage-Zugriff (wird in Phase 2 gegen Supabase getauscht)
  lib/calculations.ts      Verbrauch, Kosten/km, Monatskosten, AutoScore — pure functions
  components/              wiederverwendbare UI-Bausteine (Karten, Layout, Navigation)
  pages/                   ein File pro Modul-Screen
```

## Architektur-Regeln

- **Storage-Kapselung:** UI-Code greift nie direkt auf localStorage zu — immer über `storage/store.ts`.
- **Berechnete Werte nie speichern** (Verbrauch, Kosten/km, AutoScore) — immer aus Rohdaten ableiten, Logik in `lib/calculations.ts` als pure functions.
- Tankeinträge erzeugen automatisch einen `CostEntry` (Kategorie `fuel`) — Kostenanalyse kennt keine Sonderfälle.
- Fahrzeugbilder vor dem Speichern clientseitig komprimieren/verkleinern (localStorage-Limit ~5 MB).
- Mehrfahrzeug-Logik: aktive Fahrzeug-ID im Store, alle Seiten beziehen sich darauf.

## Design-Regeln (Premium-Dark, nicht verhandelbar)

- Basis: tiefes Anthrazit (`#0A0C10` Hintergrund, `#161A22` Karten), Akzent: Elektro-Cyan `#22D3EE`.
- Ampelfarben (grün/gelb/rot) nur für Status (Score, Dringlichkeit), nie als Deko.
- Karten mit feinen 1px-Rändern statt harter Schatten; dezente Animationen; große Zahlen für Kennwerte.
- Look: Tesla-Dashboard × Banking-App. Niemals verspielt, keine bunten Verläufe.
- Mobile-first: untere Tab-Navigation auf Mobil, Sidebar ab Desktop-Breite.

## Konventionen

- UI-Texte komplett **Deutsch**, Code/Variablen/Commits **Englisch**.
- Datumsformat in der UI: `TT.MM.JJJJ`; Beträge: `1.234,56 €`; intern ISO-Strings und Zahlen.
- Keine neuen Dependencies ohne kurze Begründung.

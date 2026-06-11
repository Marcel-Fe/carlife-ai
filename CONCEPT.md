# CarLife AI — Produktkonzept

> Die intelligente digitale Fahrzeugzentrale: Eine App, die das komplette Fahrzeugleben verwaltet — und Fahrzeuge per KI-Foto-Analyse versteht.

---

## 1. Produktvision

CarLife AI macht aus dem Autobesitz ein durchschaubares, kontrollierbares Erlebnis. Heute liegen Fahrzeugdaten verstreut: Rechnungen im Handschuhfach, TÜV-Termin im Kopf, Tankkosten nirgendwo. CarLife AI bündelt alles in einer Premium-App — und geht einen Schritt weiter: Die KI erkennt Fahrzeuge auf Fotos, analysiert Schäden, schätzt Marktwerte und berät beim Gebrauchtwagenkauf.

**Leitsatz:** *„Dein Auto. Komplett verstanden."*

Die App fühlt sich an wie eine Mischung aus Tesla-Dashboard, moderner Banking-App und Premium-Car-Software: dunkel, klar, hochwertig, vertrauenswürdig. Nicht verspielt.

## 2. Zielgruppe

| Segment | Beschreibung | Kernbedürfnis |
|---|---|---|
| **Kostenbewusste Besitzer & Pendler** | Fahren täglich, wollen wissen, was das Auto wirklich kostet | Tankbuch, Kostenanalyse, Erinnerungen |
| **Gebrauchtwagenkäufer** | Kaufen alle paar Jahre, haben Angst vor Fehlkäufen | KI-Kaufberater, Schadensanalyse, Marktwert |
| **Enthusiasten & Schrauber** | Pflegen ihr Fahrzeug, dokumentieren alles | Fahrzeugalbum, Wartungshistorie, AutoScore |

Sekundär: Familien mit mehreren Fahrzeugen, Verkäufer (lückenlose Historie steigert den Wiederverkaufswert).

## 3. Alleinstellungsmerkmale (USPs)

1. **KI-Fahrzeugscanner** — Foto rein, professionelle Bewertung raus (Marke, Modell, Baujahr, Zustand, Marktwert). Kein Wettbewerber kombiniert das mit Fahrzeugverwaltung.
2. **KI-Schadensanalyse** — Kratzer fotografieren, Dringlichkeit + Kostenrahmen erhalten. Senkt die Hemmschwelle vor der Werkstatt.
3. **KI-Kaufberater** — Inserat + Fotos hochladen, Kaufscore 0–100 mit Risiken und Preisempfehlung.
4. **AutoScore** — Gamifizierte Gesamtbewertung der Fahrzeugpflege. Motiviert zur lückenlosen Dokumentation.
5. **Premium-Erlebnis** — Konkurrenz-Apps (Tankbücher, Wartungsplaner) wirken wie Bastlersoftware. CarLife AI wirkt wie ein Produkt von Tesla oder N26.

## 4. Monetarisierung

**Freemium-Modell:**

| | CarLife Free | CarLife Premium (~4,99 €/Monat oder 39,99 €/Jahr) |
|---|---|---|
| Fahrzeuge | 1 | unbegrenzt |
| Tankbuch, Kosten, Erinnerungen | ✓ | ✓ |
| Wartungsmanager, Fahrzeugalbum | eingeschränkt (Limit) | unbegrenzt |
| KI-Fahrzeugscanner | — | ✓ |
| KI-Schadensanalyse | — | ✓ |
| KI-Kaufberater | 1 Gratis-Analyse als Teaser | ✓ |
| Cloud-Sync + Export (PDF/JSON) | — | ✓ |

Spätere Zusatzerlöse: Werkstatt-Partnerprogramm (Vermittlung), Versicherungsvergleich (Affiliate), B2B-Variante für kleine Fuhrparks.

## 5. MVP-Version (Module 1–7)

Die kostenlose, voll funktionsfähige Verwaltungs-App:

1. Hauptdashboard
2. Fahrzeugakte
3. Tankbuch
4. Kostenanalyse
5. Wartungsmanager
6. Erinnerungscenter
7. Fahrzeugalbum

## 6. Premium-Version (Module 8–11)

8. KI-Fahrzeugscanner
9. KI-Schadensanalyse
10. KI-Kaufberater
11. AutoScore-System mit Badges

## 7. Entwicklungs-Roadmap

| Phase | Inhalt | Ergebnis |
|---|---|---|
| **Phase 1 — Prototyp** | App-Shell, Dashboard, Fahrzeugakte, Tankbuch. Daten lokal (localStorage), kein Login. | Lauffähige Web-App im Premium-Design |
| **Phase 2 — MVP** | Kostenanalyse, Wartungsmanager, Erinnerungscenter, Fahrzeugalbum, JSON-Export, PWA-Installierbarkeit. Optional: Cloud + Login (Supabase). | Vollständige Verwaltungs-App, täglich nutzbar |
| **Phase 3 — KI-Integration** | Fahrzeugscanner, Schadensanalyse, Kaufberater über Claude API (Bildanalyse). Kleines Backend (Edge Function), damit der API-Key nie im Browser liegt. | Die App wird intelligent |
| **Phase 4 — Premium** | AutoScore + Badges, Abo/Paywall, Push-Benachrichtigungen, native App via Capacitor, App-Store-Release. | Marktreifes Produkt |

---

## 8. App-Struktur: Die 11 Module

### Modul 1 — Hauptdashboard (Kommandozentrale)

Erster Screen nach dem Öffnen. Enthält:

- Großes Fahrzeugbild (Hero-Bereich)
- Fahrzeugmodell + Kennzeichen (als EU-Kennzeichen-Plakette gestaltet)
- Kilometerstand
- **AutoScore-Ring** (0–100, animiert)
- Marktwert-Karte (ab Phase 3 KI-gestützt)
- Monatskosten-Karte
- Nächste Termine (TÜV, Ölwechsel …)
- KI-Empfehlung des Tages

Beispiel-Layout:

```
┌─────────────────────────────┐
│  [Fahrzeugbild — Hero]      │
│  VW Golf GTI    ⬤ 92/100   │
│  B·AB 1234      AutoScore   │
├──────────────┬──────────────┤
│ Kosten Monat │ Nächster     │
│   240 €      │ Termin:      │
│ ▁▃▅▂▆ Trend  │ Ölwechsel    │
│              │ in 800 km    │
├──────────────┴──────────────┤
│ 💡 KI: „Reifendruck prüfen" │
└─────────────────────────────┘
```

### Modul 2 — Fahrzeugakte

Digitales Fahrzeugprofil: Marke, Modell, Baujahr, Motor, Kraftstoff, Kennzeichen, Kilometerstand, Kaufpreis, Kaufdatum, Fahrzeugbilder, Historie. Mehrere Fahrzeuge möglich (Fahrzeugwechsler im Header).

### Modul 3 — Tankbuch

Tankvorgänge erfassen (Datum, Liter, Preis/Liter, Kilometerstand, Volltank ja/nein). Automatisch berechnet: Verbrauch (l/100 km zwischen Volltankungen), Kosten pro Kilometer, Monats- und Jahreskosten, Preis- und Verbrauchstrend als Diagramm.

### Modul 4 — Kostenanalyse

Finanzmodul mit Diagrammen: Tankkosten, Versicherung, Steuer, Reparaturen, Wartung, Wertverlust. Ansichten: Monat / Jahr / Gesamt, Kategorien-Donut, Kostenverlauf, Kosten pro Kilometer.

### Modul 5 — Wartungsmanager

Digitale Werkstattakte: Ölwechsel, Bremsen, Reifen, Batterie, Inspektionen — je mit Datum, Kilometerstand, Kosten, Werkstatt, Rechnungsfoto. Aus Wartungseinträgen entstehen automatisch Erinnerungen (z. B. „nächster Ölwechsel in 15.000 km").

### Modul 6 — Erinnerungscenter

Termine nach Datum oder Kilometerstand: TÜV/HU, Reifenwechsel, Ölwechsel, Versicherung, Steuer, Inspektion. Phase 2: In-App-Hinweise; Phase 4: echte Push-Benachrichtigungen.

### Modul 7 — Fahrzeugalbum

Digitales Fahrzeugtagebuch mit Fotos: Kaufzustand, Schäden, Reparaturen, Umbauten. Zeitstrahl-Ansicht und Vorher/Nachher-Vergleich (Schieberegler).

### Modul 8 — KI-Fahrzeugscanner *(Premium)*

Input: Foto eines Fahrzeugs. Output: Marke, Modell, Baujahr (Schätzung), Fahrzeugtyp, Zustandseinschätzung, sichtbare Schäden, geschätzter Marktwert — als professioneller Bewertungsbericht.

### Modul 9 — KI-Schadensanalyse *(Premium)*

Input: Foto eines Schadens. Output: Schadenstyp (Kratzer, Delle, Rost, Lackschaden), verständliche Erklärung, Dringlichkeit (niedrig/mittel/hoch), realistischer Kostenrahmen.

### Modul 10 — KI-Kaufberater *(Premium)*

Input: Inseratsfotos, Inseratstext, Preis. Output: **Kaufscore 0–100**, Vorteile, Risiken (z. B. typische Schwachstellen des Modells), empfohlener Verhandlungspreis.

### Modul 11 — AutoScore-System

Gesamtbewertung 0–100 aus fünf Säulen: Wartung, Kostenkontrolle, Verbrauch, Pflege, Dokumentation. Gamification mit Badges: 🔧 Wartungsprofi, 🦊 Sparfuchs, 🛣️ Langstreckenheld u. a.

---

## 9. Technische Architektur

### Stack

| Schicht | Technologie | Phase |
|---|---|---|
| Frontend | Vite + React + TypeScript + Tailwind CSS | 1 |
| Diagramme | Recharts | 1 |
| Persistenz lokal | localStorage hinter eigener Storage-Schnittstelle | 1 |
| PWA | Web App Manifest + Service Worker | 2 |
| Cloud/Auth | Supabase (PostgreSQL, Auth, Storage) | 2 |
| KI | Claude API (Vision) über serverseitige Edge Function | 3 |
| Native App | Capacitor (iOS/Android aus derselben Codebasis) | 4 |

### Datenmodell

```
Vehicle           id, make, model, year, engine, fuelType, licensePlate,
                  purchasePrice, purchaseDate, currentKm, imageDataUrl, createdAt
FuelEntry         id, vehicleId, date, liters, pricePerLiter, totalPrice, km, fullTank
CostEntry         id, vehicleId, date, category(fuel|insurance|tax|repair|maintenance|other),
                  amount, note        ← Tankeinträge erzeugen automatisch CostEntries
MaintenanceEntry  id, vehicleId, date, type, km, cost, workshop, note, photos[]   (Phase 2)
Reminder          id, vehicleId, type, dueDate|dueKm, note, done                  (Phase 2)
AlbumPhoto        id, vehicleId, date, category, caption, imageRef               (Phase 2)
AiAnalysis        id, vehicleId?, type(scan|damage|purchase), input, result, date (Phase 3)
```

Abgeleitete Werte werden **berechnet, nie gespeichert**: Verbrauch, Kosten/km, Monatskosten, AutoScore.

### KI-Anbindung (Phase 3)

```
Browser ──Foto──▶ Edge Function (Server) ──▶ Claude API (Vision)
        ◀─JSON-Bewertung── (API-Key liegt NUR auf dem Server)
```

- Bilder werden clientseitig komprimiert, bevor sie hochgeladen werden.
- Die KI antwortet in strukturiertem JSON (Schema-erzwungen), das die App in Berichts-Screens rendert.
- Jede Analyse wird als `AiAnalysis` gespeichert → Historie.

### Sicherheitskonzept

- **Phase 1:** Alle Daten bleiben auf dem Gerät — maximaler Datenschutz, kein Konto nötig.
- **Phase 2+:** Supabase Auth (E-Mail + OAuth), Row Level Security (jeder Nutzer sieht nur eigene Daten), Bilder in privaten Buckets, TLS überall.
- **Phase 3:** API-Keys ausschließlich serverseitig; Rate-Limiting pro Nutzer gegen Kostenexplosion.
- DSGVO: Datenexport (JSON) und Konto-Löschung als Funktion eingeplant.

## 10. Design-System

- **Stimmung:** Tesla-Dashboard × Banking-App. Dunkel, ruhig, präzise. Nicht verspielt.
- **Farben:** Tiefes Anthrazit/Schwarz als Basis (`#0A0C10`–`#161A22`), eine Akzentfarbe (Elektro-Cyan `#22D3EE`) für Aktionen und Highlights, Ampelfarben nur für Status (Score, Dringlichkeit).
- **Typografie:** Moderne Sans (Inter/Manrope), große Zahlen für Kennwerte, ruhige Sekundärtexte.
- **Komponenten:** Karten mit feinen Rändern statt harter Schatten, Score-Ringe, dezente Eintritts-Animationen, viel Weißraum (bzw. „Dunkelraum").
- **Sprache:** UI komplett Deutsch, Code/Variablen Englisch.

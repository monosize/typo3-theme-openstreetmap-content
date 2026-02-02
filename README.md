# TYPO3 Theme: OpenStreetMap Content

Interaktive OpenStreetMap-Karte zur Anzeige einer Firmenadresse mit zentriertem Adress-Overlay und Modal-Dialog für Firmendetails.

## Features

- **OpenStreetMap Integration**: Nutzt Leaflet.js für interaktive Karten
- **Mehrere Tile-Layer**: OpenStreetMap Standard, Deutschland, OpenTopoMap, CycleMap
- **Aspect Ratio Support**: Flexible Seitenverhältnisse wie bei Row.html (z.B. 16-9, 4-3, 3-2)
- **Zentriertes Overlay**: Adresse wird als Card in der Kartenmitte angezeigt
- **Modal-Dialog**: Öffnet sich mit Button für vollständige Kontaktdaten
- **Responsive**: Funktioniert auf allen Bildschirmgrössen
- **Accessibility**: WCAG-konform mit ARIA-Attributen und Screen Reader Support
- **GDPR-konform**: Keine Cookies oder externe Tracking-Dienste nötig

## Requirements

- TYPO3 13.4+
- `monosize/typo3-frontend-library` >= 13.4.62
- `monosize/typo3-build-system` >= 13.4.0
- `leaflet` >= 1.9.0 (wird automatisch installiert)

## Installation

### Via Composer (Development Repository)

```bash
ddev composer config repositories.typo3-theme-openstreetmap-content path ./develop/typo3-theme-openstreetmap-content
ddev composer require monosize/typo3-theme-openstreetmap-content
```

### Als globales Content Theme

Add to `config/sites/theme-global.yaml`:

```yaml
contentThemes:
  - OpenstreetmapContent
```

### Build

```bash
ddev exec yarn build
```

## Backend Konfiguration

### Konfiguration Sheet
- **Titel**: Bezeichnung für die Adresse/Firma
- **Strasse**: Strassenname und Hausnummer
- **PLZ**: Postleitzahl
- **Ort**: Stadt
- **Breitengrad (Latitude)**: Optional, wird automatisch ermittelt wenn leer
- **Längengrad (Longitude)**: Optional, wird automatisch ermittelt wenn leer
- **Zoom-Level**: 1-19, Standard ist 15

### Kartenstil Sheet
- **Karten-Anbieter**:
  - OpenStreetMap Standard (Standard)
  - OpenStreetMap Deutschland
  - OpenTopoMap (Topografische Karte)
  - OpenCycleMap (Fahrradkarte)
- **Seitenverhältnis**: z.B. 16-9, 4-3, 3-2, 21-9 (Cinematic)

### Firmendaten (Modal) Sheet
- **Firmenname**: Name im Modal-Titel
- **Ansprechpartner**: Kontaktperson
- **Telefon**: Mit klickbarem tel: Link
- **E-Mail**: Mit klickbarem mailto: Link
- **Website**: Mit klickbarem externem Link
- **Öffnungszeiten**: HTML-Text für Öffnungszeiten

### Modal-Optionen Sheet
- **Modal aktivieren**: Modal anzeigen oder ausblenden
- **Button-Text**: Text für den "Kontaktdaten anzeigen" Button

## Beispiel

### Minimale Konfiguration

Nur Adresse eingeben - Karte wird automatisch zentriert:

- Titel: "Büro Norden"
- Strasse: "Hauptstrasse 123"
- PLZ: "26789"
- Ort: "Norden"

### Mit Koordinaten

Für präzise Positionierung:

- Breitengrad: `53.5930`
- Längengrad: `7.2750`

### Mit Aspect Ratio

Für Cinematic-Format (21:9):

- Seitenverhältnis: `21-9`

## Frontend Ausgabe

Die Komponente generiert:

1. **Karten-Container** mit Aspect Ratio Support
2. **Leaflet-Karte** mit gewähltem Tile-Layer
3. **Zentriertes Overlay** mit Adresse und Button
4. **Modal-Dialog** mit vollständigen Kontaktdaten

### HTML Struktur

```html
<div class="content-openstreet-map" style="aspect-ratio: 16/9;">
  <!-- Leaflet Map -->
  <div class="content-openstreet-map__map"></div>

  <!-- Center Overlay -->
  <div class="content-openstreet-map__overlay">
    <div class="content-openstreet-map__address-card">
      <h3>Büro Norden</h3>
      <address>Hauptstrasse 123<br>26789 Norden</address>
      <button>Kontaktdaten anzeigen</button>
    </div>
  </div>

  <!-- Loading State -->
  <div class="content-openstreet-map__loading">...</div>

  <!-- Error State -->
  <div class="content-openstreet-map__error">...</div>
</div>

<!-- Modal Dialog -->
<div class="content-openstreet-map__modal">
  <div class="content-openstreet-map__modal-backdrop"></div>
  <div class="content-openstreet-map__modal-dialog">
    <div class="content-openstreet-map__modal-content">
      <header class="content-openstreet-map__modal-header">
        <h2>Firmenname</h2>
        <button>Schliessen</button>
      </header>
      <div class="content-openstreet-map__modal-body">
        <!-- Kontaktdaten -->
      </div>
      <footer class="content-openstreet-map__modal-footer">
        <button>Schliessen</button>
      </footer>
    </div>
  </div>
</div>
```

## Styling

### CSS Variables

Die Komponente nutzt folgende CSS Variables:

```scss
--space-m          // Margin spacing
--space-l          // Large spacing
--space-s          // Small spacing
--space-xs         // Extra small spacing
--text-xl          // Title font size
--text-base        // Base font size
--text-sm          // Small font size
--text-primary     // Primary text color
--text-secondary   // Secondary text color
--bg-light         // Light background
--border-color     // Border color
--primary          // Brand color (für Links/Buttons)
--primary-hover    // Brand color hover
--border-radius-md // Medium border radius
--border-radius-lg // Large border radius
```

### Custom Styling

Überschreiben Sie Styles in Ihrem Domain-SCSS:

```scss
.content-openstreet-map {
  // Anpassung des Address Cards
  &__address-card {
    background: rgba(255, 255, 255, 1);
    padding: 3rem;
    border-radius: 16px;
  }

  // Anpassung des Modal
  &__modal-dialog {
    max-width: 600px;
  }
}
```

## Stimulus Controller

Der `openstreetmap-content_controller.js` stellt folgende Methoden bereit:

- `init()`: Initialisiert die Leaflet-Karte
- `openModal()`: Öffnet den Modal-Dialog
- `closeModal()`: Schliesst den Modal-Dialog
- `showError(message)`: Zeigt Fehlermeldung an
- `invalidateSize()`: Aktualisiert Kartengrösse nach Resize

### Controller Values

- `lat-value`: Breitengrad (String)
- `lng-value`: Längengrad (String)
- `zoom-value`: Zoom-Level (Number)
- `tileLayer-value`: Tile-Layer Auswahl (String)
- `modalId-value`: Modal Element ID (String)

## File Structure

```
OpenstreetmapContent/
├── composer.json
├── package.json           # NPM dependencies (leaflet)
├── config.yaml            # Theme configuration
├── README.md
├── FluidTemplates/
│   └── OpenstreetmapContent.html
├── Scss/
│   └── _openstreetmap-content.scss
├── Js/
│   └── openstreetmap-content_controller.js
└── Icons/
    └── openstreetmap-content.svg
```

## License

Proprietary - Monosize GmbH

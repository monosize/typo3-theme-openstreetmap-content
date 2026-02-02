# TYPO3 Theme: OpenStreetMap Content

Interaktive OpenStreetMap-Karte zur Anzeige einer Firmenadresse mit Modal-Dialog für Firmendetails

## Features

- **Content Element**: Custom TYPO3 content element
- **Variants**: Default, Highlight, Minimal
- **Animation**: Optional animation support with Stimulus controller
- **Accessible**: Respects `prefers-reduced-motion` and provides ARIA labels
- **Responsive**: Works on all screen sizes

## Requirements

- TYPO3 13.4+
- `monosize/typo3-frontend-library` >= 13.4.62
- `monosize/typo3-build-system` >= 13.4.65

## Installation

```bash
composer require monosize/typo3-theme-openstreetmap-content
```

Then add the theme to your site's `theme-global.yaml`:

```yaml
contentThemes:
  - OpenstreetmapContent
```

Run the build:

```bash
ddev exec yarn build
```

## Backend Options

### Content Tab
- **Content**: The main content for this element

### Appearance Tab
- **Variant**: Visual variant (default, highlight, minimal)

### Animation Tab
- **Enable Animation**: Toggle animation on/off
- **Animation Duration**: Duration in seconds

### Styling Tab
- **Custom CSS Class**: Additional CSS class for styling

### Accessibility Tab
- **ARIA Label**: Custom accessible label for screen readers

## Example Output

```html
<div class="content-openstreetmap-content content-openstreetmap-content--highlight"
     data-controller="openstreetmap-content"
     data-openstreetmap-content-duration-value="0.5">
  <div class="content-openstreetmap-content__content">
    Your content here
  </div>
</div>
```

## Customization

### CSS Variables

The component uses these CSS variables:

```scss
--space-m          // Vertical margin (default: 1.5rem)
--space-s          // Small margin for minimal variant
--template-bg-light // Background for highlight variant
--border-radius    // Border radius for highlight variant
```

### Custom Styling

Override styles in your domain SCSS:

```scss
.content-openstreetmap-content {
  // Your custom styles
}
```

## Development

### File Structure

```
OpenstreetmapContent/
├── composer.json
├── package.json
├── config.yaml
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

### Adding Custom Controller

1. Uncomment `controllers` in `config.yaml`:
   ```yaml
   components:
     controllers:
       - "openstreetmap-content_controller.js"
   ```

2. Modify `Js/openstreetmap-content_controller.js` with your logic

3. Rebuild: `ddev exec yarn build`

## License

Proprietary - Monosize GmbH

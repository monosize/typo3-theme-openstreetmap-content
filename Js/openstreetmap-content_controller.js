// Js/openstreetmap-content_controller.js
/**
 * OpenStreetMap Controller
 *
 * Interaktive OpenStreetMap-Karte mit Leaflet.js
 * Zeigt eine Adresse an und unterstützt verschiedene Tile-Layer
 *
 * @example Basic Usage
 * <div data-controller="openstreetmap-content"
 *      data-openstreetmap-content-lat-value="51.505"
 *      data-openstreetmap-content-lng-value="-0.09"
 *      data-openstreetmap-content-zoom-value="13">
 *   <div data-openstreetmap-content-target="map"></div>
 * </div>
 *
 * @example Custom Tile Layer
 * <div data-controller="openstreetmap-content"
 *      data-openstreetmap-content-lat-value="51.505"
 *      data-openstreetmap-content-lng-value="-0.09"
 *      data-openstreetmap-content-tile-layer-value="osm_de">
 *   <div data-openstreetmap-content-target="map"></div>
 * </div>
 *
 * @example Grayscale Map
 * <div data-controller="openstreetmap-content"
 *      data-openstreetmap-content-grayscale-value="1">
 *   <div data-openstreetmap-content-target="map"></div>
 * </div>
 */
import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Tile Layer Konfigurationen
const TILE_LAYERS = {
	osm: {
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 19
	},
	osm_de: {
		url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 18
	},
	topo: {
		url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
		maxZoom: 17
	},
	cycle: {
		url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61758aad82084d0d9815380baa976f5d',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.thunderforest.com/">Thunderforest</a>',
		maxZoom: 18
	}
}

export default class extends Controller {
	static targets = ["map", "loading", "error"]
	static values = {
		lat: { type: String, default: "51.505" },
		lng: { type: String, default: "-0.09" },
		zoom: { type: Number, default: 15 },
		tileLayer: { type: String, default: "osm" },
		grayscale: { type: Boolean, default: false }
	}

	connect() {
		// Warten bis DOM vollständig geladen und Leaflet verfügbar
		if (typeof L === 'undefined') {
			this.showError('Leaflet-Bibliothek nicht geladen')
			return
		}

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.init())
		} else {
			requestAnimationFrame(() => this.init())
		}
	}

	init() {
		try {
			// Prüfen ob Koordinaten vorhanden sind
			const lat = parseFloat(this.latValue)
			const lng = parseFloat(this.lngValue)

			if (isNaN(lat) || isNaN(lng)) {
				this.showError('Ungültige Koordinaten')
				return
			}

			// Loading anzeigen
			if (this.hasLoadingTarget) {
				this.loadingTarget.style.display = 'flex'
			}

			// Karte initialisieren
			this.mapInstance = L.map(this.mapTarget, {
				center: [lat, lng],
				zoom: this.zoomValue,
				zoomControl: true,
				scrollWheelZoom: false,
				doubleClickZoom: true,
				touchZoom: true
			})

			// Tile Layer hinzufügen
			const tileConfig = TILE_LAYERS[this.tileLayerValue] || TILE_LAYERS.osm
			this.tileLayerInstance = L.tileLayer(tileConfig.url, {
				attribution: tileConfig.attribution,
				maxZoom: tileConfig.maxZoom
			}).addTo(this.mapInstance)

			// Graustufen-Filter anwenden
			this.applyGrayscale()

			// Custom Marker mit inline SVG (zuverlässiger als Bilder)
			const markerIcon = L.divIcon({
				className: 'content-openstreet-map__marker',
				html: `<div class="content-openstreet-map__marker-inner" role="img" aria-label="Standort"><svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 20 32" xmlns="http://www.w3.org/2000/svg" fill="#7a242f"><g transform="matrix(.335332 0 0 .373207 -6.94762 -2.27399)"><path d="m20.719 6.093h59.391v85.504h-59.391z" fill="none"/><path d="m69.122 51.098c3.665-4.35 5.878-9.964 5.878-16.098 0-13.807-11.193-25-25-25s-25 11.193-25 25c0 6.134 2.213 11.748 5.878 16.098l19.122 23.902zm-19.122-23.931c4.326 0 7.834 3.507 7.834 7.833s-3.508 7.833-7.834 7.833-7.834-3.507-7.834-7.833 3.508-7.833 7.834-7.833z" fill-rule="nonzero" transform="matrix(1.17614 0 0 1.05678 -8.39304 9.57735)"/></g></svg></div>`,
				iconSize: [40, 80],
				iconAnchor: [20, 72.5],
				popupAnchor: [0, -72.5]
			})

			// Marker hinzufügen
			this.markerInstance = L.marker([lat, lng], { icon: markerIcon }).addTo(this.mapInstance)

			// Marker bei 75% horizontal positionieren (nicht zentriert)
			// Karte nach LINKS verschieben, damit Marker nach RECHTS wandert
			setTimeout(() => {
				const mapSize = this.mapInstance.getSize()
				const targetX = mapSize.x * 0.66 // 66% von links
				const currentX = mapSize.x * 0.5 // Marker ist aktuell zentriert (50%)
				const diffX = currentX - targetX // Negativ = nach links verschieben

				this.mapInstance.panBy([diffX, 0], { animate: false })
			}, 100)

			// Loading ausblenden
			if (this.hasLoadingTarget) {
				this.loadingTarget.style.display = 'none'
			}

		} catch (error) {
			console.error('OpenStreetMap initialization error:', error)
			this.showError('Fehler beim Initialisieren der Karte')
		}
	}

	/**
	 * Wendet Graustufen-Filter auf die Karte an
	 * Nur auf tilePane anwenden, damit Marker farbig bleibt
	 */
	applyGrayscale() {
		const tilePane = this.mapInstance.getPane('tilePane')
		if (!tilePane) return

		if (this.grayscaleValue) {
			tilePane.style.filter = 'grayscale(100%)'
		} else {
			tilePane.style.filter = ''
		}
	}

	grayscaleValueChanged() {
		// Wenn sich der Graustufen-Wert ändert, neu anwenden
		if (this.mapInstance) {
			this.applyGrayscale()
		}
	}

	showError(message) {
		if (this.hasErrorTarget) {
			this.errorTarget.style.display = 'flex'
			const errorText = this.errorTarget.querySelector('.content-openstreet-map__error-text')
			if (errorText) {
				errorText.textContent = message
			}
		}
		if (this.hasLoadingTarget) {
			this.loadingTarget.style.display = 'none'
		}
	}

	disconnect() {
		// Cleanup: Karte zerstören
		if (this.mapInstance) {
			this.mapInstance.remove()
		}
	}

	// Öffentliche Methode zum Invalidate nach Resize
	invalidateSize() {
		if (this.mapInstance) {
			this.mapInstance.invalidateSize()
		}
	}
}

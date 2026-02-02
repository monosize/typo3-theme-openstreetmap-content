// Js/openstreetmap-content_controller.js
/**
 * OpenStreetMap Controller
 *
 * Interaktive OpenStreetMap-Karte mit Leaflet.js
 * Zeigt eine Adresse an und unterstützt verschiedene Tile-Layer
 *
 * @example Basic Usage
 * <div data-controller="openstreet-map"
 *      data-openstreet-map-lat-value="51.505"
 *      data-openstreet-map-lng-value="-0.09"
 *      data-openstreet-map-zoom-value="13">
 *   <div data-openstreet-map-target="map"></div>
 * </div>
 *
 * @example Custom Tile Layer
 * <div data-controller="openstreet-map"
 *      data-openstreet-map-lat-value="51.505"
 *      data-openstreet-map-lng-value="-0.09"
 *      data-openstreet-map-tile-layer-value="osm_de">
 *   <div data-openstreet-map-target="map"></div>
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
	static targets = ["map", "loading", "error", "modal"]
	static values = {
		lat: { type: String, default: "51.505" },
		lng: { type: String, default: "-0.09" },
		zoom: { type: Number, default: 15 },
		tileLayer: { type: String, default: "osm" },
		modalId: String
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

			// Marker hinzufügen
			this.markerInstance = L.marker([lat, lng]).addTo(this.mapInstance)

			// Loading ausblenden
			if (this.hasLoadingTarget) {
				this.loadingTarget.style.display = 'none'
			}

		} catch (error) {
			console.error('OpenStreetMap initialization error:', error)
			this.showError('Fehler beim Initialisieren der Karte')
		}
	}

	openModal() {
		if (!this.modalIdValue) return

		const modal = document.getElementById(this.modalIdValue)
		if (modal) {
			modal.classList.add('content-openstreet-map__modal--open')
			modal.setAttribute('aria-hidden', 'false')

			// Focus trap zum ersten interaktiven Element
			const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
			if (firstFocusable) {
				setTimeout(() => firstFocusable.focus(), 100)
			}
		}
	}

	closeModal() {
		if (!this.modalIdValue) return

		const modal = document.getElementById(this.modalIdValue)
		if (modal) {
			modal.classList.remove('content-openstreet-map__modal--open')
			modal.setAttribute('aria-hidden', 'true')
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

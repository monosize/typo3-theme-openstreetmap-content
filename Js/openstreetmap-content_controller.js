/**
 * OpenStreetMap Content Stimulus Controller
 * Interaktive OpenStreetMap-Karte zur Anzeige einer Firmenadresse mit Modal-Dialog für Firmendetails
 *
 * @example
 * <div data-controller="openstreetmap-content"
 *      data-openstreetmap-content-duration-value="0.5">
 *   Content here
 * </div>
 */

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  /**
   * Stimulus Values
   * Access via: this.durationValue, this.enabledValue, etc.
   */
  static values = {
    duration: { type: Number, default: 0.5 },
    enabled: { type: Boolean, default: true },
    // Add more values as needed
  }

  /**
   * Stimulus Targets
   * Access via: this.contentTarget, this.hasContentTarget, etc.
   */
  static targets = [
    // "content",
    // "trigger",
  ]

  /**
   * Stimulus Classes
   * Access via: this.animatingClass, this.hasAnimatingClass, etc.
   */
  static classes = [
    "animating",
    "animated",
  ]

  /**
   * Called when controller is connected to DOM
   */
  connect() {
    // Check for reduced motion preference
    if (this.prefersReducedMotion) {
      this.element.classList.add("is-animated")
      return
    }

    // Initialize the controller
    this.init()
  }

  /**
   * Called when controller is disconnected from DOM
   */
  disconnect() {
    // Cleanup: remove event listeners, cancel animations, etc.
    this.cleanup()
  }

  /**
   * Initialize the component
   */
  init() {
    if (!this.enabledValue) return

    // Add your initialization logic here
    // Example: Set up intersection observer, animations, etc.

    this.element.classList.add("is-initialized")
  }

  /**
   * Cleanup when disconnecting
   */
  cleanup() {
    // Remove event listeners
    // Cancel any running animations
    // Clear timeouts/intervals
  }

  /**
   * Check if user prefers reduced motion
   */
  get prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  /**
   * Value changed callback
   * Called when durationValue changes
   */
  durationValueChanged(value, previousValue) {
    // React to value changes
  }

  /**
   * Example action method
   * Can be called via data-action="click->openstreetmap-content#animate"
   */
  animate() {
    if (!this.enabledValue || this.prefersReducedMotion) return

    this.element.classList.add("is-animating")

    // Your animation logic here

    setTimeout(() => {
      this.element.classList.remove("is-animating")
      this.element.classList.add("is-animated")
    }, this.durationValue * 1000)
  }

  /**
   * Reset animation state
   */
  reset() {
    this.element.classList.remove("is-animating", "is-animated")
  }
}

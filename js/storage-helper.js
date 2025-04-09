/**
 * Storage Helper Functions
 * This file provides utility functions for safely storing and retrieving
 * data from localStorage to prevent JSON parsing errors
 */

// Safe JSON storage utilities
const StorageHelper = {
  /**
   * Safely store a value in localStorage with proper JSON serialization
   * @param {string} key - The storage key
   * @param {any} value - The value to store
   * @returns {boolean} Success indicator
   */
  set: function(key, value) {
    try {
      // Ensure proper serialization of objects, avoiding "[object Object]" errors
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error storing data for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Safely retrieve and parse a value from localStorage
   * @param {string} key - The storage key
   * @param {any} defaultValue - Default value if key not found or error occurs
   * @returns {any} The retrieved value or defaultValue
   */
  get: function(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error retrieving data for key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Remove a value from localStorage
   * @param {string} key - The storage key to remove
   */
  remove: function(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key "${key}":`, error);
    }
  },

  /**
   * Clear all values from localStorage
   */
  clear: function() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
};

// Make the helper available globally
window.StorageHelper = StorageHelper; 
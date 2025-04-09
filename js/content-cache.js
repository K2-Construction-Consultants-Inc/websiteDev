/**
 * Content Cache System
 * Provides efficient caching of content JSON data to avoid repeated fetches
 * and potential issues with browser extensions
 */

const ContentCache = {
  // In-memory cache for content
  cache: {},
  
  /**
   * Load content JSON from a file with caching
   * @param {string} contentFilePath - Path to the JSON file
   * @param {Function} callback - Callback function to receive the data
   * @param {boolean} forceRefresh - Whether to force a refresh from server
   */
  loadContent: function(contentFilePath, callback, forceRefresh = false) {
    const cacheKey = `content_cache_${contentFilePath}`;
    
    // Try to get from memory cache first
    if (!forceRefresh && this.cache[contentFilePath]) {
      console.log(`Using memory cache for ${contentFilePath}`);
      callback(this.cache[contentFilePath]);
      return;
    }
    
    // Then try localStorage if available
    if (!forceRefresh && window.StorageHelper) {
      const cachedData = StorageHelper.get(cacheKey);
      if (cachedData) {
        console.log(`Using localStorage cache for ${contentFilePath}`);
        this.cache[contentFilePath] = cachedData; // Update memory cache
        callback(cachedData);
        return;
      }
    }
    
    // Otherwise fetch from server
    console.log(`Fetching content from ${contentFilePath}`);
    fetch(contentFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Get as text first to avoid potential JSON parse issues
      })
      .then(text => {
        // Parse JSON safely
        try {
          const data = JSON.parse(text);
          
          // Store in memory cache
          this.cache[contentFilePath] = data;
          
          // Store in localStorage if available
          if (window.StorageHelper) {
            StorageHelper.set(cacheKey, data);
          }
          
          // Call the callback with the data
          callback(data);
        } catch (error) {
          console.error(`Error parsing JSON from ${contentFilePath}:`, error);
          console.log("Raw content that failed to parse:", text.substring(0, 100) + "...");
          callback(null);
        }
      })
      .catch(error => {
        console.error(`Error fetching content from ${contentFilePath}:`, error);
        callback(null);
      });
  },
  
  /**
   * Clear all cached content
   */
  clearCache: function() {
    this.cache = {};
    if (window.StorageHelper) {
      // Clear only content cache keys
      Object.keys(localStorage)
        .filter(key => key.startsWith('content_cache_'))
        .forEach(key => StorageHelper.remove(key));
    }
  }
};

// Make the cache available globally
window.ContentCache = ContentCache; 
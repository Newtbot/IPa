/**
 * Cache Manager - In-memory caching with TTL
 * Handles expiration and cleanup of cached data
 */

class CacheManager {
    constructor(ttlSeconds = 3600) {
        this.cache = new Map();
        this.ttl = ttlSeconds * 1000; // Convert to milliseconds
    }

    /**
     * Get item from cache
     * @param {string} key - Cache key
     * @returns {any|null} - Cached value or null if expired/not found
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        
        item.hits++;
        return item.value;
    }

    /**
     * Set item in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} customTtl - Optional custom TTL in seconds
     */
    set(key, value, customTtl = null) {
        const ttl = (customTtl || this.ttl);
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttl,
            hits: 0,
            createdAt: Date.now()
        });
    }

    /**
     * Delete item from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    stats() {
        const items = [];
        this.cache.forEach((item, key) => {
            items.push({
                key,
                hits: item.hits,
                ageMs: Date.now() - item.createdAt,
                expiresIn: item.expiresAt - Date.now()
            });
        });
        
        return {
            size: this.cache.size,
            items
        };
    }
}

module.exports = CacheManager;

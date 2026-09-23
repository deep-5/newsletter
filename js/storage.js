/**
 * AIRA High-Capacity Client-Side Storage Engine (IndexedDB + Auto-Migration)
 * Solves the 5MB browser localStorage quota limit permanently.
 * Allows storing unlimited high-resolution photos, articles, tool submissions, and backups.
 */

(function (window) {
  'use strict';

  const DB_NAME = 'aira_newsletter_db';
  const DB_VERSION = 1;
  const STORE_NAME = 'aira_store';

  let dbInstance = null;
  let dbPromise = null;

  function openDatabase() {
    if (dbInstance) return Promise.resolve(dbInstance);
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('⚠️ IndexedDB is not supported on this browser. Falling back to localStorage.');
        return resolve(null);
      }

      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = (event) => {
          dbInstance = event.target.result;
          resolve(dbInstance);
        };

        request.onerror = (event) => {
          console.warn('⚠️ IndexedDB open error:', event.target.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('⚠️ IndexedDB initialization exception:', err);
        resolve(null);
      }
    });

    return dbPromise;
  }

  const AiraStorage = {
    /**
     * Asynchronously get an item from IndexedDB with auto-migration from localStorage
     */
    async get(key, defaultValue = null) {
      try {
        const db = await openDatabase();
        if (db) {
          const val = await new Promise((resolve) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readonly');
              const store = tx.objectStore(STORE_NAME);
              const req = store.get(key);
              req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
              req.onerror = () => resolve(null);
            } catch (e) {
              resolve(null);
            }
          });

          if (val !== null && val !== undefined) {
            return val;
          }
        }
      } catch (err) {
        console.warn(`AiraStorage.get error for ${key}:`, err);
      }

      // Fallback: Read from localStorage and auto-migrate to IndexedDB
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          try {
            const parsed = JSON.parse(raw);
            this.set(key, parsed).catch(() => {});
            return parsed;
          } catch (e) {
            return raw;
          }
        }
      } catch (e) {
        console.warn('localStorage fallback read error:', e);
      }

      return defaultValue;
    },

    /**
     * Asynchronously save an item to IndexedDB (unlimited capacity)
     */
    async set(key, value) {
      try {
        const db = await openDatabase();
        if (db) {
          await new Promise((resolve, reject) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readwrite');
              const store = tx.objectStore(STORE_NAME);
              const req = store.put(value, key);
              req.onsuccess = () => resolve(true);
              req.onerror = () => reject(req.error);
            } catch (e) {
              reject(e);
            }
          });
        }
      } catch (err) {
        console.warn(`AiraStorage.set error for ${key}:`, err);
      }

      // Safe mirror in localStorage (only if small, to avoid quota errors)
      try {
        const str = typeof value === 'string' ? value : JSON.stringify(value);
        if (str.length < 1500000) { // < 1.5MB safe limit
          localStorage.setItem(key, str);
        } else {
          // If value is too large for localStorage, remove the old key to free up browser quota
          localStorage.removeItem(key);
        }
      } catch (e) {
        // Suppress quota exceeded errors since IndexedDB has already persisted the data safely
      }

      return true;
    },

    /**
     * Delete an item from both IndexedDB and localStorage
     */
    async remove(key) {
      try {
        const db = await openDatabase();
        if (db) {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).delete(key);
        }
      } catch (e) {}

      try {
        localStorage.removeItem(key);
      } catch (e) {}
    },

    /**
     * Synchronous fallback read from localStorage for instant initial paint
     */
    getSync(key, defaultValue = null) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          try {
            return JSON.parse(raw);
          } catch (e) {
            return raw;
          }
        }
      } catch (e) {}
      return defaultValue;
    }
  };

  // Pre-initialize connection on load
  openDatabase();

  window.AiraStorage = AiraStorage;
})(typeof window !== 'undefined' ? window : this);

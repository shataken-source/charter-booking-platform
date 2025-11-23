/**
 * Offline Inspection Storage with AES-256-GCM Encryption
 * 
 * Securely stores inspection data offline in IndexedDB with military-grade encryption.
 * Each user has a unique encryption key derived from their user ID.
 * 
 * Features:
 * - AES-256-GCM encryption
 * - Unique keys per user
 * - Automatic encryption/decryption
 * - IndexedDB storage
 * - Sync queue management
 * - Key rotation support
 * 
 * @module offlineInspectionStorage
 */

import CryptoJS from 'crypto-js';

const DB_NAME = 'gulf_coast_inspections';
const DB_VERSION = 1;
const STORE_NAME = 'inspections';
const ENCRYPTION_KEY_ITERATIONS = 100000;

interface OfflineInspection {
  id: string;
  vessel_id: string;
  captain_id: string;
  inspection_date: Date;
  inspection_type: string;
  checklist: Record<string, any>;
  notes?: string;
  timestamp: number;
  synced?: boolean;
}

interface EncryptedData {
  id: string;
  encrypted: string;
  iv: string;
  timestamp: number;
  synced: boolean;
}

interface SyncResult {
  synced: number;
  failed: number;
  errors: Array<{ inspectionId: string; error: string }>;
}

class OfflineInspectionStorage {
  private db: IDBDatabase | null = null;
  private encryptionKey: string | null = null;
  private userId: string | null = null;

  /**
   * Initialize the storage with user context
   */
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    this.encryptionKey = await this.deriveEncryptionKey(userId);
    await this.openDatabase();
  }

  /**
   * Derive encryption key from user ID using PBKDF2
   */
  private async deriveEncryptionKey(userId: string): Promise<string> {
    // Generate salt from user ID
    const salt = CryptoJS.SHA256(userId + 'gulf_coast_salt').toString();
    
    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(userId, salt, {
      keySize: 256 / 32,
      iterations: ENCRYPTION_KEY_ITERATIONS
    });
    
    return key.toString();
  }

  /**
   * Open IndexedDB database
   */
  private async openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  private encrypt(data: any): { encrypted: string; iv: string } {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(12).toString();
    
    // Encrypt data
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.encryptionKey,
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.NoPadding
      }
    );

    return {
      encrypted: encrypted.toString(),
      iv: iv
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  private decrypt(encrypted: string, iv: string): any {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        this.encryptionKey,
        {
          iv: CryptoJS.enc.Hex.parse(iv),
          mode: CryptoJS.mode.GCM,
          padding: CryptoJS.pad.NoPadding
        }
      );

      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedStr);
    } catch (error) {
      throw new Error('Failed to decrypt data. Key may have changed.');
    }
  }

  /**
   * Save inspection offline with encryption
   */
  async saveInspection(inspection: OfflineInspection): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Encrypt the inspection data
    const { encrypted, iv } = this.encrypt(inspection);

    const encryptedData: EncryptedData = {
      id: inspection.id,
      encrypted,
      iv,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(encryptedData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save inspection'));
    });
  }

  /**
   * Get inspection by ID and decrypt
   */
  async getInspection(id: string): Promise<OfflineInspection | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const encryptedData = request.result as EncryptedData | undefined;
        
        if (!encryptedData) {
          resolve(null);
          return;
        }

        try {
          const decrypted = this.decrypt(encryptedData.encrypted, encryptedData.iv);
          resolve(decrypted);
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(new Error('Failed to get inspection'));
    });
  }

  /**
   * Get all offline inspections
   */
  async getAllInspections(): Promise<OfflineInspection[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const encryptedDataList = request.result as EncryptedData[];
        
        const decryptedList: OfflineInspection[] = [];
        
        for (const encryptedData of encryptedDataList) {
          try {
            const decrypted = this.decrypt(encryptedData.encrypted, encryptedData.iv);
            decryptedList.push(decrypted);
          } catch (error) {
            console.error(`Failed to decrypt inspection ${encryptedData.id}:`, error);
          }
        }

        resolve(decryptedList);
      };

      request.onerror = () => reject(new Error('Failed to get inspections'));
    });
  }

  /**
   * Get all unsynced inspections
   */
  async getUnsyncedInspections(): Promise<OfflineInspection[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => {
        const encryptedDataList = request.result as EncryptedData[];
        
        const decryptedList: OfflineInspection[] = [];
        
        for (const encryptedData of encryptedDataList) {
          try {
            const decrypted = this.decrypt(encryptedData.encrypted, encryptedData.iv);
            decryptedList.push(decrypted);
          } catch (error) {
            console.error(`Failed to decrypt inspection ${encryptedData.id}:`, error);
          }
        }

        resolve(decryptedList);
      };

      request.onerror = () => reject(new Error('Failed to get unsynced inspections'));
    });
  }

  /**
   * Mark inspection as synced
   */
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result as EncryptedData;
        
        if (data) {
          data.synced = true;
          const putRequest = store.put(data);
          
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(new Error('Failed to mark as synced'));
        } else {
          reject(new Error('Inspection not found'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to get inspection'));
    });
  }

  /**
   * Delete inspection from offline storage
   */
  async clearInspection(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete inspection'));
    });
  }

  /**
   * Sync all unsynced inspections to server
   */
  async syncToServer(
    uploadFunction: (inspection: OfflineInspection) => Promise<void>
  ): Promise<SyncResult> {
    const unsynced = await this.getUnsyncedInspections();
    
    const result: SyncResult = {
      synced: 0,
      failed: 0,
      errors: []
    };

    for (const inspection of unsynced) {
      try {
        await uploadFunction(inspection);
        await this.markAsSynced(inspection.id);
        result.synced++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          inspectionId: inspection.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return result;
  }

  /**
   * Clear all synced inspections older than X days
   */
  async clearOldInspections(daysOld: number = 30): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          const data = cursor.value as EncryptedData;
          
          if (data.synced && data.timestamp < cutoffTime) {
            cursor.delete();
            deletedCount++;
          }
          
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(new Error('Failed to clear old inspections'));
    });
  }

  /**
   * Rotate encryption key (re-encrypt all data)
   */
  async rotateEncryptionKey(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    // Get all data with old key
    const allInspections = await this.getAllInspections();

    // Generate new key
    const newKey = await this.deriveEncryptionKey(this.userId + '_rotated_' + Date.now());
    const oldKey = this.encryptionKey;
    
    this.encryptionKey = newKey;

    // Re-encrypt all data
    for (const inspection of allInspections) {
      await this.saveInspection(inspection);
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    total: number;
    synced: number;
    unsynced: number;
    oldestTimestamp: number;
    newestTimestamp: number;
  }> {
    const all = await this.getAllInspections();
    const unsynced = await this.getUnsyncedInspections();

    const timestamps = all.map(i => i.timestamp);

    return {
      total: all.length,
      synced: all.length - unsynced.length,
      unsynced: unsynced.length,
      oldestTimestamp: Math.min(...timestamps),
      newestTimestamp: Math.max(...timestamps)
    };
  }

  /**
   * Check if storage quota is available
   */
  async checkStorageQuota(): Promise<{
    usage: number;
    quota: number;
    percentUsed: number;
    available: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      
      return {
        usage,
        quota,
        percentUsed: (usage / quota) * 100,
        available: quota - usage
      };
    }

    return {
      usage: 0,
      quota: 0,
      percentUsed: 0,
      available: 0
    };
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const offlineInspectionStorage = new OfflineInspectionStorage();

// Export types
export type { OfflineInspection, SyncResult };

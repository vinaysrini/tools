import { StorageMonitor, StorageInfo } from './storageMonitor';
import { db } from '../db/database';

// Expose storage monitoring functions to global window object for console access
declare global {
  interface Window {
    storageUtils: {
      getStorageInfo: (forceRefresh?: boolean) => Promise<StorageInfo>;
      formatBytes: (bytes: number) => string;
      clearAllData: () => Promise<void>;
      getLargestFiles: (limit?: number) => Promise<Array<{ id: string; size: number; mime: string; createdAt: number }>>;
      clearCache: () => void;
      debugDatabase: () => Promise<{ drawings: any[]; files: any[] } | null>;
    };
  }
}

// Initialize global storage utilities
window.storageUtils = {
  async getStorageInfo(forceRefresh = false) {
    return await StorageMonitor.getStorageInfo(forceRefresh);
  },
  
  formatBytes(bytes: number) {
    return StorageMonitor.formatBytes(bytes);
  },
  
  async clearAllData() {
    return await StorageMonitor.clearAllData();
  },
  
  async getLargestFiles(limit: number = 10) {
    return await StorageMonitor.getLargestFiles(limit);
  },
  
  clearCache() {
    StorageMonitor.clearCache();
  },
  
  // Debug method to check database contents
  async debugDatabase() {
    try {
      const drawings = await db.drawings.toArray();
      const files = await db.files.toArray();
      console.log('Database contents:');
      console.log('Drawings:', drawings.length, drawings);
      console.log('Files:', files.length, files);
      return { drawings, files };
    } catch (error) {
      console.error('Error debugging database:', error);
      return null;
    }
  }
};

// Add helpful console messages
console.log('💾 Storage utilities available!');
console.log('Available commands:');
console.log('  • storageUtils.getStorageInfo() - Get detailed storage information');
console.log('  • storageUtils.getStorageInfo(true) - Force refresh storage info');
console.log('  • storageUtils.formatBytes(1234567) - Format bytes to human readable');
console.log('  • storageUtils.getLargestFiles(5) - Get 5 largest files');
console.log('  • storageUtils.clearAllData() - Clear all stored data');
console.log('  • storageUtils.clearCache() - Clear storage info cache');
console.log('  • storageUtils.debugDatabase() - Debug database contents');
console.log('');
console.log('Example: await storageUtils.getStorageInfo()');

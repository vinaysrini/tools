import { db } from '../db/database';

export interface StorageInfo {
  totalSize: number;
  drawingsCount: number;
  filesCount: number;
  drawingsSize: number;
  filesSize: number;
  quota: number;
  usage: number;
  usagePercentage: number;
  lastUpdated: number;
}

export class StorageMonitor {
  private static cache: StorageInfo | null = null;
  private static lastCacheTime = 0;
  private static readonly CACHE_DURATION = 5000; // 5 seconds cache

  static async getStorageInfo(forceRefresh = false): Promise<StorageInfo> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (!forceRefresh && this.cache && (now - this.lastCacheTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      // Get storage quota information (this is more accurate for IndexedDB)
      const quota = await navigator.storage?.estimate?.() || { quota: 0, usage: 0 };
      
      // Count records
      const drawingsCount = await db.drawings.count();
      const filesCount = await db.files.count();
      
      // Calculate sizes more efficiently
      let drawingsSize = 0;
      let filesSize = 0;
      
      // Use cursor-based approach for better performance
      await db.drawings.each(drawing => {
        drawingsSize += JSON.stringify(drawing).length;
      });
      
      await db.files.each(file => {
        filesSize += file.data.size;
      });
      
      const totalSize = drawingsSize + filesSize;
      
      // For IndexedDB, the usage from navigator.storage.estimate() might not be accurate
      // We'll use our calculated totalSize as a more reliable measure
      const usagePercentage = quota.quota ? (totalSize / quota.quota) * 100 : 0;
      
      const result: StorageInfo = {
        totalSize,
        drawingsCount,
        filesCount,
        drawingsSize,
        filesSize,
        quota: quota.quota || 0,
        usage: totalSize, // Use our calculated size instead of quota.usage
        usagePercentage,
        lastUpdated: now
      };
      
      // Cache the result
      this.cache = result;
      this.lastCacheTime = now;
      
      return result;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalSize: 0,
        drawingsCount: 0,
        filesCount: 0,
        drawingsSize: 0,
        filesSize: 0,
        quota: 0,
        usage: 0,
        usagePercentage: 0,
        lastUpdated: now
      };
    }
  }
  
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  static async clearAllData(): Promise<void> {
    try {
      await db.drawings.clear();
      await db.files.clear();
      // Clear cache after clearing data
      this.cache = null;
      this.lastCacheTime = 0;
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
  
  static async getLargestFiles(limit: number = 10): Promise<Array<{ id: string; size: number; mime: string; createdAt: number }>> {
    try {
      const files = await db.files.toArray();
      return files
        .map(file => ({
          id: file.id,
          size: file.data.size,
          mime: file.mime,
          createdAt: file.createdAt
        }))
        .sort((a, b) => b.size - a.size)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting largest files:', error);
      return [];
    }
  }
  
  // Method to clear cache (useful for manual refresh)
  static clearCache(): void {
    this.cache = null;
    this.lastCacheTime = 0;
  }
}

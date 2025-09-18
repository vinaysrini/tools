import { LocalStorageProvider } from './LocalStorageProvider';
import { GoogleDriveProvider } from './GoogleDriveProvider';
import type { StorageProvider, StorageProviderType, StorageConfig } from './types';

export class StorageManager {
  private static instance: StorageManager;
  private currentProvider: StorageProvider;
  private config: StorageConfig;

  private constructor() {
    // Load config from localStorage or use default
    this.config = this.loadConfig();
    // Always start with local storage to avoid initialization issues
    this.currentProvider = new LocalStorageProvider();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private loadConfig(): StorageConfig {
    const saved = localStorage.getItem('excalidraw-storage-config');
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved);
        // Merge with hardcoded credentials (fallback to environment variables)
        parsedConfig.googleDrive = {
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || parsedConfig.googleDrive?.clientId || '1098880556230-3t52mejp48hm0aton2cpvmvvsupl21m4.apps.googleusercontent.com',
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY || parsedConfig.googleDrive?.apiKey || 'AIzaSyALnzeEw5vNnBkXhzFs3HmpM2DfyTYYAaw'
        };
        return parsedConfig;
      } catch (error) {
        console.warn('Failed to parse storage config:', error);
      }
    }

    // Default configuration - hardcoded credentials
    return {
      provider: 'local',
      googleDrive: {
        clientId: '1098880556230-3t52mejp48hm0aton2cpvmvvsupl21m4.apps.googleusercontent.com',
        apiKey: 'AIzaSyALnzeEw5vNnBkXhzFs3HmpM2DfyTYYAaw'
      }
    };
  }

  private saveConfig(): void {
    localStorage.setItem('excalidraw-storage-config', JSON.stringify(this.config));
  }

  private createProvider(type: StorageProviderType): StorageProvider {
    switch (type) {
      case 'local':
        return new LocalStorageProvider();
      case 'googledrive':
        if (!this.config.googleDrive?.clientId || !this.config.googleDrive?.apiKey) {
          throw new Error('Google Drive configuration is missing. Please configure your Google API credentials in the storage settings.');
        }
        return new GoogleDriveProvider(
          this.config.googleDrive.clientId,
          this.config.googleDrive.apiKey
        );
      default:
        throw new Error(`Unknown storage provider: ${type}`);
    }
  }

  async switchProvider(type: StorageProviderType, migrate: boolean = false): Promise<void> {
    if (this.config.provider === type) {
      return; // Already using this provider
    }

    const oldProvider = this.currentProvider;
    const newProvider = this.createProvider(type);

    // Initialize new provider
    await newProvider.initialize();

    // For Google Drive, check if authenticated before switching
    if (type === 'googledrive') {
      const isAuth = await newProvider.isAuthenticated();
      if (!isAuth) {
        throw new Error('Please authenticate with Google Drive before switching to this provider.');
      }
    }

    // If migration is requested, copy data from old to new provider
    if (migrate) {
      await this.migrateData(oldProvider, newProvider);
    }

    // Switch to new provider
    this.currentProvider = newProvider;
    this.config.provider = type;
    this.saveConfig();
  }

  private async migrateData(from: StorageProvider, to: StorageProvider): Promise<void> {
    try {
      console.log('Starting data migration...');
      
      // Get all drawings from old provider
      const drawings = await from.getAllDrawings();
      
      for (const drawing of drawings) {
        // Get associated files
        const files = await from.getFiles(drawing.fileIds);
        
        // Save files to new provider
        await to.saveFiles(files);
        
        // Create drawing in new provider
        await to.createDrawing(drawing.title, drawing.elements, drawing.appState);
      }
      
      console.log(`Migrated ${drawings.length} drawings successfully`);
    } catch (error) {
      console.error('Migration failed:', error);
      throw new Error('Failed to migrate data between storage providers');
    }
  }

  getProvider(): StorageProvider {
    return this.currentProvider;
  }

  getCurrentProviderType(): StorageProviderType {
    return this.config.provider;
  }

  getConfig(): StorageConfig {
    return { ...this.config };
  }

  createProviderInstance(type: StorageProviderType): StorageProvider {
    return this.createProvider(type);
  }

  async updateGoogleDriveConfig(clientId: string, apiKey: string): Promise<void> {
    this.config.googleDrive = { clientId, apiKey };
    this.saveConfig();
    
    // If currently using Google Drive, recreate the provider
    if (this.config.provider === 'googledrive') {
      this.currentProvider = this.createProvider('googledrive');
      await this.currentProvider.initialize();
    }
  }

  async initialize(): Promise<void> {
    // Always initialize with local storage first
    await this.currentProvider.initialize();
    
    // If config says Google Drive but we started with local, try to switch
    if (this.config.provider === 'googledrive' && this.config.googleDrive?.clientId && this.config.googleDrive?.apiKey) {
      try {
        const googleProvider = this.createProvider('googledrive');
        await googleProvider.initialize();
        this.currentProvider = googleProvider;
        console.log('Successfully switched to Google Drive storage');
      } catch (error) {
        console.warn('Google Drive initialization failed, staying with local storage:', error);
        // Update config to reflect actual provider
        this.config.provider = 'local';
        this.saveConfig();
      }
    } else if (this.config.provider === 'googledrive') {
      console.warn('Google Drive credentials missing, using local storage');
      // Update config to reflect actual provider
      this.config.provider = 'local';
      this.saveConfig();
    }
  }

  // Convenience methods that delegate to current provider
  async getAllDrawings() {
    return this.currentProvider.getAllDrawings();
  }

  async getDrawing(id: string) {
    return this.currentProvider.getDrawing(id);
  }

  async createDrawing(title: string, elements?: any[], appState?: any) {
    return this.currentProvider.createDrawing(title, elements, appState);
  }

  async updateDrawing(id: string, updates: any) {
    return this.currentProvider.updateDrawing(id, updates);
  }

  async deleteDrawing(id: string) {
    return this.currentProvider.deleteDrawing(id);
  }

  async duplicateDrawing(id: string) {
    return this.currentProvider.duplicateDrawing(id);
  }

  async searchDrawings(query: string) {
    return this.currentProvider.searchDrawings(query);
  }

  async saveFiles(files: any) {
    return this.currentProvider.saveFiles(files);
  }

  async getFiles(fileIds: string[]) {
    return this.currentProvider.getFiles(fileIds);
  }

  async deleteFiles(fileIds: string[]) {
    return this.currentProvider.deleteFiles(fileIds);
  }
}

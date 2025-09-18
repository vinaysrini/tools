import type { Drawing, StorageProvider } from './types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export class GoogleDriveProvider implements StorageProvider {
  private clientId: string;
  private apiKey: string;
  private isInitialized = false;
  private folderId: string | null = null;
  private readonly FOLDER_NAME = 'Custom Excalidraw';
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';

  constructor(clientId: string, apiKey: string) {
    this.clientId = clientId;
    this.apiKey = apiKey;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Google APIs with timeout
      await Promise.race([
        this.loadGoogleAPIs(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Google APIs loading timeout')), 10000)
        )
      ]);
      
      // Wait for gapi to be ready with timeout
      await Promise.race([
        new Promise<void>((resolve) => {
          window.gapi.load('auth2:client', resolve);
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GAPI loading timeout')), 5000)
        )
      ]);

      // Check if auth2 is already initialized
      try {
        window.gapi.auth2.getAuthInstance();
      } catch (e) {
        // Not initialized yet, initialize it
        await window.gapi.auth2.init({
          client_id: this.clientId,
        });
      }

      // Initialize the client with timeout
      await Promise.race([
        window.gapi.client.init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          discoveryDocs: [this.DISCOVERY_DOC],
          scope: this.SCOPES
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Client initialization timeout')), 10000)
        )
      ]);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      
      // Check for specific error types
      if (error && typeof error === 'object' && 'error' in error) {
        const gApiError = error as any;
        if (gApiError.error === 'idpiframe_initialization_failed') {
          throw new Error('Google OAuth configuration error: Please add your domain to authorized JavaScript origins in Google Cloud Console. Go to Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs > Add http://localhost:3000 to "Authorized JavaScript origins"');
        }
      }
      
      // Handle network errors (502, timeouts, etc.)
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('502') || error.message.includes('Bad Gateway')) {
          throw new Error('Google APIs are currently unavailable (network error). Please try again later or check your internet connection.');
        }
        throw new Error(`Google Drive setup failed: ${error.message}`);
      }
      
      throw new Error('Google Drive API initialization failed: Unknown error');
    }
  }

  private async loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google APIs'));
      document.head.appendChild(script);
    });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      if (!this.isInitialized) await this.initialize();
      if (!window.gapi || !window.gapi.auth2) return false;
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) return false;
      
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  async authenticate(): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    const authInstance = window.gapi.auth2.getAuthInstance();
    
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    // Ensure we have the app folder
    await this.ensureAppFolder();
  }

  async disconnect(): Promise<void> {
    if (!this.isInitialized) return;
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
    }
    this.folderId = null;
  }

  getProviderName(): string {
    return 'Google Drive';
  }

  private async ensureAppFolder(): Promise<void> {
    if (this.folderId) return;

    if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
      throw new Error('Google Drive API not properly initialized');
    }

    try {
      // Search for existing folder
      const response = await window.gapi.client.drive.files.list({
        q: `name='${this.FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)'
      });

      if (response.result.files && response.result.files.length > 0) {
        this.folderId = response.result.files[0].id;
      } else {
        // Create folder
        const folderResponse = await window.gapi.client.drive.files.create({
          resource: {
            name: this.FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder'
          },
          fields: 'id'
        });
        this.folderId = folderResponse.result.id;
      }
    } catch (error) {
      console.error('Error ensuring app folder:', error);
      throw new Error('Failed to access Google Drive. Please check your authentication.');
    }
  }

  async getAllDrawings(): Promise<Drawing[]> {
    await this.ensureAppFolder();
    
    const response = await window.gapi.client.drive.files.list({
      q: `'${this.folderId}' in parents and name contains '.excalidraw.json' and trashed=false`,
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'modifiedTime desc'
    });

    const drawings: Drawing[] = [];
    for (const file of response.result.files) {
      try {
        const drawing = await this.getDrawingFromFile(file.id);
        if (drawing) {
          drawings.push(drawing);
        }
      } catch (error) {
        console.warn(`Failed to load drawing ${file.name}:`, error);
      }
    }

    return drawings;
  }

  private async getDrawingFromFile(fileId: string): Promise<Drawing | null> {
    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      return JSON.parse(response.body);
    } catch (error) {
      console.error('Failed to get drawing from file:', error);
      return null;
    }
  }

  async getDrawing(id: string): Promise<Drawing | undefined> {
    const drawings = await this.getAllDrawings();
    return drawings.find(d => d.id === id);
  }

  async createDrawing(title: string, elements: ExcalidrawElement[] = [], appState: Partial<AppState> = {}): Promise<Drawing> {
    await this.ensureAppFolder();

    const now = Date.now();
    const drawing: Drawing = {
      id: crypto.randomUUID(),
      title,
      createdAt: now,
      updatedAt: now,
      elements: elements,
      appState: {
        viewBackgroundColor: '#ffffff',
        currentItemStrokeWidth: 1,
        currentItemStrokeColor: '#1e1e1e',
        currentItemBackgroundColor: 'transparent',
        currentItemFillStyle: 'hachure',
        currentItemOpacity: 100,
        currentItemFontFamily: 1,
        currentItemFontSize: 20,
        currentItemTextAlign: 'left',
        currentItemStrokeStyle: 'solid',
        currentItemRoughness: 1,
        currentItemStartArrowhead: null,
        currentItemEndArrowhead: null,
        currentItemRoundness: null,
        ...appState
      } as AppState,
      fileIds: []
    };

    await this.saveDrawingToFile(drawing);
    return drawing;
  }

  private async saveDrawingToFile(drawing: Drawing): Promise<void> {
    const fileName = `${drawing.title}.${drawing.id}.excalidraw.json`;
    const content = JSON.stringify(drawing, null, 2);

    const metadata = {
      name: fileName,
      parents: [this.folderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'application/json' }));

    await fetch('https://www.googleapis.com/upload/drive/v3/files', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
      }),
      body: form
    });
  }

  async updateDrawing(id: string, updates: Partial<Drawing>): Promise<void> {
    const drawing = await this.getDrawing(id);
    if (!drawing) {
      throw new Error('Drawing not found');
    }

    const updatedDrawing = {
      ...drawing,
      ...updates,
      updatedAt: Date.now()
    };

    // Find and update the file
    await this.ensureAppFolder();
    const response = await window.gapi.client.drive.files.list({
      q: `'${this.folderId}' in parents and name contains '${id}.excalidraw.json' and trashed=false`,
      fields: 'files(id)'
    });

    if (response.result.files.length > 0) {
      const fileId = response.result.files[0].id;
      const content = JSON.stringify(updatedDrawing, null, 2);

      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, {
        method: 'PATCH',
        headers: new Headers({
          'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
          'Content-Type': 'application/json'
        }),
        body: content
      });
    }
  }

  async deleteDrawing(id: string): Promise<void> {
    await this.ensureAppFolder();
    
    // Find the drawing file
    const response = await window.gapi.client.drive.files.list({
      q: `'${this.folderId}' in parents and name contains '${id}.excalidraw.json' and trashed=false`,
      fields: 'files(id)'
    });

    if (response.result.files.length > 0) {
      const fileId = response.result.files[0].id;
      await window.gapi.client.drive.files.delete({
        fileId: fileId
      });
    }

    // Also delete associated files
    const drawing = await this.getDrawing(id);
    if (drawing) {
      await this.deleteFiles(drawing.fileIds);
    }
  }

  async duplicateDrawing(id: string): Promise<Drawing> {
    const original = await this.getDrawing(id);
    if (!original) {
      throw new Error('Drawing not found');
    }

    const now = Date.now();
    const newId = crypto.randomUUID();
    
    const duplicated: Drawing = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: now,
      updatedAt: now
    };

    // For simplicity, we'll reference the same files (Google Drive handles this well)
    // In a more robust implementation, you might want to duplicate the files too
    
    await this.saveDrawingToFile(duplicated);
    return duplicated;
  }

  async searchDrawings(query: string): Promise<Drawing[]> {
    const drawings = await this.getAllDrawings();
    return drawings.filter(drawing => 
      drawing.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  async saveFiles(files: BinaryFiles): Promise<string[]> {
    await this.ensureAppFolder();
    const fileIds: string[] = [];

    for (const [id, file] of Object.entries(files)) {
      try {
        // Convert dataURL to blob
        const response = await fetch((file as any).dataURL);
        const blob = await response.blob();

        const metadata = {
          name: `file_${id}`,
          parents: [this.folderId]
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        await fetch('https://www.googleapis.com/upload/drive/v3/files', {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
          }),
          body: form
        });

        fileIds.push(id);
      } catch (error) {
        console.error(`Failed to save file ${id}:`, error);
      }
    }

    return fileIds;
  }

  async getFiles(fileIds: string[]): Promise<BinaryFiles> {
    await this.ensureAppFolder();
    const files: BinaryFiles = {};

    for (const fileId of fileIds) {
      try {
        const response = await window.gapi.client.drive.files.list({
          q: `'${this.folderId}' in parents and name='file_${fileId}' and trashed=false`,
          fields: 'files(id)'
        });

        if (response.result.files.length > 0) {
          const driveFileId = response.result.files[0].id;
          const fileResponse = await window.gapi.client.drive.files.get({
            fileId: driveFileId,
            alt: 'media'
          });

          // Convert response to blob and create dataURL
          const blob = new Blob([fileResponse.body]);
          const dataURL = URL.createObjectURL(blob);

          files[fileId as any] = {
            id: fileId as any,
            dataURL: dataURL as any,
            mimeType: blob.type as any,
            created: Date.now(),
            lastRetrieved: Date.now()
          };
        }
      } catch (error) {
        console.error(`Failed to get file ${fileId}:`, error);
      }
    }

    return files;
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    await this.ensureAppFolder();

    for (const fileId of fileIds) {
      try {
        const response = await window.gapi.client.drive.files.list({
          q: `'${this.folderId}' in parents and name='file_${fileId}' and trashed=false`,
          fields: 'files(id)'
        });

        if (response.result.files.length > 0) {
          const driveFileId = response.result.files[0].id;
          await window.gapi.client.drive.files.delete({
            fileId: driveFileId
          });
        }
      } catch (error) {
        console.error(`Failed to delete file ${fileId}:`, error);
      }
    }
  }
}

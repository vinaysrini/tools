import { db } from '../db/database';
import type { Drawing, FileRecord, StorageProvider } from './types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

export class LocalStorageProvider implements StorageProvider {
  async initialize(): Promise<void> {
    // IndexedDB is automatically initialized by Dexie
  }

  async isAuthenticated(): Promise<boolean> {
    return true; // Local storage doesn't require authentication
  }

  async authenticate(): Promise<void> {
    // No authentication needed for local storage
  }

  async disconnect(): Promise<void> {
    // No disconnection needed for local storage
  }

  getProviderName(): string {
    return 'Local Storage';
  }

  async getAllDrawings(): Promise<Drawing[]> {
    return await db.drawings.orderBy('updatedAt').reverse().toArray();
  }

  async getDrawing(id: string): Promise<Drawing | undefined> {
    return await db.drawings.get(id);
  }

  async createDrawing(title: string, elements: ExcalidrawElement[] = [], appState: Partial<AppState> = {}): Promise<Drawing> {
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
    
    await db.drawings.add(drawing);
    return drawing;
  }

  async updateDrawing(id: string, updates: Partial<Drawing>): Promise<void> {
    const now = Date.now();
    await db.drawings.update(id, {
      ...updates,
      updatedAt: now
    });
  }

  async deleteDrawing(id: string): Promise<void> {
    const drawing = await this.getDrawing(id);
    if (drawing) {
      // Delete associated files
      for (const fileId of drawing.fileIds) {
        await db.files.delete(fileId);
      }
      // Delete drawing
      await db.drawings.delete(id);
    }
  }

  async duplicateDrawing(id: string): Promise<Drawing> {
    const original = await this.getDrawing(id);
    if (!original) {
      throw new Error('Drawing not found');
    }

    const now = Date.now();
    const newId = crypto.randomUUID();
    
    // Duplicate the drawing
    const duplicated: Drawing = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: now,
      updatedAt: now
    };

    // Duplicate associated files
    const newFileIds: string[] = [];
    for (const fileId of original.fileIds) {
      const file = await db.files.get(fileId);
      if (file) {
        const newFileId = crypto.randomUUID();
        await db.files.add({
          ...file,
          id: newFileId,
          createdAt: now
        });
        newFileIds.push(newFileId);
      }
    }
    
    duplicated.fileIds = newFileIds;
    await db.drawings.add(duplicated);
    return duplicated;
  }

  async searchDrawings(query: string): Promise<Drawing[]> {
    const drawings = await this.getAllDrawings();
    return drawings.filter(drawing => 
      drawing.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  async saveFiles(files: BinaryFiles): Promise<string[]> {
    const fileIds: string[] = [];
    const now = Date.now();

    for (const [id, file] of Object.entries(files)) {
      const fileRecord: FileRecord = {
        id,
        data: (file as any).data,
        mime: (file as any).mimeType,
        createdAt: now
      };
    
      await db.files.put(fileRecord);
      fileIds.push(id);
    }

    return fileIds;
  }

  async getFiles(fileIds: string[]): Promise<BinaryFiles> {
    const files: BinaryFiles = {};
    
    for (const fileId of fileIds) {
      const file = await db.files.get(fileId);
      if (file) {
        files[fileId as any] = {
          id: fileId as any,
          dataURL: URL.createObjectURL(file.data) as any,
          mimeType: file.mime as any,
          created: file.createdAt,
          lastRetrieved: Date.now()
        };
      }
    }

    return files;
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    for (const fileId of fileIds) {
      await db.files.delete(fileId);
    }
  }
}

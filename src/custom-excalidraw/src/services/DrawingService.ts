import { StorageManager } from '../storage/StorageManager';
import type { Drawing } from '../storage/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

export class DrawingService {
  private static storageManager = StorageManager.getInstance();

  static async getAllDrawings(): Promise<Drawing[]> {
    return await this.storageManager.getAllDrawings();
  }

  static async getDrawing(id: string): Promise<Drawing | undefined> {
    return await this.storageManager.getDrawing(id);
  }

  static async createDrawing(title: string, elements: ExcalidrawElement[] = [], appState: Partial<AppState> = {}): Promise<Drawing> {
    return await this.storageManager.createDrawing(title, elements, appState);
  }

  static async updateDrawing(id: string, updates: Partial<Drawing>): Promise<void> {
    return await this.storageManager.updateDrawing(id, updates);
  }

  static async deleteDrawing(id: string): Promise<void> {
    return await this.storageManager.deleteDrawing(id);
  }

  static async duplicateDrawing(id: string): Promise<Drawing> {
    return await this.storageManager.duplicateDrawing(id);
  }

  static async searchDrawings(query: string): Promise<Drawing[]> {
    return await this.storageManager.searchDrawings(query);
  }
}

export class FileService {
  private static storageManager = StorageManager.getInstance();

  static async saveFiles(files: BinaryFiles): Promise<string[]> {
    return await this.storageManager.saveFiles(files);
  }

  static async getFiles(fileIds: string[]): Promise<BinaryFiles> {
    return await this.storageManager.getFiles(fileIds);
  }

  static async deleteFiles(fileIds: string[]): Promise<void> {
    return await this.storageManager.deleteFiles(fileIds);
  }
}

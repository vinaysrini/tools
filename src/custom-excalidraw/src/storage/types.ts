import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

export interface Drawing {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  elements: ExcalidrawElement[];
  appState: AppState;
  fileIds: string[];
}

export interface FileRecord {
  id: string;
  data: Blob;
  mime: string;
  createdAt: number;
}

export interface StorageProvider {
  // Drawing operations
  getAllDrawings(): Promise<Drawing[]>;
  getDrawing(id: string): Promise<Drawing | undefined>;
  createDrawing(title: string, elements?: ExcalidrawElement[], appState?: Partial<AppState>): Promise<Drawing>;
  updateDrawing(id: string, updates: Partial<Drawing>): Promise<void>;
  deleteDrawing(id: string): Promise<void>;
  duplicateDrawing(id: string): Promise<Drawing>;
  searchDrawings(query: string): Promise<Drawing[]>;

  // File operations
  saveFiles(files: BinaryFiles): Promise<string[]>;
  getFiles(fileIds: string[]): Promise<BinaryFiles>;
  deleteFiles(fileIds: string[]): Promise<void>;

  // Provider-specific operations
  initialize(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  authenticate(): Promise<void>;
  disconnect(): Promise<void>;
  getProviderName(): string;
}

export type StorageProviderType = 'local' | 'googledrive';

export interface StorageConfig {
  provider: StorageProviderType;
  googleDrive?: {
    clientId: string;
    apiKey: string;
  };
}

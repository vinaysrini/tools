import Dexie, { Table } from 'dexie';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

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

export class CustomExcalidrawDB extends Dexie {
  drawings!: Table<Drawing>;
  files!: Table<FileRecord>;

  constructor() {
    super('CustomExcalidrawDB');
    this.version(1).stores({
      drawings: 'id, title, createdAt, updatedAt',
      files: 'id, mime, createdAt'
    });
  }
}

export const db = new CustomExcalidrawDB();

// Type definitions for Excalidraw elements and state
export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  groupIds: string[];
  frameId: string | null;
  boundElements: Array<{
    id: string;
    type: string;
  }> | null;
  updated: number;
  link: string | null;
  locked: boolean;
  customData?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

export interface AppState {
  viewBackgroundColor: string;
  gridSize: number | null;
  zoom: {
    value: number;
  };
  scrollX: number;
  scrollY: number;
  theme: string;
  selectedElementIds: Record<string, boolean>;
  activeTool: {
    type: string;
    customType: string | null;
    lastActiveTool: any;
    locked: boolean;
  };
  [key: string]: any; // Allow additional properties
}

export interface BinaryFileData {
  id: string;
  dataURL: string;
  mimeType: string;
  created: number;
  lastRetrieved?: number;
}

export interface BinaryFiles {
  [key: string]: BinaryFileData;
}

export interface ExcalidrawImperativeAPI {
  updateScene: (data: { elements: ExcalidrawElement[]; appState: AppState }) => void;
  getFiles: () => Promise<BinaryFiles>;
  addFiles: (files: BinaryFileData[]) => void;
  onChange: (callback: (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => void) => () => void;
  [key: string]: any; // Allow additional methods
}

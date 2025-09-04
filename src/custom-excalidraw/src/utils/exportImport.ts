import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { Drawing } from '../db/database';

export interface ExcalidrawFile {
  type: 'excalidraw';
  version: 2;
  source: string;
  elements: ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

export class ExportImportService {
  static async exportToExcalidraw(drawing: Drawing, files: BinaryFiles): Promise<void> {
    const excalidrawFile: ExcalidrawFile = {
      type: 'excalidraw',
      version: 2,
      source: 'custom-excalidraw',
      elements: drawing.elements,
      appState: drawing.appState,
      files
    };

    const blob = new Blob([JSON.stringify(excalidrawFile, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drawing.title}.excalidraw`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportToPNG(drawing: Drawing, files: BinaryFiles): Promise<void> {
    // This would require the Excalidraw API to generate PNG with embedded scene data
    // For now, we'll create a simple export that includes the scene data in the filename
    const sceneData = btoa(JSON.stringify({
      elements: drawing.elements,
      appState: drawing.appState,
      files: Object.keys(files)
    }));

    // Create a canvas and draw the elements (simplified version)
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw elements (simplified - would need proper Excalidraw rendering)
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText(`Drawing: ${drawing.title}`, 20, 40);
      ctx.fillText(`Elements: ${drawing.elements.length}`, 20, 60);
      ctx.fillText(`Scene data embedded in filename`, 20, 80);
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drawing.title}_scene_${sceneData}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportToSVG(drawing: Drawing, files: BinaryFiles): Promise<void> {
    const sceneData = btoa(JSON.stringify({
      elements: drawing.elements,
      appState: drawing.appState,
      files: Object.keys(files)
    }));

    // Create a simple SVG with embedded scene data
    const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="white"/>
        <text x="20" y="40" font-family="Arial" font-size="16" fill="black">
          Drawing: ${drawing.title}
        </text>
        <text x="20" y="60" font-family="Arial" font-size="16" fill="black">
          Elements: ${drawing.elements.length}
        </text>
        <text x="20" y="80" font-family="Arial" font-size="16" fill="black">
          Scene data embedded in filename
        </text>
        <metadata>
          <scene-data>${sceneData}</scene-data>
        </metadata>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drawing.title}_scene_${sceneData}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async importFromFile(file: File): Promise<{ drawing: Partial<Drawing>; files: BinaryFiles }> {
    if (file.name.endsWith('.excalidraw')) {
      return await this.importFromExcalidraw(file);
    } else if (file.name.endsWith('.png')) {
      return await this.importFromPNG(file);
    } else if (file.name.endsWith('.svg')) {
      return await this.importFromSVG(file);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  private static async importFromExcalidraw(file: File): Promise<{ drawing: Partial<Drawing>; files: BinaryFiles }> {
    const text = await file.text();
    const excalidrawFile: ExcalidrawFile = JSON.parse(text);
    
    if (excalidrawFile.type !== 'excalidraw' || excalidrawFile.version !== 2) {
      throw new Error('Invalid Excalidraw file format');
    }

    return {
      drawing: {
        title: file.name.replace('.excalidraw', ''),
        elements: excalidrawFile.elements,
        appState: excalidrawFile.appState,
        fileIds: []
      },
      files: excalidrawFile.files || {}
    };
  }

  private static async importFromPNG(file: File): Promise<{ drawing: Partial<Drawing>; files: BinaryFiles }> {
    // Extract scene data from filename
    const sceneDataMatch = file.name.match(/_scene_([^.]+)\.png$/);
    if (!sceneDataMatch) {
      throw new Error('No embedded scene data found in PNG filename');
    }

    const sceneData = JSON.parse(atob(sceneDataMatch[1]));
    return {
      drawing: {
        title: file.name.replace(/_scene_[^.]+\.png$/, ''),
        elements: sceneData.elements,
        appState: sceneData.appState,
        fileIds: []
      },
      files: {}
    };
  }

  private static async importFromSVG(file: File): Promise<{ drawing: Partial<Drawing>; files: BinaryFiles }> {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    
    const metadata = doc.querySelector('metadata scene-data');
    if (!metadata) {
      throw new Error('No embedded scene data found in SVG');
    }

    const sceneData = JSON.parse(atob(metadata.textContent!));
    return {
      drawing: {
        title: file.name.replace(/_scene_[^.]+\.svg$/, ''),
        elements: sceneData.elements,
        appState: sceneData.appState,
        fileIds: []
      },
      files: {}
    };
  }
}

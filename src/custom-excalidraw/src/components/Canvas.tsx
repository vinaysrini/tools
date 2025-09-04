import React, { useCallback, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { Drawing } from '../db/database';
import { DrawingService, FileService } from '../db/services';


interface CanvasProps {
  drawing: Drawing | null;
  onDrawingUpdate: (drawing: Drawing) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ drawing, onDrawingUpdate }) => {
  const currentFiles = React.useRef<BinaryFiles>({});
  const [filesLoaded, setFilesLoaded] = React.useState(false);

  const debouncedSave = useCallback(async (elements: ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    if (!drawing) return;

    try {
      // Save files first
      const fileIds = await FileService.saveFiles(files);
      currentFiles.current = files;

      // Update drawing
      await DrawingService.updateDrawing(drawing.id, {
        elements,
        appState,
        fileIds
      });

      // Notify parent of update
      const updatedDrawing = await DrawingService.getDrawing(drawing.id);
      if (updatedDrawing) {
        onDrawingUpdate(updatedDrawing);
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  }, [drawing, onDrawingUpdate]);

  const handleChange = useCallback((
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    debouncedSave([...elements], appState, files);
  }, [debouncedSave]);


  useEffect(() => {
    if (drawing) {
      // Only show loading if drawing has files
      if (drawing.fileIds.length > 0) {
        setFilesLoaded(false);
        // Load files for the drawing
        FileService.getFiles(drawing.fileIds).then(files => {
          currentFiles.current = files;
          setFilesLoaded(true);
        }).catch(error => {
          console.error('Error loading files:', error);
          setFilesLoaded(true);
        });
      } else {
        setFilesLoaded(true);
      }
    } else {
      setFilesLoaded(false);
    }
  }, [drawing]);

  if (!drawing) {
    return (
      <div className="canvas-empty">
        <div className="empty-state">
          <h3>No drawing selected</h3>
          <p>Select a drawing from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  if (!filesLoaded) {
    return (
      <div className="canvas-loading">
        <div className="loading-spinner">Loading drawing...</div>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <div className="canvas-content">
        <Excalidraw
          key={drawing.id}
          initialData={{
            elements: drawing.elements,
            appState: drawing.appState,
            files: currentFiles.current
          }}
          onChange={handleChange}
          handleKeyboardGlobally={false}
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={false}
          theme="light"
          name="custom-excalidraw"
        />
      </div>
    </div>
  );
};

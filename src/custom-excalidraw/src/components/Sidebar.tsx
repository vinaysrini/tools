import React, { useState, useEffect, useRef } from 'react';
import { Drawing } from '../storage/types';
import { DrawingService } from '../services/DrawingService';
import { ExportImportService } from '../utils/exportImport';
import { StorageMonitor, StorageInfo } from '../utils/storageMonitor';

interface SidebarProps {
  drawings: Drawing[];
  selectedDrawingId: string | null;
  onDrawingSelect: (drawing: Drawing) => void;
  onDrawingCreate: (drawing: Drawing) => void;
  onDrawingDelete: (id: string) => void;
  onDrawingDuplicate: (drawing: Drawing) => void;
  onDrawingsUpdate: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onShowStorageSelector: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  drawings,
  selectedDrawingId,
  onDrawingSelect,
  onDrawingCreate,
  onDrawingDelete,
  onDrawingDuplicate,
  onDrawingsUpdate,
  isCollapsed,
  onToggleCollapse,
  onShowStorageSelector
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDrawings, setFilteredDrawings] = useState<Drawing[]>(drawings);
  const [isCreating, setIsCreating] = useState(false);
  const [newDrawingTitle, setNewDrawingTitle] = useState('');
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDrawings(drawings);
    } else {
      const filtered = drawings.filter(drawing =>
        drawing.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrawings(filtered);
    }
  }, [drawings, searchQuery]);

  useEffect(() => {
    // Update storage info when drawings change, but with debouncing
    const timeoutId = setTimeout(() => {
      updateStorageInfo();
    }, 1000); // Wait 1 second after changes before updating

    return () => clearTimeout(timeoutId);
  }, [drawings]);

  // Load storage info on component mount
  useEffect(() => {
    updateStorageInfo();
  }, []);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const updateStorageInfo = async (forceRefresh = false) => {
    try {
      console.log('Updating storage info...');
      const info = await StorageMonitor.getStorageInfo(forceRefresh);
      console.log('Storage info loaded:', info);
      setStorageInfo(info);
    } catch (error) {
      console.error('Error updating storage info:', error);
    }
  };

  const handleCreateDrawing = async () => {
    if (newDrawingTitle.trim()) {
      const drawing = await DrawingService.createDrawing(newDrawingTitle.trim());
      onDrawingCreate(drawing);
      setNewDrawingTitle('');
      setIsCreating(false);
      // Immediately update storage info after creating a new drawing
      await updateStorageInfo(true); // Force refresh
    }
  };

  const handleDuplicateDrawing = async (drawing: Drawing) => {
    const duplicated = await DrawingService.duplicateDrawing(drawing.id);
    onDrawingDuplicate(duplicated);
    // Immediately update storage info after duplicating a drawing
    await updateStorageInfo(true); // Force refresh
  };

  const handleDeleteDrawing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this drawing?')) {
      await DrawingService.deleteDrawing(id);
      onDrawingDelete(id);
      // Immediately update storage info after deleting a drawing
      await updateStorageInfo(true); // Force refresh
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { drawing: importedDrawing, files: importedFiles } = await ExportImportService.importFromFile(file);
        
        // Create the drawing
        await DrawingService.createDrawing(
          importedDrawing.title || file.name,
          importedDrawing.elements || [],
          importedDrawing.appState || {}
        );

        // Add imported files to the drawing
        if (Object.keys(importedFiles).length > 0) {
          // This would need to be implemented in the service layer
          // For now, we'll just create the drawing without files
        }

        onDrawingsUpdate();
        // Immediately update storage info after importing files
        await updateStorageInfo(true); // Force refresh
      } catch (error) {
        console.error('Error importing file:', error);
        alert(`Error importing ${file.name}: ${error}`);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div 
      ref={sidebarRef}
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
    >
      <div className="sidebar-header">
        <h2>Drawings</h2>
        <div className="sidebar-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsCreating(true)}
            title="Create new drawing"
          >
            +
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import file"
          >
            📁
          </button>
          <button
            className="btn btn-secondary"
            onClick={onShowStorageSelector}
            title="Storage settings"
          >
            ⚙️
          </button>
          <button
            className="btn btn-icon"
            onClick={onToggleCollapse}
            title="Toggle sidebar (Tab)"
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search drawings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {isCreating && (
        <div className="create-drawing">
          <input
            type="text"
            placeholder="Drawing title..."
            value={newDrawingTitle}
            onChange={(e) => setNewDrawingTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDrawing()}
            className="create-input"
            autoFocus
          />
          <div className="create-actions">
            <button onClick={handleCreateDrawing} className="btn btn-primary">
              Create
            </button>
            <button onClick={() => setIsCreating(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="drawings-list">
        {filteredDrawings.map((drawing) => (
          <div
            key={drawing.id}
            className={`drawing-item ${selectedDrawingId === drawing.id ? 'selected' : ''}`}
            onClick={() => onDrawingSelect(drawing)}
          >
            <div className="drawing-info">
              <div className="drawing-title">{drawing.title}</div>
              <div className="drawing-date">{formatDate(drawing.updatedAt)}</div>
            </div>
            <div className="drawing-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateDrawing(drawing);
                }}
                className="btn btn-icon"
                title="Duplicate"
              >
                📋
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDrawing(drawing.id);
                }}
                className="btn btn-icon"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple storage summary at bottom */}
      {storageInfo && (
        <div className="storage-summary">
          <div className="summary-item">
            <span>📁 {storageInfo.drawingsCount} drawings</span>
            <span>{StorageMonitor.formatBytes(storageInfo.totalSize)}</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".excalidraw,.png,.svg"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
      
      {!isCollapsed && (
        <div 
          className="sidebar-resize-handle"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};

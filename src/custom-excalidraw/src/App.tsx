import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Drawing } from './db/database';
import { DrawingService } from './db/services';

function App() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadDrawings();
  }, []);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab key to toggle sidebar
      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedDrawingId) {
      const drawing = drawings.find(d => d.id === selectedDrawingId);
      setSelectedDrawing(drawing || null);
    } else {
      setSelectedDrawing(null);
    }
  }, [selectedDrawingId, drawings]);

  const loadDrawings = async () => {
    try {
      const allDrawings = await DrawingService.getAllDrawings();
      setDrawings(allDrawings);
      
      // Select the first drawing if none is selected
      if (allDrawings.length > 0 && !selectedDrawingId) {
        setSelectedDrawingId(allDrawings[0].id);
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawingSelect = (drawing: Drawing) => {
    setSelectedDrawingId(drawing.id);
  };

  const handleDrawingCreate = (drawing: Drawing) => {
    setDrawings(prev => [drawing, ...prev]);
    setSelectedDrawingId(drawing.id);
  };

  const handleDrawingDelete = (id: string) => {
    setDrawings(prev => prev.filter(d => d.id !== id));
    if (selectedDrawingId === id) {
      const remainingDrawings = drawings.filter(d => d.id !== id);
      setSelectedDrawingId(remainingDrawings.length > 0 ? remainingDrawings[0].id : null);
    }
  };

  const handleDrawingDuplicate = (drawing: Drawing) => {
    setDrawings(prev => [drawing, ...prev]);
    setSelectedDrawingId(drawing.id);
  };

  const handleDrawingUpdate = (updatedDrawing: Drawing) => {
    setDrawings(prev => 
      prev.map(d => d.id === updatedDrawing.id ? updatedDrawing : d)
    );
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        drawings={drawings}
        selectedDrawingId={selectedDrawingId}
        onDrawingSelect={handleDrawingSelect}
        onDrawingCreate={handleDrawingCreate}
        onDrawingDelete={handleDrawingDelete}
        onDrawingDuplicate={handleDrawingDuplicate}
        onDrawingsUpdate={loadDrawings}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />
      <Canvas
        drawing={selectedDrawing}
        onDrawingUpdate={handleDrawingUpdate}
      />
    </div>
  );
}

export default App;

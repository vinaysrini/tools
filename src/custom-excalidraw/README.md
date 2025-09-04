# Custom Excalidraw

A single-page web application for creating and managing Excalidraw drawings with local storage. Built with Vite, React, TypeScript, and IndexedDB.

## Features

- 📝 **Create, rename, duplicate, and delete drawings**
- 🔍 **Quick search through drawings**
- 💾 **Autosave to IndexedDB (local-first, no backend required)**
- 📤 **Export to .excalidraw, PNG, and SVG formats**
- 📥 **Import from .excalidraw, PNG, and SVG files**
- 📱 **PWA support for offline use**
- 🐳 **Docker deployment ready**

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Drawing Engine**: @excalidraw/excalidraw
- **Database**: IndexedDB via Dexie
- **PWA**: Vite PWA plugin
- **Deployment**: Docker + Nginx

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Production Build

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. Access the application at http://localhost:8080

### Manual Docker Build

1. Build the Docker image:
```bash
docker build -t custom-excalidraw .
```

2. Run the container:
```bash
docker run -p 8080:80 custom-excalidraw
```

## Usage

### Creating Drawings
- Click the "+" button in the sidebar to create a new drawing
- Enter a title and press Enter or click "Create"

### Managing Drawings
- **Select**: Click on any drawing in the sidebar
- **Search**: Use the search box to filter drawings by title
- **Duplicate**: Click the 📋 icon to create a copy
- **Delete**: Click the 🗑️ icon to remove a drawing

### Import/Export
- **Import**: Click the 📁 button to import .excalidraw, PNG, or SVG files
- **Export**: Use the export buttons in the canvas header to save in different formats

### Offline Use
The application works offline thanks to PWA support. Your drawings are stored locally in IndexedDB.

## Data Model

### Drawings Table
```typescript
{
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  elements: ExcalidrawElement[];
  appState: AppState;
  fileIds: string[];
}
```

### Files Table
```typescript
{
  id: string;
  data: Blob;
  mime: string;
  createdAt: number;
}
```

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Drawing list and management
│   └── Canvas.tsx      # Excalidraw canvas wrapper
├── db/                 # Database layer
│   ├── database.ts     # Dexie configuration
│   └── services.ts     # CRUD operations
├── utils/              # Utilities
│   └── exportImport.ts # Export/import functionality
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Styles
```

### Key Features Implementation

#### Autosave
- Debounced save (600ms) on every change
- Saves elements, appState, and files to IndexedDB
- Uses Excalidraw's `onChange` callback

#### Export/Import
- **.excalidraw**: Standard Excalidraw JSON format
- **PNG/SVG**: Embedded scene data for lossless imports
- File drop support for easy importing

#### PWA
- Service worker for offline functionality
- App manifest for installability
- Automatic updates

## Deployment

### Docker
The application is containerized with Nginx for optimal performance:

- **Multi-stage build** for smaller image size
- **Gzip compression** for faster loading
- **Security headers** for protection
- **Client-side routing** support
- **Static asset caching** for performance

### Environment Variables
- `NODE_ENV`: Set to `production` for optimized builds

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design with touch support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

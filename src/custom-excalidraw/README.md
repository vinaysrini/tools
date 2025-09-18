# Custom Excalidraw

A single-page web application for creating and managing Excalidraw drawings with local storage. Built with Vite, React, TypeScript, and IndexedDB.

## Features

- 📝 **Create, rename, duplicate, and delete drawings**
- 🔍 **Quick search through drawings**
- 💾 **Multiple storage options: Local IndexedDB or Google Drive sync**
- 📤 **Export to .excalidraw, PNG, and SVG formats**
- 📥 **Import from .excalidraw, PNG, and SVG files**
- 📱 **PWA support for offline use**
- 🐳 **Docker deployment ready**

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Drawing Engine**: @excalidraw/excalidraw
- **Storage**: IndexedDB via Dexie + Google Drive API
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

### Storage Options

#### Local Storage (Default)
- Drawings stored locally in your browser's IndexedDB
- Works completely offline
- No setup required

#### Google Drive Sync
- Sync drawings to your Google Drive
- Access from multiple devices
- Requires Google API credentials

### Switching Storage Providers
1. Click the ⚙️ (settings) button in the sidebar
2. Select your preferred storage provider
3. For Google Drive: configure API credentials and authenticate
4. Optionally migrate existing drawings between providers

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

## Configuration

### Google Drive Setup (Optional)

To enable Google Drive sync:

1. **Get Google API Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Drive API
   - Create OAuth 2.0 credentials
   - Get your Client ID and API Key

2. **Configure OAuth Origins (CRITICAL):**
   - In Google Cloud Console, go to APIs & Services > Credentials
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:3000` (for development)
     - Your production domain (if deploying)
   - Under "Authorized redirect URIs", add:
     - `http://localhost:3000` (for development)
     - Your production domain (if deploying)

3. **Configure Credentials:**
   Since this is a pure JavaScript application, you have two options:
   
   **Option A: Hardcode in StorageManager.ts (lines 38-39):**
   ```typescript
   googleDrive: {
     clientId: 'your-google-oauth-client-id',
     apiKey: 'your-google-drive-api-key'
   }
   ```
   
   **Option B: Configure via UI:**
   - Click the ⚙️ settings button in the sidebar
   - Click "Configure API Keys"
   - Enter your credentials

4. **Test the Integration:**
   - Select "Google Drive" in storage settings
   - Authenticate with your Google account
   - Your drawings will sync to Google Drive

### Troubleshooting Google Drive

**"Not a valid origin" Error:**
- Add your domain to "Authorized JavaScript origins" in Google Cloud Console
- Make sure to include the protocol (http:// or https://)

**502 Bad Gateway Errors:**
- Google APIs are temporarily unavailable
- Try again later or check your internet connection
- The app will automatically fall back to local storage

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Drawing list and management
│   ├── Canvas.tsx      # Excalidraw canvas wrapper
│   └── StorageSelector.tsx # Storage provider selection
├── storage/            # Storage abstraction layer
│   ├── types.ts        # Storage interfaces
│   ├── StorageManager.ts # Storage provider manager
│   ├── LocalStorageProvider.ts # IndexedDB implementation
│   └── GoogleDriveProvider.ts # Google Drive implementation
├── services/           # Business logic services
│   └── DrawingService.ts # Drawing operations
├── db/                 # Legacy database layer (IndexedDB)
│   ├── database.ts     # Dexie configuration
│   └── services.ts     # CRUD operations
├── utils/              # Utilities
│   └── exportImport.ts # Export/import functionality
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Styles
```

### Key Features Implementation

#### Storage Architecture
- **Storage Abstraction**: Common interface for different providers
- **Provider Switching**: Runtime switching between local and cloud storage
- **Data Migration**: Automatic migration between storage providers
- **Autosave**: Debounced save (600ms) on every change

#### Local Storage
- Uses IndexedDB via Dexie for local persistence
- Stores drawings and associated files locally
- No network dependency

#### Google Drive Integration
- Stores drawings as JSON files in a dedicated folder
- Handles authentication via Google OAuth 2.0
- Supports file attachments and images
- Automatic conflict resolution

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

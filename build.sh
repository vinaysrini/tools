#!/bin/bash

# Build script for custom-excalidraw
# This script builds the custom-excalidraw project into tools/multi-excalidraw

set -e  # Exit on any error

echo "🔨 Building custom-excalidraw..."

# Navigate to the custom-excalidraw directory
cd "$(dirname "$0")/src/custom-excalidraw"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🏗️  Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: tools/multi-excalidraw"

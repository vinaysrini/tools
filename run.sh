#!/bin/bash

# Run script to serve the tools directory as HTML
# This script starts a simple HTTP server to serve the tools directory

set -e  # Exit on any error

echo "🚀 Starting HTTP server for tools directory..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$SCRIPT_DIR/tools"

# Check if tools directory exists
if [ ! -d "$TOOLS_DIR" ]; then
    echo "❌ Error: tools directory not found at $TOOLS_DIR"
    exit 1
fi

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python not found. Please install Python to run the server."
    exit 1
fi

echo "📁 Serving directory: $TOOLS_DIR"
echo "🌐 Server will be available at: http://localhost:8000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the HTTP server
cd "$TOOLS_DIR"
$PYTHON_CMD -m http.server 8000

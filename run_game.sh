#!/bin/bash

# Thunder Force IV Replica - Server Launch Script

echo "==================================="
echo "Thunder Force IV Replica"
echo "==================================="
echo ""

# Check for Python 3
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    echo "Open your browser at: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
# Check for Python 2
elif command -v python &> /dev/null; then
    echo "Starting server with Python 2..."
    echo "Open your browser at: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
# Check for Node.js
elif command -v node &> /dev/null; then
    echo "Starting server with Node.js..."
    echo "Open your browser at: http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    echo ""
    npx http-server -p 8080
# Check for PHP
elif command -v php &> /dev/null; then
    echo "Starting server with PHP..."
    echo "Open your browser at: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000
else
    echo "No suitable web server found!"
    echo ""
    echo "You can still play the game by:"
    echo "1. Opening index.html directly in your browser"
    echo "2. Installing Python, Node.js, or PHP"
    echo ""
    echo "Or use one of these online services:"
    echo "- Upload to GitHub Pages"
    echo "- Use CodePen, JSFiddle, or similar"
fi 
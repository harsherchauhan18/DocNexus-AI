#!/bin/bash
# Quick Start Script for Document Enhancer Backend

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Document Enhancer and Generator Backend - Quick Setup    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Created .env file - Please edit with your GROQ_API_KEY"
else
    echo "✅ .env file exists"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               Setup Complete!                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your GROQ_API_KEY"
echo "2. Run 'npm test' to test with sample documents"
echo "3. Run 'npm start' to start the API server"
echo "4. Run 'npm run dev' for development with auto-restart"
echo ""
echo "📚 Documentation:"
echo "   - README.md: Project overview and API documentation"
echo "   - TESTING.md: Testing guide with examples"
echo "   - DEVELOPMENT.md: Development guide for extending the system"
echo ""

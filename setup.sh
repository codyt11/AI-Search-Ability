#!/bin/bash

echo "🚀 Setting up AI Readiness Analyzer..."

# Create necessary directories
mkdir -p server/uploads

# Create environment file for server
cat > server/.env << EOL
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration (optional - for advanced analysis features)
OPENAI_API_KEY=

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOL

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Frontend: npm run dev (runs on http://localhost:3000)"
echo "2. Backend: cd server && npm run dev (runs on http://localhost:3001)"
echo ""
echo "📖 Optional: Add your OpenAI API key to server/.env for advanced features"
echo "🎉 Ready to analyze your digital assets!" 
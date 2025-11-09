#!/bin/bash

# Detect environment and set ports accordingly
if [ -n "$REPL_ID" ]; then
  # Running in Replit: backend on 3001, frontend on 5000
  export BACKEND_PORT=3001
  export PORT=5000
  echo "Replit environment detected - Backend: 3001, Frontend: 5000"
else
  # Running locally (VS Code): backend on 3000, frontend on default React port
  export BACKEND_PORT=3000
  # PORT not set - React defaults to 3001 or next available port
  echo "Local environment detected - Backend: 3000, Frontend: React default (3001 or next available)"
fi

# Start backend in the background
cd backend
npm run start:dev &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 3

# Start frontend
cd ../frontend
npm start

# When frontend stops, also stop backend
kill $BACKEND_PID

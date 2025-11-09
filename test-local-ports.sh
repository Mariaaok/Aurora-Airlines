#!/bin/bash
# This script simulates running the app in VS Code (without REPL_ID)
# to verify port configuration for local development

echo "=== Simulating Local Development Environment (VS Code) ==="
echo ""

# Unset REPL_ID to simulate local environment
unset REPL_ID

# Run the environment detection logic from start.sh
if [ -n "$REPL_ID" ]; then
  export BACKEND_PORT=3001
  export PORT=5000
  echo "Replit environment detected - Backend: 3001, Frontend: 5000"
else
  export BACKEND_PORT=3000
  echo "Local environment detected - Backend: 3000, Frontend: React default (3001+)"
fi

echo ""
echo "Environment Variables:"
echo "  BACKEND_PORT=$BACKEND_PORT"
echo "  PORT=${PORT:-React default (3001 or next available)}"
echo ""
echo "Expected behavior in VS Code:"
echo "  - Backend will run on: http://localhost:3000"
echo "  - Frontend will run on: http://localhost:3001 (or next available port)"
echo "  - No port conflicts!"
echo ""
echo "To run in VS Code:"
echo "  1. bash start.sh"
echo "  OR"
echo "  2. Run separately:"
echo "     Terminal 1: cd backend && npm run start:dev"
echo "     Terminal 2: cd frontend && npm start"

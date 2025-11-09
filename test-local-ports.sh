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
  export BACKEND_PORT=5000
  echo "Local environment detected - Backend: 5000, Frontend: 3000 (default)"
fi

echo ""
echo "Environment Variables:"
echo "  BACKEND_PORT=$BACKEND_PORT"
echo "  PORT=${PORT:-3000 (React default)}"
echo ""
echo "Expected behavior in VS Code:"
echo "  - Backend will run on: http://localhost:5000"
echo "  - Frontend will run on: http://localhost:3000"
echo "  - No port conflicts!"
echo ""
echo "To run in VS Code:"
echo "  1. bash start.sh"
echo "  OR"
echo "  2. Run separately:"
echo "     Terminal 1: cd backend && npm run start:dev"
echo "     Terminal 2: cd frontend && npm start"

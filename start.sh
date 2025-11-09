#!/bin/bash

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

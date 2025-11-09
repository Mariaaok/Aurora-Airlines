# Aurora Airlines - Flight Management System

## Overview
Aurora Airlines is a full-stack flight management application built with:
- **Backend**: NestJS (TypeScript) with SQLite database
- **Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: Session-based authentication with Passport.js

This project was imported from GitHub and configured to run in the Replit environment on November 9, 2025.

## Project Structure

```
.
├── backend/              # NestJS backend API
│   ├── src/
│   │   ├── aircrafts/    # Aircraft management
│   │   ├── aircraftTypes/# Aircraft type definitions
│   │   ├── airports/     # Airport data
│   │   ├── auth/         # Authentication & authorization
│   │   ├── employees/    # Employee management
│   │   ├── flights/      # Flight operations
│   │   ├── flightTypes/  # Flight type categories
│   │   ├── userFlights/  # User flight bookings
│   │   └── users/        # User management
│   ├── database.sqlite   # SQLite database
│   └── package.json
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Application pages
│   │   └── services/     # API service layer
│   ├── public/
│   └── package.json
└── start.sh             # Startup script for both services
```

## Current Configuration

### Backend (Port 3001)
- **Host**: localhost
- **Port**: 3001
- **Database**: SQLite (database.sqlite)
- **CORS**: Enabled for all origins
- **Session**: Uses SESSION_SECRET environment variable (falls back to default)

### Frontend (Port 5000)
- **Host**: 0.0.0.0
- **Port**: 5000
- **Proxy**: Configured to accept all hosts (required for Replit)
- **API Endpoint**: http://localhost:3001

## Running the Application

The application uses a single workflow that starts both backend and frontend:

```bash
bash start.sh
```

This script:
1. Starts the backend in development mode (npm run start:dev)
2. Waits 3 seconds for backend initialization
3. Starts the frontend (npm start on port 5000)
4. Handles graceful shutdown

## Features

### Admin Features
- **Aircraft Management**: Manage aircraft fleet
- **Aircraft Types**: Define aircraft configurations and seat layouts
- **Airports**: Manage airport database
- **Employees**: Manage staff members (pilots, crew)
- **Flights**: Schedule and manage flights
- **Flight Types**: Categorize flight types (domestic/international)
- **Reports**: Generate sales and operational reports

### User Features
- **Account Creation**: Register as a new user
- **Flight Booking**: Browse and book available flights
- **My Flights**: View booked flights and status
- **Check-in**: Online check-in functionality
- **Flight Cancellation**: Cancel flights (with time restrictions)

## Database Schema

The application uses SQLite with TypeORM for the following entities:
- Users (customers and admins)
- Employees (pilots, flight attendants)
- Aircrafts & Aircraft Types
- Airports
- Flights & Flight Types
- User Flight Bookings (UserFlights)
- Employee Flight Assignments

## Environment Variables

### Backend
- `SESSION_SECRET`: Secret key for session encryption (optional, has default)

### Frontend
- `PORT`: 5000 (set in .env)
- `HOST`: 0.0.0.0 (set in .env)
- `DANGEROUSLY_DISABLE_HOST_CHECK`: true (required for Replit)

## Deployment

The project is configured for deployment with:
- **Build**: Compiles both backend and frontend
- **Run**: Serves the production-optimized frontend and backend

## Recent Changes (November 9, 2025)

### Setup for Replit Environment
1. Installed Node.js 20 and all dependencies
2. Fixed backend port conflict (5000 → 3001)
3. Updated CORS to accept all origins for Replit proxy
4. Updated all frontend API URLs to use localhost:3001
5. Configured frontend to run on port 5000 with 0.0.0.0 host
6. Created combined startup script for both services
7. Added proper .gitignore files
8. Configured deployment settings

### Port Configuration
- **Frontend**: Port 5000 (exposed to users)
- **Backend**: Port 3001 (internal, accessed by frontend)

## Known Issues

- The application has some ESLint warnings (unused variables) but these don't affect functionality
- The database comes with existing data (database.sqlite already in repo)

## Technologies Used

### Backend
- NestJS 11
- TypeORM
- SQLite
- Passport.js (Local Strategy)
- Express Session
- bcrypt (password hashing)

### Frontend
- React 19
- React Router
- Axios (HTTP client)
- Tailwind CSS
- Radix UI components

## User Preferences

No specific user preferences documented yet.

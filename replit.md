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
- **Host**: 0.0.0.0 (configurable via HOST env variable)
- **Port**: 3001 (configurable via PORT env variable)
- **Database**: SQLite (database.sqlite)
- **CORS**: Enabled for all origins
- **Session**: Uses SESSION_SECRET environment variable (falls back to default)

### Frontend (Port 5000)
- **Host**: 0.0.0.0
- **Port**: 5000
- **Proxy**: Configured to accept all hosts (required for Replit)
- **API Base URL**: Centralized in `src/config.ts` with automatic environment detection:
  - Development: http://localhost:3001
  - Replit deployment: Same origin as frontend
  - Override with REACT_APP_API_URL environment variable if needed

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
- **Flight Search**: Post-login search page with glass morphism design to search for flights
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
- `REACT_APP_API_URL`: Optional - API base URL. If not set, the app automatically detects:
  - Replit environments (uses same origin as frontend)
  - Local development (uses http://localhost:3001)

## Deployment

The project is configured for deployment with:
- **Build**: Compiles both backend and frontend
- **Run**: Serves the production-optimized frontend and backend

## Recent Changes (November 9, 2025)

### Setup for Replit Environment
1. Installed Node.js 20 and all dependencies
2. Fixed backend port conflict (5000 → 3001) and made it configurable
3. Updated CORS to accept all origins for Replit proxy
4. Changed backend to listen on 0.0.0.0 instead of localhost
5. Centralized frontend API configuration in `src/config.ts`
6. Updated all frontend API URLs to use the centralized configuration
7. Configured frontend to run on port 5000 with 0.0.0.0 host
8. Created combined startup script for both services
9. Added proper .gitignore files
10. Configured deployment settings for autoscale

### Flight Search Page Implementation
1. Created FlightSearchPage component (`frontend/src/pages/FlightSearchPage.tsx`) with glass morphism design
2. Implemented search form with From, To, Departure Date, and Return Date fields
3. Added backend API integration to POST search data to `/flights/search` endpoint
4. Updated login flow to redirect regular users to `/search-flights` after successful authentication
5. Added navbar with Aurora Airlines logo and Sign out button with proper session termination
6. Configured aurora background image support with gradient fallback
7. Styled components with rounded corners, shadows, and glass panel effects matching design requirements

### Flight Booking Flow Implementation
1. Updated FlightSearchPage title to "Choose your departure flight:" to clarify the booking flow
2. Created FlightResultsPage (`frontend/src/pages/FlightResultsPage.tsx`) to display search results:
   - Shows list of available flights with flight details (number, aircraft, route, times, duration)
   - Clickable flight cards that navigate to flight details
   - Back navigation to search and empty state handling
3. Created interactive seat selection components:
   - SeatSelector (`frontend/src/components/SeatSelector.tsx`) - Interactive seat map with click-to-select functionality
   - SeatSelectorModal (`frontend/src/components/SeatSelectorModal.tsx`) - Modal wrapper for seat selection
4. Created FlightDetailsPage (`frontend/src/pages/FlightDetailsPage.tsx`) matching the design prototype:
   - Flight route display with from/to information
   - Trip summary card showing departure, arrival, duration, aircraft, and flight number
   - Seat selection section with "Choose your seats" button
   - Selected seats display (e.g., "A4, B4")
   - Continue button with seat selection validation
   - Navigation links for back to results and search for another flight
5. Implemented complete data flow using React Router state to pass flight data and search criteria between pages
6. Added routing configuration for /flight-results and /flight-details pages

### Port Configuration
- **Frontend**: Port 5000 (exposed to users via webview)
- **Backend**: Port 3001 (accessed internally by frontend via localhost)

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

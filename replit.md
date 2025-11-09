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

### Flight Booking Flow Implementation (Round-Trip)
1. Created BookingContext (`frontend/src/contexts/BookingContext.tsx`) to manage booking state:
   - Tracks search criteria, departure flight, return flight, and seat selections
   - Derives passenger count from number of departure seats selected
   - Provides clearBooking function to reset state for new searches
   - Wrapped application in BookingProvider for global state access

2. Implemented FlightSearchPage (`frontend/src/pages/FlightSearchPage.tsx`):
   - Glass morphism design with aurora background
   - Search form with From, To, Departure Date, and Return Date fields
   - Integrates with BookingContext to save search data
   - Clears previous booking state when new search starts
   - Redirects to departure flight results after search

3. Created FlightResultsPage (`frontend/src/pages/FlightResultsPage.tsx`) supporting both departure and return modes:
   - Reusable component that handles both departure and return flight selection
   - Shows "Choose your departure flight:" or "Choose your return flight:" based on mode
   - Displays flight cards with route, times, duration, and aircraft information
   - Clickable flight cards navigate to flight details
   - "Skip return flight and proceed to checkout" button always available on return mode
   - Handles empty state when no flights found
   - Navigation links for back to search

4. Implemented FlightDetailsPage (`frontend/src/pages/FlightDetailsPage.tsx`) supporting both modes:
   - Reusable component for both departure and return flight seat selection
   - Shows flight route, trip summary with all flight details
   - Integrates with SeatSelector for interactive seat selection
   - Displays selected seats (e.g., "A4, B4")
   - Continue button validates seat selection before proceeding
   - Departure mode: Saves flight + seats, auto-searches for return flights
   - Return mode: Saves flight + seats, navigates to checkout
   - Preserves selected seats when navigating back

5. Created seat selection components:
   - SeatSelector (`frontend/src/components/SeatSelector.tsx`) - Interactive seat map with click-to-select
   - SeatSelectorModal (`frontend/src/components/SeatSelectorModal.tsx`) - Modal wrapper
   - Reuses existing SeatMapViewer component for consistency

6. Implemented CheckoutPage (`frontend/src/pages/CheckoutPage.tsx`) with complete payment form:
   - Flight details display with route, dates, times, duration, and flight type
   - Automatic price calculation based on passenger count and flight type (international vs domestic)
   - Base price: $350 per passenger (2x for international flights)
   - Includes both departure and return flights if applicable
   - Complete payment form with validation:
     * Card number (16 digits, auto-formatted with spaces)
     * Name on card (letters only)
     * Expiration date (MM/YY format with auto-formatting)
     * Security number (3-4 digits)
     * Installments dropdown (1, 2, or 3 installments with calculated amounts)
     * Debit/Credit radio buttons
   - Form validation with error messages and visual indicators
   - Confirm button triggers validation before submission
   - Redirects to search if booking data is incomplete

7. Complete booking flow:
   - Search → Departure results → Departure details + seats → Auto-search return
   - Return results (with skip option) → Return details + seats OR Skip
   - Checkout with booking summary and passenger count

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

# Aurora Airlines - Flight Management System

## Overview
Aurora Airlines is a full-stack flight management application designed to streamline flight operations and enhance the customer booking experience. It features robust administration tools for managing aircraft, airports, employees, and flights, alongside a user-friendly interface for flight search, booking, and managing reservations. The system aims to provide a comprehensive solution for modern airline operations, focusing on efficiency, user experience, and scalability.

## User Preferences
No specific user preferences documented yet.

## System Architecture

### UI/UX Decisions
The frontend features a modern design with:
- **Glass morphism**: Applied to the flight search page for a sleek, translucent effect.
- **Aurora Background**: Dynamic background imagery with gradient fallbacks for visual appeal.
- **Component-based Design**: Reusable UI components built with React and styled with Tailwind CSS for consistency and rapid development.
- **Interactive Seat Selection**: Visual seat maps for an intuitive booking experience.
- **Dynamic Forms**: Payment forms dynamically render based on selected payment method.

### Technical Implementations
- **Backend**: Developed with NestJS (TypeScript) utilizing a modular architecture for managing various airline entities (aircrafts, flights, users, etc.).
- **Frontend**: Built with React (TypeScript) and Tailwind CSS, featuring a responsive and interactive user interface.
- **Authentication**: Session-based authentication powered by Passport.js for secure user and administrator access.
- **Database**: SQLite with TypeORM as the ORM for managing relational data.
- **API Communication**: Centralized API configuration in the frontend with automatic environment detection (local vs. Replit deployment).
- **Booking Flow**: A multi-step booking process managed by a React Context, handling flight search, selection (departure/return), seat mapping, passenger information, and secure payment processing.
- **Purchase Management**: Dedicated backend module for handling completed flight purchases, including passenger details, payment method, and status tracking.

### Feature Specifications
- **Admin Features**: Comprehensive management of aircraft fleets, aircraft types, airports, employee records, flight scheduling, and flight type categorization.
- **User Features**:
    - Secure account creation and authentication.
    - Advanced flight search functionality.
    - Multi-leg flight booking (round-trip support).
    - Online check-in and flight cancellation capabilities.
    - "My Flights" section for viewing and managing bookings.
- **Dynamic Payment Gateway**: Supports various payment methods like Credit Card and Bank Slip, with integrated form validation and PDF generation for bank slips.

### System Design Choices
- **Monorepo-like Structure**: Separate `backend` and `frontend` directories managed within a single project.
- **Environment Agnostic Configuration**: Backend and frontend are configured to run seamlessly across different environments (local development, Replit) using environment variables and dynamic API URL resolution.
- **Graceful Shutdown**: The startup script (`start.sh`) ensures both services are initiated correctly and handles shutdown processes.
- **Database Schema**: Robust schema design with TypeORM entities for Users, Employees, Aircrafts, Airports, Flights, User Flight Bookings, and Purchases, including JSON storage for complex data like seats and passenger details.

## External Dependencies

- **NestJS**: Backend framework.
- **React**: Frontend library.
- **TypeORM**: ORM for database interaction.
- **SQLite**: Database.
- **Passport.js**: Authentication middleware.
- **Axios**: HTTP client for frontend API calls.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: UI component library (used in frontend).
- **bcrypt**: Password hashing library.
- **Express Session**: Session management for Node.js.
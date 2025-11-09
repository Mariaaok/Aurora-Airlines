# Port Configuration Guide

This project uses intelligent port detection to work seamlessly in both Replit and local development (VS Code).

## How It Works

### In Replit (Automatic)
When you run the project in Replit, it automatically detects the environment and configures:
- **Backend**: Port 3001
- **Frontend**: Port 5000 (for Replit webview)

### In Local Development / VS Code (Automatic)
When you run the project locally, it automatically uses:
- **Backend**: Port 5000
- **Frontend**: Port 3000 (React default)

## Running the Project

### In Replit
Simply click the "Run" button or use the workflow. Everything is configured automatically.

### In VS Code / Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Run the application**
   
   **Option 1: Use the startup script (recommended)**
   ```bash
   # From project root
   bash start.sh
   ```
   This starts both backend and frontend automatically with correct ports.

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend (runs on port 5000)
   cd backend
   npm run start:dev

   # Terminal 2 - Frontend (runs on port 3000)
   cd frontend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Detection Logic

The `start.sh` script automatically detects the environment:

- **Replit Detection**: Checks for `REPL_ID` environment variable
  - Sets `BACKEND_PORT=3001` and `PORT=5000`
- **Local Detection**: No `REPL_ID` present
  - Sets `BACKEND_PORT=5000` and uses React's default port 3000

## Database

The SQLite database (`backend/database.sqlite`) is included in the repository and works automatically in both environments. No additional configuration needed.

## Troubleshooting

### Port Already in Use
If you see "port already in use" errors:

```bash
# Find and kill the process using the port
# On Linux/Mac:
lsof -ti:5000 | xargs kill -9  # For backend
lsof -ti:3000 | xargs kill -9  # For frontend

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### API Connection Issues
The frontend automatically detects which backend URL to use:
- **Replit**: Uses the same domain (proxied)
- **Local**: Uses `http://localhost:5000`

If you need to override this, set the environment variable:
```bash
# In frontend/.env
REACT_APP_API_URL=http://localhost:5000
```

## Team Workflow

The project is configured to work seamlessly for all team members regardless of their development environment:

1. **No configuration needed** - Just run `bash start.sh`
2. **Consistent ports** - Everyone uses the same port scheme locally
3. **Replit compatibility** - Automatic detection ensures Replit works correctly
4. **Database included** - SQLite database is version controlled

## Technical Details

### Files Modified for Port Configuration
- `start.sh` - Environment detection and port assignment
- `backend/src/main.ts` - Reads `BACKEND_PORT` env var (fallback: 5000)
- `frontend/src/config.ts` - Detects Replit vs local environment for API URL

### Environment Variables
See `.env.example` files in both `backend/` and `frontend/` directories for available configuration options.

# Citylights.io Development Setup

## Quick Start

### 1. Prerequisites
- **Node.js 22.18.0 LTS** (use `nvm use` if you have .nvmrc)
- **Docker & Docker Compose** (for MongoDB)
- **Git**

### 2. Setup Environment

```bash
# Clone and setup
git clone <repository>
cd citylights

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start all infrastructure (MongoDB + Admin UI) in background
docker-compose up -d

# Start development servers
npm run dev-full
```

### 3. Access Points
- **Frontend**: http://localhost:8999 (Vite dev server)
- **Backend API**: http://localhost:3001 (Node.js server)
- **MongoDB**: localhost:27017
- **MongoDB Admin**: http://localhost:8081 (mongo-express)

## Development Commands

### Frontend Development
```bash
npm run dev          # Start Vite dev server only
npm run build        # Build production frontend
npm run preview      # Preview production build
```

### Backend Development  
```bash
npm run api-dev      # Start API server only (with nodemon)
npm start           # Start production API server
```

### Full Stack Development
```bash
npm run dev-full    # Start both frontend and backend
```

### Database Management
```bash
# Start all infrastructure (MongoDB + Admin UI) detached
docker-compose up -d

# Start only MongoDB (without admin UI)
docker-compose up -d mongodb

# Stop all services
docker-compose down

# Reset database (removes all data)
docker-compose down -v
```

## Architecture

### Modern Tech Stack (2025)
- **Frontend**: React 19 + Redux Toolkit + Vite
- **Backend**: Node.js 22 + Hapi 21 + Socket.io 4
- **Database**: MongoDB 8 + Mongoose 8
- **Build**: Vite 6 (replaces Webpack 1)
- **Modules**: ES modules throughout

### Development vs Production

**Development**:
- Frontend: Vite dev server with HMR
- Backend: Local Node.js with nodemon
- Database: Local MongoDB via Docker

**Production (Railway)**:
- Frontend: Static build served by backend
- Backend: Single Node.js server
- Database: Railway managed MongoDB

## Environment Variables

### Required for Development
```bash
NODE_ENV=development
CITYLIGHTS_CDN=http://localhost:8999
CITYLIGHTS_MONGO_HOST=localhost
CITYLIGHTS_MONGO_PORT=27017
CITYLIGHTS_MONGO_DB=citylights_dev
CITYLIGHTS_MONGO_USER=admin
CITYLIGHTS_MONGO_PASS=password
```

### Required for Production (Railway)
```bash
NODE_ENV=production
DATABASE_URL=mongodb://...  # Provided by Railway
PORT=3001                   # Provided by Railway
```

## API Testing

The backend provides these endpoints:
- `GET /` - Serves the frontend app
- `Socket.io` - Real-time API at `/socket.io/`

Socket.io endpoints include:
- `auth:login` - User authentication
- `workspace:create` - Workspace management
- `user:invite` - User management
- `project:create` - Project management
- `shift:create` - Shift scheduling

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Reset MongoDB completely
docker-compose down -v
docker-compose up -d mongodb
```

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Backend Issues
```bash
# Check environment variables
node -e "console.log(process.env.NODE_ENV, process.env.CITYLIGHTS_MONGO_HOST)"

# Test backend directly
NODE_ENV=development node api/server.js
```

## Migration Status

✅ **COMPLETED** (80% of planned work):
- Phase 1: Modern build system (Webpack → Vite)
- Phase 2: Frontend modernization (React 15→19, Redux→RTK)  
- Phase 3: Component modernization (15 key components)
- Phase 4: Backend modernization (Hapi 13→21, Mongoose 4→8, Socket.io 1→4)

⏳ **REMAINING** (20% of planned work):
- Phase 5: Testing modernization (Karma → Vitest)
- Phase 6: Final deployment and optimization
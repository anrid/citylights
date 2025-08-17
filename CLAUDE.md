# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Start both frontend dev server and API server in parallel
- `npm run dev` - Start webpack-dev-server on port 8999 (frontend only)
- `npm run api-dev` - Start API server in development mode with nodemon

### Building
- `npm run build` - Build production bundle (removes existing JS files first)

### Testing
- `npm test` - Run all tests (both Lab and Karma)
- `npm run lab` - Run backend API tests using Lab framework
- `npm run karma` - Run frontend tests using Karma + Mocha
- `npm run karma-dev` - Run Karma in watch mode for continuous testing

### Deployment
- `npm run patch` - Increment version, build, release, and push to git
- `npm run live` - Full deployment pipeline (patch + deploy to production)
- `npm run release` - Upload build manifest to S3

## Architecture

### Frontend (React/Redux)
- **Entry Point**: `app/index.js` - React app renders into `#pl-app` element
- **State Management**: Redux with react-router-redux for routing state
- **Store Configuration**: `app/lib/configureStore.js` - Uses redux-thunk middleware
- **Reducers**: Located in `app/reducers/` - Combined in `index.js`
  - counter, settings, workspaces, users, projects, shifts, routing
- **Components**: Organized in `app/components/` with co-located SCSS files
- **Containers**: Smart components in `app/containers/` handle state and logic
- **Actions**: Redux actions in `app/actions/` organized by domain

### Backend (Hapi.js/Node.js)
- **Server**: `api/server.js` - Hapi server with HTTPS support (or HTTP in dev)
- **Database**: MongoDB via Mongoose, initialized in `api/lib/database.js`
- **Endpoints**: REST API routes in `api/endpoints/`
- **Services**: Business logic in `api/services/` with corresponding models
- **Socket.io**: Real-time communication setup in `api/lib/socket.js`

### Build System (Webpack 1.x)
- **Config**: `webpack.config.js` - Different configs for dev/production
- **Dev Server**: Runs on port 8999 with hot reloading
- **Production**: Uses chunkhash for caching, uglification, and asset manifest
- **Babel**: Transforms ES2015/React/Stage-0 with caching enabled

### Testing
- **Backend Tests**: Lab framework testing API endpoints in `test/`
- **Frontend Tests**: Karma + Mocha testing React components
- **Test Entry**: `testsEntry.webpack.js` for Karma webpack integration

### Key Domains
- **Workspaces**: Multi-tenant workspace management
- **Users**: User authentication and management with JWT
- **Projects**: Project creation and management within workspaces
- **Shifts**: Time planning and shift scheduling system
- **Planner**: Specialized UI components for time planning in `app/planner/`

### Environment Configuration
Required environment variables for production:
- `PORT`, `HOST` - Server binding (provided by Railway)
- `CITYLIGHTS_CDN` - CDN base URL for assets
- `DATABASE_URL` - MongoDB connection (provided by Railway)

Railway handles TLS termination automatically - no TLS configuration needed.
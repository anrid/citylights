# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status
**✅ MODERNIZED**: This application has been fully modernized from 2016 to 2025 technology standards (React 19, Redux Toolkit, Vite, Node.js 22, Hapi 21).

**Current Status**: 85% complete - Core functionality working, navigation issues resolved. Only testing migration and final deployment remaining.

## Commands

### Development
- `npm start` - Start both frontend (Vite) and API server in parallel
- `npm run dev` - Start Vite dev server (usually port 8999, may auto-increment)
- `npm run api-dev` - Start API server in development mode with nodemon

### Building
- `npm run build` - Build production bundle using Vite (outputs to dist/)

### Testing
- `npm test` - Run tests (⚠️ Currently transitioning from Karma/Lab to Vitest)
- `npm run lab` - Run backend API tests using Lab framework (legacy)
- `npm run karma` - Run frontend tests using Karma + Mocha (legacy)

### Deployment
- Production deployment is ready for Railway (backend) + Vercel (frontend)
- Environment variables: See .env.example for required configuration

## Architecture

### Frontend (React 19 + Redux Toolkit)
- **Entry Point**: `app/index.jsx` - React 19 app with createRoot API renders into `#pl-app` element
- **State Management**: Redux Toolkit with modern slice patterns
- **Store Configuration**: `app/store/index.js` - Uses configureStore with RTK
- **Slices**: Modern Redux slices in `app/store/` 
  - counterSlice, settingsSlice, workspacesSlice, usersSlice, projectsSlice, shiftsSlice
- **Components**: Modern functional components in `app/components/` (.jsx files)
- **Containers**: Smart components using useSelector/useDispatch hooks
- **Routing**: React Router v6 with modern navigation patterns

### Backend (Hapi.js 21 + Node.js 22)
- **Server**: `api/server.js` - Hapi 21 server with async/await patterns
- **Runtime**: Node.js 22 LTS with ES modules support
- **Database**: MongoDB 8.0 via Mongoose 8.17.1, initialized in `api/lib/database.js`
- **Endpoints**: REST API routes in `api/endpoints/` using modern async handlers
- **Services**: Business logic in `api/services/` with modernized Mongoose models
- **Socket.io**: Real-time communication using Socket.io 4.8.1

### Build System (Vite 6.x)
- **Config**: `vite.config.js` - Modern build tool with plugins
- **Dev Server**: Fast development server with HMR (port 8999, auto-increment if busy)
- **Production**: Optimized builds with code splitting and modern asset handling
- **Performance**: 10-20x faster than legacy Webpack 1.x builds

### Testing (Transitioning to Modern Stack)
- **Current**: Legacy Lab (backend) + Karma/Mocha (frontend) testing
- **Target**: Migrating to Vitest for both frontend and backend
- **Status**: Phase 5 of modernization plan - tests need migration to modern patterns

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

## Modernization Notes

### Component Patterns
- **✅ Modernized Components**: Use functional components with hooks (useState, useEffect, useSelector, useDispatch)
- **⚠️ Legacy Components**: Some planner components still use class components + connect() HOC
- **File Extensions**: New components use .jsx, legacy components use .js
- **Redux**: Use Redux Toolkit slices and hooks, avoid legacy connect() patterns

### Navigation & Routing
- **Router**: React Router v6 - use useNavigate(), useLocation(), useParams()
- **Navigation Issues**: All infinite loops and routing crashes have been resolved
- **Protected Routes**: ProtectedRoute/PublicRoute handle authentication redirects

### Known Working Features
- ✅ Authentication flow (login/signup/logout)
- ✅ Navigation between all main pages (/overview, /consultants, /time, /settings)
- ✅ Time Planner interface fully functional
- ✅ User management and workspace switching
- ✅ Real-time Socket.io communication

### Development Guidelines
- **New Components**: Always use functional components with hooks
- **State Management**: Use useSelector/useDispatch instead of connect()
- **Error Handling**: Add defensive programming (null checks, fallbacks)
- **File Structure**: Keep .jsx extension for React components
# citylights.io

A bundle of joy built with React, Redux, socket.io and MongoDB.

### Install:
```bash
npm i
```

### Develop:
```bash
npm start
```

### Run all tests:
```bash
npm test
```

### Lab tests:
```bash
npm run lab
```

### Karma tests:
```bash
npm run karma
```

### Karma dev cycle (watches files for changes):
```bash
npm run karma-dev
```

### Release a patch (ensure tests pass first!):
```bash
# Bumps app version by 0.0.1 and releases code into production.
npm run live
```

## Using Docker for Local Development

This section provides guidance on using Docker and Docker Compose to run backend services (MongoDB and Redis) for local development, and how to configure your local API to connect to them.

### Backend Services (MongoDB & Redis)

To simplify local development, you can run backend services (MongoDB and Redis) using Docker. A `docker-compose.yml` file is provided in the root of the repository.

**Prerequisites:**
- Ensure you have Docker and Docker Compose installed on your system.

**Usage:**
- To start the services in detached mode (run in the background):
  ```bash
  docker-compose up -d
  ```
- To stop the services:
  ```bash
  docker-compose down
  ```
- To view logs for a specific service (e.g., mongo):
  ```bash
  docker-compose logs -f mongo
  ```
- Data for MongoDB and Redis will be persisted in Docker volumes (`mongodb_data` and `redis_data` respectively), so your data will remain even if you stop and restart the containers.

### Configuring Local API Connection

This section outlines how to configure environment variables for the CityLights API, particularly for MongoDB and Redis connections, and how to connect your local API instance to services running via Docker Compose.

**MongoDB Configuration**

The API connects to MongoDB using the following parameters, which can be set via environment variables:

-   **Host:** `CITYLIGHTS_MONGO_HOST`
    -   Default: `localhost`
-   **Port:** `CITYLIGHTS_MONGO_PORT`
    -   Default: `27017`
-   **Database Name:** `CITYLIGHTS_MONGO_DB`
    -   Default: `test_dev`
    -   Note: If `NODE_ENV` is set to `test`, the database name will be `test_dev` regardless of this environment variable.
-   **Username (Optional):** `CITYLIGHTS_MONGO_USER`
-   **Password (Optional):** `CITYLIGHTS_MONGO_PASS`
-   **Authentication Database (Optional):** `CITYLIGHTS_MONGO_AUTH_DB`
    -   Defaults to `admin` if `CITYLIGHTS_MONGO_USER` and `CITYLIGHTS_MONGO_PASS` are provided.

**Redis Configuration**

The API's Redis connection typically defaults to:

-   **Host:** `localhost`
-   **Port:** `6379`

These can often be overridden by environment variables like `REDIS_HOST` and `REDIS_PORT` if the application's Redis client supports them.

**Connecting to Dockerized Services**

When running MongoDB and Redis via the `docker-compose.yml` file:

-   MongoDB is available at `localhost:27017`.
-   Redis is available at `localhost:6379`.

To connect your local API:

1.  **MongoDB:**
    *   Set `CITYLIGHTS_MONGO_HOST=localhost` (or `127.0.0.1`).
    *   Set `CITYLIGHTS_MONGO_PORT=27017`.
    *   Set `CITYLIGHTS_MONGO_DB` to your desired database name (e.g., `citylights_dev`).
    *   Configure auth variables if your Dockerized MongoDB instance uses them.

2.  **Redis:**
    *   Ensure any `REDIS_HOST` and `REDIS_PORT` variables point to `localhost` and `6379`. Often, no change is needed if these are the defaults.

**Using a `.env.local` File**

For local development, manage these settings in a `.env.local` file in the project root (this file should not be committed to git).

**Example `.env.local` content:**

```
# MongoDB Configuration
CITYLIGHTS_MONGO_HOST=localhost
CITYLIGHTS_MONGO_PORT=27017
CITYLIGHTS_MONGO_DB=citylights_development

# Optional MongoDB Auth
# CITYLIGHTS_MONGO_USER=your_mongo_user
# CITYLIGHTS_MONGO_PASS=your_mongo_password
# CITYLIGHTS_MONGO_AUTH_DB=admin

# Optional Redis Configuration
# REDIS_HOST=localhost
# REDIS_PORT=6379

# Other API settings
CITYLIGHTS_API_SECRET=your_super_secret_api_key_here_must_be_long_enough
# NODE_ENV=development
```

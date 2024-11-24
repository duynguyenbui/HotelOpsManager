# Project Setup Guide

## Prerequisites
- Docker Desktop ([Download here](https://www.docker.com/products/docker-desktop))
- Node.js 18.17 or higher ([Download here](https://nodejs.org))

## Setup Steps

### 1. Installation
First, install Docker Desktop and Node.js on your machine. Verify the installations by running:
```bash
docker --version
node --version
```

### 2. Install Dependencies
Navigate to the project root directory and install all required packages:
```bash
npm install
```

### 3. Environment Configuration
Copy the environment variables from the example file:
```bash
cp .env.example .env
```
Then, update the `.env` file with your specific configuration values.

### 4. Start Docker Containers
Launch all necessary containers defined in docker-compose.yml:
```bash
docker compose up -d
```
This will start all required services (database, cache, etc.) in detached mode.

### 5. Database Migration
Run Prisma migrations to set up your database schema:
```bash
npx prisma migrate dev
```

### 6. Database Push
Apply the Prisma schema changes to your database:
```bash
npx prisma db push
```

### 7. Start Development Server
Launch the Next.js development server:
```bash
npm run dev
```
The application will be available at: http://localhost:3000

## Troubleshooting
- If containers fail to start, check Docker logs: `docker compose logs`
- For database connection issues, ensure your `.env` configuration matches your Docker setup
- If migrations fail, try resetting the database: `npx prisma migrate reset`

## Additional Commands
```bash
# Stop Docker containers
docker compose down

# View Prisma Studio (database GUI)
npx prisma studio

# Reset Database
npx prisma migrate reset

# View Docker container status
docker compose ps
```
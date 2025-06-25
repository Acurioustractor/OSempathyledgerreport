# Docker Setup for Empathy Ledger Showcase

This Docker setup ensures consistent development and production environments, avoiding local port conflicts.

## Prerequisites

- Docker Desktop installed and running
- API keys configured in `.env` file

## Quick Start

### Development Mode (with hot reload)

```bash
./docker-run.sh dev
```

Visit http://localhost:3000 - Changes to code will auto-reload.

### Production Mode

```bash
./docker-run.sh prod
```

## Available Commands

```bash
./docker-run.sh dev       # Start development server
./docker-run.sh prod      # Start production server
./docker-run.sh build     # Build production image only
./docker-run.sh stop      # Stop all containers
./docker-run.sh logs      # View container logs
./docker-run.sh shell     # Open shell in container
./docker-run.sh clean     # Remove all containers and images
./docker-run.sh fetch     # Fetch latest data from Airtable
```

## Manual Docker Commands

If you prefer using Docker directly:

### Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
docker-compose up --build
```

### Stop containers
```bash
docker-compose down
```

## Troubleshooting

### Port already in use
The Docker setup uses port 3000. If needed, change it in the docker-compose files:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your preferred port
```

### Can't connect to Docker
Make sure Docker Desktop is running:
```bash
open -a Docker  # macOS
```

### Permission denied on docker-run.sh
```bash
chmod +x docker-run.sh
```

### View logs
```bash
./docker-run.sh logs
# or
docker-compose -f docker-compose.dev.yml logs -f
```

## Environment Variables

Create a `.env` file in the project root:
```env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=app7G3Ae65pBblJke
```

## Benefits

1. **No port conflicts** - Isolated environment
2. **Consistent setup** - Same environment for everyone
3. **Easy cleanup** - Remove everything with one command
4. **Hot reload** - Development mode watches for changes
5. **Production ready** - Same setup deploys to production
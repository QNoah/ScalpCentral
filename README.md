# ScalpCentral

Pokémon card marketplace: C# API + React frontend + Docker

## Quick Start

IMPORTANT: Copy the .env.example to a new .env file in the same directory (or copy it's contents to an existing .env).
Also make sure you have installed Docker Desktop (and running)

```bash
# Start all services
docker compose up --build

# Initialize database (one-time, very slow)
cd Scripts
py main.py
```

**Access:** Website http://localhost:3000 | API http://localhost:5231

## Docker Commands

| Command | Effect |
|---------|--------|
| `docker compose up` | Start services |
| `docker compose up --build` | Rebuild and start |
| `docker compose down` | Stop (keep data) |
| `docker compose down -v` | Stop and delete all data |
| `docker compose logs -f [service]` | View logs |

## Services

| Service | Port | Details |
|---------|------|---------|
| **website** | 3000 | React frontend (TypeScript) |
| **api** | 5231 | C# ASP.NET backend |
| **postgres** | 5432 | PostgreSQL 17 database |
| **redis** | 6379 | Redis 7 cache |

## Database Initialization

⚠️ Run once after first `docker compose up --build`:

```bash
cd Scripts
py main.py  # Imports Pokémon card data (takes minutes)
cd ..
```

## docker-compose.yml Overview

- **postgres**: PostgreSQL 17, health check, `postgres_data` volume
- **redis**: Redis 7, health check, `redis_data` volume  
- **api**: Depends on postgres + redis (healthy)
- **website**: Depends on api

Health checks ensure services start in correct order. Volumes persist data between restarts.

## Development Workflow

```bash
# First time setup
docker compose up --build && cd Scripts && py main.py && cd ..

# Daily: just restart
docker compose down && docker compose up

# Reset everything
docker compose down -v && cd Scripts && py main.py && cd .. && docker compose up
```

## Troubleshooting

- Logs: `docker compose logs`
- Port conflicts: Check ports 3000, 5231, 5432, 6379 available
- DB errors: Verify `.env` credentials
- Slow import: Normal for first `py main.py` run
- Setup: Copy `.env.example` to `.env`

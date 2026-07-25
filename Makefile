.PHONY: dev test seed migrate shell build up down logs

# Start development environment
dev:
	docker compose -f docker/docker-compose.yml up -d
	docker compose -f docker/docker-compose.yml logs -f

up:
	docker compose -f docker/docker-compose.yml up -d

down:
	docker compose -f docker/docker-compose.yml down

logs:
	docker compose -f docker/docker-compose.yml logs -f

logs-backend:
	docker compose -f docker/docker-compose.yml logs -f backend

logs-frontend:
	docker compose -f docker/docker-compose.yml logs -f frontend

# Database
migrate:
	docker compose -f docker/docker-compose.yml exec backend alembic upgrade head

migrate-create:
	docker compose -f docker/docker-compose.yml exec backend alembic revision --autogenerate -m "$(msg)"

seed:
	docker compose -f docker/docker-compose.yml exec backend python -m app.seeds.seed

# Testing
test:
	docker compose -f docker/docker-compose.yml exec backend pytest -v

test-cov:
	docker compose -f docker/docker-compose.yml exec backend pytest --cov=app --cov-report=html

# Shell access
shell:
	docker compose -f docker/docker-compose.yml exec backend bash

psql:
	docker compose -f docker/docker-compose.yml exec postgres psql -U sps_user -d student_psychology

# Build
build:
	docker compose -f docker/docker-compose.yml build

rebuild:
	docker compose -f docker/docker-compose.yml build --no-cache

# Clean
clean:
	docker compose -f docker/docker-compose.yml down -v
	rm -rf backend/__pycache__ backend/app/__pycache__ frontend/dist

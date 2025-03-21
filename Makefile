start/dev:
	docker compose -f docker/development/compose.yml up -d --build

stop/dev:
	docker compose -f docker/development/compose.yml down

logs/dev/server:
	docker compose -f docker/development/compose.yml logs -f server

shell/dev/server:
	docker compose -f docker/development/compose.yml exec server /bin/sh

start/prod:
	docker compose -f docker/production/compose.yml up -d --build

stop/prod:
	docker compose -f docker/production/compose.yml down
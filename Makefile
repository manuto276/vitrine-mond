IMAGE = vitrine-serbas

.PHONY: install build

install:
	docker build -t $(IMAGE) .
	docker run --rm -v $(PWD):/app $(IMAGE) sh -c "npm install && chown -R $(shell id -u):$(shell id -g) /app/node_modules /app/package-lock.json"

build:
	docker build -t $(IMAGE) .
	docker run --rm -v $(PWD):/app $(IMAGE) sh -c "npm run build && chown -R $(shell id -u):$(shell id -g) /app/dist"
	cp theme.json dist/theme.json

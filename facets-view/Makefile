.PHONY: build

build:
	docker run --rm -v $(PWD):/app -it node:12 /bin/bash -c 'cd /app; make _build'

_build:
	rm -rf build
	npm run build

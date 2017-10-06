JSON_FILES := $(wildcard src/languages/*.json)
JSON_MIN_FILES := $(addprefix build/languages/,$(notdir $(JSON_FILES:.json=.json)))

# ------------------------------------------------------------------
# Building
# ------------------------------------------------------------------

build: build-dirs deps $(JSON_MIN_FILES) ./build/scripts/highlight.min.js ./build/styles/syntax.css
	
build/languages/%.json: ./src/languages/%.json
	./node_modules/.bin/json-minify $< > $@

build/scripts/highlight.min.js: ./src/highlight.js
	./node_modules/.bin/uglifyjs --output ./build/scripts/highlight.min.js ./src/highlight.js

build/styles/syntax.css:
	cp ./src/syntax.css ./build/styles/syntax.css

build-dirs:
	mkdir -p ./build ./build/languages ./build/scripts ./build/styles

deps:
	npm install --only=production json-minify uglify-js@1 jsdoc

# ------------------------------------------------------------------
# Utils
# ------------------------------------------------------------------

docs: ./src/highlight.js deps
	./node_modules/.bin/jsdoc --readme DOCS.md src -r -d docs

test: build
	cp -r ./build ./tests/

test-fileserver: test
	python -m SimpleHTTPServer

clean-all: clean deps-clean docs-clean

clean:
	rm -rf ./build

deps-clean:
	rm -rf ./node_modules

docs-clean:
	rm -rf ./docs
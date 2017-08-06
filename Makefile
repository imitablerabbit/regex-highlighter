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

buildtest: build
	cp -r ./build ./tests/

# ------------------------------------------------------------------
# Utils
# ------------------------------------------------------------------

docs: ./src/highlight.js deps
	./node_modules/.bin/jsdoc --readme DOCS.md src -r -d docs

cleanall: clean distclean docsclean

clean:
	rm -rf ./build

distclean:
	rm -rf ./node_modules

docsclean:
	rm -rf ./docs
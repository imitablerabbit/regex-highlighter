JSON_FILES := $(wildcard src/languages/*.json)
JSON_MIN_FILES := $(addprefix build/languages/,$(notdir $(JSON_FILES:.json=.json)))

# ------------------------------------------------------------------
# Building
# ------------------------------------------------------------------

build: build-dirs deps $(JSON_MIN_FILES) ./build/highlight.min.js ./build/syntax.css
	
build/languages/%.json: ./src/languages/%.json
	./node_modules/.bin/json-minify $< > $@

build/highlight.min.js: ./src/highlight.js
	./node_modules/.bin/uglifyjs --output ./build/highlight.min.js ./src/highlight.js

build/syntax.css:
	cp ./src/syntax.css ./build/syntax.css

build-dirs:
	mkdir -p ./build ./build/languages

deps:
	npm install --only=production json-minify uglify-js@1 jsdoc \

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
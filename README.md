# regex-highlighter
A javascript tool to highlight regex pattern matches using HTML and CSS. Whilst this tool is primarily aimed at programming languages syntax highlighting, it can be used with any regular expression. Highlighted matches from a given regex file will be wrapped in a span tag and then given a class which can be used to style that particular match. The are several supported languages which can be used, or you can create custom rules.

## How to Use:
### Online Converter:
If you don't need to dynamically covert text to its highlighted format, you can use the online converter [here](http://markhillman.info/#regex-highlighter) and copy the output into the HTML. Then all that is needed is to either include the CSS file, or to style the span tags yourself. The online converter allows for all currently supported languages, custom JSON files and single regex lines.

### Dynamic Conversion:
Adding the highlighter to a project is very simple! All you have to do is to include the javascript file in your HTML and run a function from the RegexHighlighter object. To see which functions will best suit your use case, check out the documentation [here](http://markhillman.info/projects/regex-highlighter/docs).
Simply put, you can just follow these few steps:
- Download the zip file from github, then move the files to relevant folders somewhere on the server (**Note: the script has to run on a server as it uses AJAX**)
- Add the highlight.min.js script to the html file that you want it to run on using `<script  type="text/javascript" src="scripts/highlight.min.js"></script>`.
- Add the syntax.css stylesheet to highlight the matched text using `<link rel="stylesheet" href="styles/syntax.css">`
- Now you can run regex-highlighter with the `loadSyntaxHighlightingByClass()` function. This function is inside the RegexHighlighter class, so first create an instance then call the function `new RegexHighlighter().loadSyntaxHighlightingByClass()`. The `loadSyntaxHighlightingByClass()` function takes 2 optional parameters in order to determine which parts of the html need to be checked, as well as the folder for where the default language support is. The default options for these are 'regex-color' and './languages/'. This means that only elements which have a class of regex-color will be coloured and only the 'languages/' folder in the same directory as the script will be searched for the regex support. These can be changed by supplying arguments to the function.
- To tell the regex-highlighter what language it should use, add a class to the same element, which is the language name.

### Example:
```
<script  type="text/javascript" src="build/highlight.min.js"></script>
<link rel="stylesheet" href="build/syntax.css" charset="utf-8">

    ...    

<pre><code class="syntax-color haskell">import Text.Printf

criticalProbability :: (Integral a, Floating b) => a -> a -> b
criticalProbability d h
    | h > d     = 1.0 / fromIntegral d * criticalProbability d (h - d)
    | otherwise = 1.0 - fromIntegral (h - 1) / fromIntegral d

main = let
    ds = [4,4,4,4,1,100,8]
    hs = [1,4,5,6,10,200,20]
    in sequence . map (putStrLn . printf "%f") $
        zipWith (\d h < criticalProbability d h :: Double) ds hs</code></pre>

    ...

<script type="text/javascript">loadSyntaxHighlightingByClass("syntax-color");</script>
```

### Documentation:
There are a few other public functions which allow for finer control of highlighting text, the documentation for these can be found  [here](http://markhillman.info/projects/regex-highlighter/docs).

## Screenshots:
### Haskell:
![Haskell Syntax](screenshots/haskell.PNG)

### Java:
![Java Syntax](screenshots/java.PNG)

## Creating custom JSON files:
When creating the custom JSON files, make sure that they are in the following formats:
```
{
    class-name1: {
        "regexes": [
            regex1,
            regex2
        ]
    },
    class-name2: {
        "regexes": [
            regex1
        ]
    }
}
```
Where class-name is class that will attached to the span when the script is run and regex is any regex in a string format. Unfortunately due to JSON not supporting regex notation or raw string, any backslashes in the regex have to be escape e.g \\\\bhello\\\\b.

You can use the testing folder for trying out any new builds and generally editing the source files. This folder also has a way of testing and previewing the regex highlighting that is currently supported, via the [index](testing/index.html) webpage.

## Building:
If you have made any changes, make sure to minify the javascript and json files using the following links:
- Javascript: http://jscompress.com/
- JSON: http://www.httputility.net/json-minifier.aspx

Once minified, add the files to the build folder and the newly updated source files to the src folder. If a new language has been added, please add an example of the language highlighting in the example.

If any new functions have been added or an important change has been made to the structure of the code, please make sure to build the documentation again. This can be done by running JSDoc on the src folder. More specifically run this from a terminal `"node_modules/.bin/jsdoc" --readme DOCS.md src -r -d docs`

## To Do:
- Add a better way to handle the arguments that are needed when calling a public function, could be class variables?
- Add more syntax support
    - PHP
    - basic C++

## Change Log:
- Added more robust commenting to the javascript file (came with JSDoc)
- Added some more error checking to the javascript file, mostly for optional arguments
- Added in depth documentation to this project, using JSDoc
- Added a way to add options to the regexes, for example to set the precedent. This was I can get regex matches with the same precedent, so the longer of the 2 matches will be chosen.
- Updated the duplicate removal for new precedent matching.
- Added a more complex regex dulpication detection system
- Fixed java character matching
- Changed to last group pattern matching
- Fixed the haskell function errors
- Created a guide on how to add more languages
- Added Languages:
    - JSON
    - Javascript
    - Java
    - Haskell
- Added main javascript file
- Added support for multiple languages

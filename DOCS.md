A javascript tool to highlight regex pattern matches in a HTML document and CSS. Whilst this tool is primarily aimed at programming languages syntax highlighting, it can be used with any regular expression. Highlighted matches from a given regex file will be wrapped in a span tag and then given a class which can be used to style that particular match. The are several supported languages which can be used, or you can create custom rules.

## How to Use:
### Online Converter:
If you don't need to dynamically covert text to its highlighted format, you can use the online converter [here](http://markhillman.info/#regex-highlighter) and copy the output into the HTML. Then all that is needed is to either include the CSS file, or to style the span tags yourself. The online converter allows for all currently supported languages, custom JSON files and single regex lines.

### Adding to a website:
Adding the highlighter to a project is very simple! All you have to do is to include the javascript file in your HTML and run a function from the RegexHighlighter object. To see which functions will best suit your use case, check out the documentation [here](http://markhillman.info/projects/regex-highlighter/docs).
Simply put, you can just follow these few steps:
- Download the zip file from github, then move the files to relevant folders somewhere on the server (**Note: the script has to run on a server as it uses AJAX**)
- Add the highlight.min.js script to the html file that you want it to run on using `<script  type="text/javascript" src="scripts/highlight.min.js"></script>`.
- Add the syntax.css stylesheet to highlight the matched text using `<link rel="stylesheet" href="styles/syntax.css">`
- Now you can run regex-highlighter with the `loadSyntaxHighlightingByClass()` function. This function is inside the RegexHighlighter class, so first create an instance then call the function `new RegexHighlighter().loadSyntaxHighlightingByClass()`. The `loadSyntaxHighlightingByClass()` function takes 2 optional parameters in order to determine which parts of the html need to be checked, as well as the folder for where the default language support is. The default options for these are 'regex-color' and './languages/'. This means that only elements which have a class of regex-color will be coloured and only the 'languages/' folder in the same directory as the script will be searched for the regex support. These can be changed by supplying arguments to the function.
- To tell the regex-highlighter what language it should use, add a class to the same element, which is the language name.
For more information on what the individual methods do, you can check out the documentation for each individual method.

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

<script type="text/javascript">new RegexHighlighter().loadSyntaxHighlightingByClass("syntax-color");</script>
```

## Creating custom JSON files:
When creating the custom JSON files, make sure that they are in the following format:
```
{
    className1: {
        "regexes": [
            regex1,
            regex2
        ]
    },
    className2: {
        "regexes": [
            {
                "regexString": regex1,
                "captureGroup": 1
            }
        ],
        "precedence": 1
    }
}
```
The general form of the JSON regex files, are that inner objects denote a new type of match (e.g variable, function, keyword). The key for these objects will be used as the class that is given to the span tags when the matching takes place. The class can then be used to style the type of matches that the object will contain. In general, regexes which match the same section of the text will be decided by the precedence of the type object. By default the precedence is the cascading nature of the JSON file, however this can be changed.

Inside the objects are the regexes inside an array which will be used, as well as any other options that might be needed. In the example above there is also a use of the precedence option. This is used to force a precedent value on a type object so that different matches can be treated as though they are in the same type block whilst having different styling. There are 2 ways of using the precedence option, you can give it a number which will be used as the precedence value, or you can give it a string value which is the name of a type used earlier in the JSON (This will only work is the type used in the precedence option is before current type object, otherwise default cascading precedence is used). An example of this can be seen in the python.json where the wrapping type is given the same precedent as the comment type:
```
"comment": {
    "regexes": [
        "#.+",
        "\\/\\*[^\\*\\/]+\\*\\/"
    ]
},
"wrapping": {
    "regexes": [
        "\"(\\\\.|[^\"])*\"",
        "'.?'"
    ],
    "precedence": "comment"
}
```

Inside the regexes array, there can be 2 different types of regex given, the first is a simple regex string. This is just plugged into the regex engine as the pattern and only the whole match will be caught. Another way of provided a regex, is with a regex object. This is just a new object created in the array which contains more information for the capturing of the regex match. With this you can supply a regex string, as well as the capture group that should be used for the regex match. If the captureGroup value is not valid according to the regex provided (i.e if there is not a capture at the group specified) then the whole match will be used instead. An example of this in use can be found in the python.json file:
```
"variable": {
    "regexes": [
        {
            "regexString": "\\.(\\w+)\\b",
            "captureGroup": 1
        }
    ]
}
```
This means that any word characters after a . (dot) character, and before a word break (\\b), will be captured and highlighted with the class of variable. **Note:** Unfortunately due to JSON not supporting literal regex notation or raw strings, any backslashes in the regex have to be escaped e.g \\\\bhello\\\\b

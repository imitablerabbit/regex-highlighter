# regex-highlighter
A javascript tool to highlight regex pattern matches using HTML and CSS. Whilst this tool is primarily aimed at programming languages syntax highlighting, it can be used with any regular expression.

## How to Use:
### Adding to project:
Adding the highlighter to a project is very simple! All you have to do is include the javascript file in your HTML and run the script. This can be done in 3 simple steps:
- Download the zip files from github, then move the build folder to somewhere on the server (**Note: the script has to run on a server as it uses AJAX**)
- Add the script to the html file that you want it to run on using `<script  type="text/javascript" src="build/highlight.min.js"></script>`.
- Add the stylesheet for what to highlight using `<link rel="stylesheet" href="build/style.css" charset="utf-8">`
- Now you can run regex-highlighter with the `loadSyntaxHighlightingByClass()` function. The `loadSyntaxHighlightingByClass()` function takes in a class name which it will use to determine which elements in the HTML need to be highlighted. In order to tell the function which regexes you want to use, make sure to also have the name of the file  after the class name.

### Example:
I have included a small example of how this works in the example folder. To sum it up, first include the highlight script and stylesheet. Then add the class name to the correct HTML element sas well as the filename of the regexes. Then finally call the desired function, the simplest is to use `loadSyntaxHighlightingByClass()`.
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

## Screenshots:
### Haskell:
![Haskell Syntax](screenshots/haskell.PNG)

### Java:
![Java Syntax](screenshots/java.PNG)

## Helping with the project:
### Building:
If you have made any changes, make sure to minify the javascript and json files using the follwing links:
- Javascript: http://jscompress.com/
- JSON: http://www.httputility.net/json-minifier.aspx

Once minified, add the files to the build folder and the newly updated source files to the src folder. If a new language has been added, please add an example of the language highlighting in the example.

## To Do:
- Add some more error checking to the javascript file
- Add more robust commenting to the javascript file
- Create a guide on how to add more languages
- Add more syntax recognition
  - Javascript
  - PHP
  - JSON
  - basic C++

## Change Log:
- Added Languages:
  - Java
  - Haskell
- Added main javascript file
- Added support for multiple languages

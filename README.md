# regex-highlighter
A javascript tool to highlight regex pattern matches using HTML and CSS.

## How to Use:
### Adding to project:
Adding the highlighter to a project is very simple! All you have to do is include the javascript file in your HTML and run the script. This can be done in 3 simple steps:
- Download the zip files from github, then move the build folder to somewhere on the server (**Note: the script has to run on a server as it uses AJAX**)
- Add the script to the html file that you want it to run on using `<script  type="text/javascript" src="highlight.min.js"></script>`.
- Add the stylesheet for what to highlight using `<link rel="stylesheet" href="style.css" charset="utf-8">`
- Now you can run regex-highlighter with the `loadSyntaxHighlightingByClass()` function. The `loadSyntaxHighlightingByClass()` function takes in a class name which it will use to determine which elements in the HTML need to be highlighted. In order to tell the function which regexes you want to use, make sure to also have the name of the file  after the class name.

### Example:
I have included a small example of how this works in the example file. To sum it up, first include the highlight script. Then add the class name to the correct HTML elements. Finally add the filename of the regexes as another class to the same HTML element.
```
<script  type="text/javascript" src="highlight.min.js"></script>
<link rel="stylesheet" href="style.css" charset="utf-8">

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
```

## Example Screenshots:
### Haskell Example:
![Haskell Syntax](screenshots/haskell.PNG)

### Java Example:
![Java Syntax](screenshots/java.PNG)

## Helping with the project:
### Building:

## To Do:
- Add some more error checking to the javascript file
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

/**
* Inner class for the matches that have been made
* @author Mark Hillman <mark@markhillman.info>
*
*   @class
*   @param {number} index - The position that this match was found at in the
*       main text
*   @param {string} classes - A string which will be added to the class variable
*       in the span tag, this should also include the type
*   @param {string} type - This is the match type, e.g keyword, wrapping
*   @param {number} length - This is the length of the match
*   @param {string} match - This is the actual contents of the match
*   @param {number} precedence - This is the precedence level of the match type
*/
var Match = function(index, classes, type, length, match, precedence) {
    this.index = index;
    this.classes = classes;
    this.type = type;
    this.length = length;
    this.match = match;
    this.precedence = precedence;
}

/**
* A class for the Regex Highlighter
* @author Mark Hillman <mark@markhillman.info>
* @class
*
*   @param {string} [returnClassName] - The class name to add to the span tags
*       once a pattern has been matched
*/
var RegexHighlighter = function(returnClassName) {
    this.returnClassName = returnClassName;
    if (typeof this.returnClassName === "undefined")
        this.returnClassName = "regex-highlight";
}

/**
* A function to sort the values of the passed in array, first by their indicies
* then by their precedence.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {Match[]} array - Array of regex match objects
*/
RegexHighlighter.prototype.sortArrayByObjectsIndex = function(array) {
    array.sort(function compareObj(a, b) {
        if (a.index == b.index)
            return a.precedence - b.precedence;
        else
            return a.index - b.index;
    });
}

/**
* Remove duplicate objects from the array using a function passed into this
* function. The array should contain Regex match objects and the shouldRemove
* function should work in a similar way to a compare function in most
* imperative languages. This means that <0 will remove the item on the left,
* >0 will remove the item on the right. 0 will not remove anything
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {Match[]} array - The array which will have its duplicate items
*       removed from
*   @param {function} shouldRemove - A callback function to decide what will be removed
*/
RegexHighlighter.prototype.removeDuplicateObjectsFromArray = function(array, shouldRemove) {
    for (var i = 1; i < array.length; i++) {
        var side = shouldRemove(array[i-1], array[i]);
        if (side != 0) {
            if (side < 0) {
                array.splice(i-1, 1);
                i--;
            }
            else {
                array.splice(i, 1);
                i--;
            }
        }
    }
}

/**
* Wraps a given piece of text with a span tag that has a class.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} text - The text as a whole
*   @param {string} [classes] - The classes to give the wrapping
*   @param {number} [start] - The start point of the wrapping
*   @param {number} [end] - The end point of the wrapping
*/
RegexHighlighter.prototype.wrapTextWithSpan = function(text, classes, start, end) {
    if (typeof text === "undefined") return false;
    if (typeof classes === "undefined") classes = "";
    if (typeof start === "undefined") start = 0;
    if (typeof end === "undefined") end = text.length;

    // Get the text at different points
    var beginning = text.substring(0, start);
    var middle = text.substring(start, end);
    var ending = text.substring(end);

    // Wrap the match with a span
    return beginning + "<span class='" + classes + "'>" + middle + "</span>" + ending;
}

/**
* This function will return all of the matches that an object which contains
* different regex patterns will match with a string
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {Object} regexObject - This is the object which contains all of
*       the regex information. It can be loaded from a file, see JSON
*       examples for how to create these.
*   @param {string} string - This is the text that needs to be converted to
*       its highlighted form
*/
RegexHighlighter.prototype.getMatchesArrayFromRegex = function(regexObject, string) {
    var matchesArray = [];
    var precedenceCounter = 1;
    for (var index = 0; index < regexObject.length; index++) {
        var matchObject = regexObject[index];
        var type = matchObject["type"];
        var regexes = matchObject["regexes"];
        var precedence;

        // Check if the precedence option has been set in the syntax
        if (matchObject.precedence) {
            if (isNaN(matchObject.precedence)) {
                var found = false;
                for (var i = 0; i < matchesArray.length; i++)
                    if (matchObject.precedence ==  matchesArray[i].type) {
                        precedence = matchesArray[i].precedence;
                        found = true;
                        break;
                    }
                if (!found)
                    precedence = precedenceCounter;
            }
            else
                precedence = parseInt(matchObject.precedence);
            precedenceCounter--;
        }
        else
            precedence = precedenceCounter;

        // loop the individual regex
        for (var i = 0; i < regexes.length; i++) {
            var regexString, captureGroup;
            if (typeof regexes[i] === "string") { // Just a single regex
                regexString = regexes[i];
                captureGroup = 0;
            }
            else { // Regex object provided
                regexString = regexes[i]["regexString"];
                captureGroup = regexes[i]["captureGroup"];
            }
            var matches = this.findRegexMatches(string, regexString, captureGroup,
                type, precedence);
            matchesArray.push.apply(matchesArray, matches);
        }
        precedenceCounter++;
    }
    return matchesArray;
}

/**
* This function finds all of the regex matches in a string from a regex string,
* it will collect only the elements in the specified capture group. An array
* containing Match Objects will be returned.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} string - The string to search
*   @param {string} regexString - The regex string to use
*   @param {number} captureGroup - The capture group to collect
*   @param {string} type - The type class that will given to the Match object
*       so that it can be individually styled
*   @param {number} precedence - The precedence to be given to the Match Object
*/
RegexHighlighter.prototype.findRegexMatches = function(string, regexString, captureGroup, type, precedence) {
    var matchesArray = [];
    var reg = new RegExp(regexString, "gm");
    while (match = reg.exec(string)) {
        var index = match.index;
        if (captureGroup >= match.length)
            captureGroup = 0;

        // Compensate for captureGroup moving the start of match
        var matchText = match[captureGroup];
        var offset = match[0].indexOf(matchText);

        // Save the results into an object array
        matchObject = new Match(index + offset, this.returnClassName + " " + type,
            type, matchText.length, matchText, precedence);
        matchesArray.push(matchObject);
    }
    return matchesArray;
}

/**
* Default duplicate function for the {@link insertSyntaxHighlighting} function
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {Match} a - This is the left regex match
*   @param {Match} b - This is the right regex match
*/
RegexHighlighter.prototype.defaultDuplicateFunction = function(a, b) {
    if (a.index == b.index) {
        if (a.precedence == b.precedence) {
            if (a.length == b.length)
                return -1;
            else
                return a.length - b.length;
        }
        else
            return a.precedence - b.precedence;
    }

    // If b completely contained within a, remove b
    else if (b.index > a.index && (b.index + b.length) < (a.index + a.length))
        return 1;

    // If b starts inside a, but continues past the end of a
    else if (b.index > a.index && b.index < a.index + a.length &&
            (b.index + b.length) >= (a.index + a.length)) {
        if (a.precedence != b.precedence)
            return a.precedence - b.precedence;
        else if (a.length != b.length)
            return a.length - b.length;
        else
            return -1;
    }
    return 0;
}

/**
* This function inserts the span tags into the string and returns a new string
* which can be added to the page or printed to console. This is the main function
* for where all of the sub functions are called. As well as where the main duplicateFunction
* is defined if one is not passed in.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {Object} regexObject - This is the object which contains all of
*       the regex information. It can be loaded from a file, see JSON examples
*       for how to create these.
*   @param {string} string - This is the text that needs to be converted to
*       its highlighted form.
*   @param {function} [duplicateFunction] - This is the function which will be
*       used to remove any duplicate matches from the highlighting.
*/
RegexHighlighter.prototype.insertSyntaxHighlighting = function(regexObject, string, duplicateFunction) {
    if (typeof duplicateFunction === "undefined") {
        duplicateFunction = this.defaultDuplicateFunction;
    }

    // Finds all of the matches and stores them into an array
    var matchesArray = this.getMatchesArrayFromRegex(regexObject, string);

    // Sort and remove latter matches so its top priority
    this.sortArrayByObjectsIndex(matchesArray);

    // Remove objects which are direct matches and if they are inside a wrapping
    // pattern match
    // < is remove left
    // > is remove right
    // 0 is dont remove
    this.removeDuplicateObjectsFromArray(matchesArray, duplicateFunction);

    // Return the new string with its matches wrapped in span tags
    return this.assembleNewStringFromMatchArray(string, matchesArray);
}

/**
* Loads elements from the document via a className like the
* {@link loadSyntaxHighlightingByClass} but this function will use a
* regexObject directly from code, instead of loading one from a directory.
* If no className is given to load the elements, then it will use the
* default of 'regex-color'.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} regexObject - This is the object that will be used to
*       highlight the text page elements need to be highlighted.
*   @param {string} [className] - This is the className that will be used
*       to identify what elements on the page need to be highlighted
*/
RegexHighlighter.prototype.insertSyntaxHighlightingByClass = function(regexObject, className) {
    if (typeof regexObject === "undefined") {
        return false;
    }
    if (typeof className === "undefined") {
        className = "regex-color";
    }

    // Get the blocks with the correct class
    var codeBlocks = document.getElementsByClassName(className);
    var matchesArray = [];

    // Loop through the codeblocks and wrap the matches
    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i];
        var code = codeBlock.innerHTML;
        result = this.insertSyntaxHighlighting(regexObject, code);
        if (result) {
            codeBlock.innerHTML = result;
        }
    }
    return true;
}

/**
* The main function to add regex-highlighting to any element on the page. The
* elements will be loaded by a class supplied to the function, then they will
* have their innerHTML highlighted by inserting span tags with the the default
* class of 'regex-color'. The regex languages will be searched for in the specified
* languagesFolderPath variable, if no path is given, then the default path will be
* './languages/'.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} [className] - The className that will be used to identify which
*       page elements need to be highlighted.
*   @param {string} [languagesFolderPath] - This is the path to the languages
*       folder, so that any languages that can be used, will be found
*/
RegexHighlighter.prototype.loadSyntaxHighlightingByClass = function(className,
        languagesFolderPath) {
    if (typeof languagesFolderPath === "undefined")
        languagesFolderPath = "languages/";
    if (typeof className === "undefined")
        className = "regex-color";
    var elements = document.getElementsByClassName(className);

    // Get the second class as it should be the language name
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var classes = element.className.split(" ");
        if (classes.length > 1) {
            var language = classes[1];

            // Load the file from highlight folder and insert async
            ajaxGET(languagesFolderPath + language + ".json", function (response, passedElement) {
                var syntax = JSON.parse(response);
                var result = this.insertSyntaxHighlighting(syntax, passedElement.innerHTML);
                if (result) {
                    passedElement.innerHTML = result;
                }
            }.bind(this), element);
        }
    }
};

/**
* Produces a string which contains the new highlighting, by wrapping matches
* in the passed array in a span tag with the corresponding class. In order
* to make sure this functions correctly, it uses an offset and a pre-built
* match array. When actually wrapping a match with a span, the method
* {@link wrapTextWithSpan} is used.
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} string - The string which will be highlighted via the
*       match array
*   @param {Match[]} array - The array which contains all the match information
*/
RegexHighlighter.prototype.assembleNewStringFromMatchArray = function(string, array) {
    var offset = 0;
    for (var i = 0; i < array.length; i++) {
        var match = array[i];
        var index = match.index + offset;
        var classes = match.classes;
        var length = match.length;
        string = this.wrapTextWithSpan(string, classes, index, index + length);

        // Update the offset
        offset += ("<span class=''></span>" + classes).length;
    }
    return string;
};

/**
* Retrieves files and data via a HTTP GET call using the XMLHttpRequest
* class. This function has support for a callback function when it is finished
* as well as passing a bundle object back to the callback function when
* everything is complete. This function is asynchronous!
* @author Mark Hillman <mark@markhillman.info>
*
*   @param {string} url - the url of the resource
*   @param {function} [callback] - A callback to be made when the resource has
*       been retrieved.
*   @param {Object} [bundle] - A bundle object to be passed to the callback
*/
RegexHighlighter.prototype.ajaxGET = function(url, callback, bundle) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText, bundle);
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

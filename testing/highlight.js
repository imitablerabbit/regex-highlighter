// This function will load the language from the languages folder
// the languages folder, if not specified, should be in the same folder as the script
// The className is the class that will be added to all of the span tags, so that
// they can be found at a later date. The span tags will also have an extra class
// which is the label used in the language rules.
//   Vars:
//   [className] = This is the className that will be used to identify which page
//                 elements need to be highlighted.
//   [languagesFolderPath] = This is the path to the languages folder, so that any
//                           languages that can be used, will be found
function loadSyntaxHighlightingByClass(className, languagesFolderPath) {
    if (typeof languagesFolderPath === "undefined") {
        languagesFolderPath = "languages/";
    }
    if (typeof className === "undefined") {
        className = "regex-color";
    }
    var elements = document.getElementsByClassName(className);

    // Get the second class as it should be the language name
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var classes = element.className.split(" ");
        if (classes.length > 1) {
            language = classes[1];

            // Load the file from highlight folder and insert async
            ajaxGET(languagesFolderPath + language + ".json", function (response, passedElement) {
                var syntax = JSON.parse(response);
                result = insertSyntaxHighlighting(syntax, passedElement.innerHTML);
                if (result) {
                    passedElement.innerHTML = result;
                }
            }, element);
        }
    }
}

// This function will highlight any elements innerHTML using the regex
// objects elements given.
// This function is a helper function for the insertSyntaxHighlighting function.
//   Vars:
//   regexObject = This is the object that will be used to highlight the text
//   [className] = This is the className that will be used to identify what elements
//               on the page need to be highlighted
function insertSyntaxHighlightingByClass(regexObject, className) {
    if (typeof regexObject === "undefined") {
        return false;
    }
    if (typeof className === "undefined") {
        className = "regex-highlight";
    }

    // Get the blocks with the correct class
    var codeBlocks = document.getElementsByClassName(className);
    var matchesArray = [];

    // Loop through the codeblocks and wrap the matches
    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i];
        var code = codeBlock.innerHTML;
        result = insertSyntaxHighlighting(regexObject, code);
        if (result) {
            codeBlock.innerHTML = result;
        }
    }
    return true;
}

// This function inserts the span tags into the string and returns a new string
// which can be added to the page or printed to console. This is the main function
// for where all of the sub functions are called. As well as where the main duplicateFunction
// is defined if one is not passed in
//   Variables:
//   regexObject = This is the object which contains all of the regex information.
//                 It can be loaded from a file, see JSON examples for how to
//                 create these.
//   string = This is the text that needs to be converted to its highlighted
//            form.
//   [returnClassName] = This is the class name that will be given to span tags in
//                       order to identify the output matches
//   [duplicateFunction] = This is the function which will be used to remove any duplicate
//                       matches from the highlighting.
function insertSyntaxHighlighting(regexObject, string, returnClassName, duplicateFunction) {
    if (typeof returnClassName === "undefined") {
        returnClassName = "regex-highlight";
    }
    if (typeof duplicateFunction === "undefined") {
        duplicateFunction = function(a, b) {
            if (a.index == b.index) {
                if (a.precidence == b.precidence) {
                    if (a.length == b.length)
                        return -1;
                    else
                        return a.length - b.length;
                }
                else
                    return a.precidence - b.precidence;
            }
            // If b completely contained within a, remove b
            else if (b.index > a.index && (b.index + b.length) < (a.index + a.length)) {
                return 1;
            }
            // If b starts inside a, but continues past the end of a
            else if (b.index > a.index && b.index < a.index + a.length &&
                    (b.index + b.length) >= (a.index + a.length)) {
                if (a.precidence != b.precidence) {
                    return a.precidence - b.precidence;
                }
                else if (a.length != b.length) {
                    return a.length - b.length
                }
                else {
                    return -1;
                }
            }
            return 0;
        };
    }

    // Finds all of the matches and stores them into an array
    var matchesArray = getMatchesArrayFromRegex(regexObject, string, returnClassName);

    // Sort and remove latter matches so its top priority
    sortArrayByObjectsIndex(matchesArray);

    // Remove objects which are direct matches and if they are inside a wrapping
    // pattern match
    // < is remove left
    // > is remove right
    // 0 is dont remove
    removeDuplicateObjectsFromArray(matchesArray, duplicateFunction);

    // Return the new string with its matches wrapped in span tags
    return assembleNewStringFromMatchArray(string, matchesArray);
}

//
// UTILS
//
// This function will return all of the matches that an object which contains
// different regex patterns will match with a string
//   Vars:
//   regexObject = This is the object which contains all of the regex information.
//                 It can be loaded from a file, see JSON examples for how to
//                 create these.
//   string = This is the text that needs to be converted to its highlighted
//            form.
//   [returnClassName] = This is the class name that will be given to span tags in
//                       order to identify the output matches
function getMatchesArrayFromRegex(regexObject, string, returnClassName) {
    var matchesArray = [];

    // Loop through the different regexes and store any matches into an array
    var counter = 1;
    for (var type in regexObject) {
        var matchObject = regexObject[type];
        var regexes = matchObject.regexes;

        // loop the individual regex
        for (var i = 0; i < regexes.length; i++) {
            regex = regexes[i];
            var reg = new RegExp(regex, "gm");
            while (match = reg.exec(string)) {
                var index = match.index;
                var matchText = match[match.length-1]; // Get the last captured group
                if (typeof matchText == "undefined")
                    continue;

                // Check if the precedence option has been set in the syntax
                var precidence;
                if (matchObject.precedence) {
                    if (isNaN(matchObject.precedence)) {
                        var found = false;
                        for (var i = 0; i < matchesArray.length; i++) {
                            if (matchObject.precedence ==  matchesArray[i].type) {
                                precedence = matchesArray[i].precedence;
                                counter--; // Cancel increment this turn
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            precedence = counter;
                    }
                    else {
                        precedence = parseInt(matchObject.precedence);
                        counter--;
                    }
                }
                else
                    precedence = counter;

                // Save the results into an object array
                object = {
                    "index": index,
                    "classes": returnClassName + " " + type,
                    "type": type,
                    "length": matchText.length,
                    "match": matchText,
                    "precedence": precedence
                }
                matchesArray.push(object);
            }
        }
        counter++;
    }
    return matchesArray;
}

// Order the array passed by the index of the contained objects
//   Vars:
//   array = This is the array that should be sorted into index then precedence
function sortArrayByObjectsIndex(array) {
    array.sort(function compareObj(a, b) {
        if (a.index == b.index) {
            if (a.precedence == b.precedence) {
                return 0;
            }
            else {
                return a.precedence - b.precedence;
            }
        }
        else {
            return a.index - b.index;
        }
    });
}

// This function removes any duplicate items from an already sorted array
// It will always remove from the right.
//   Vars:
//   array = This is the array that should have ites items removed
//   shouldRemove = This is a function which indicates which items should
//                  be removed from the array
function removeDuplicateObjectsFromArray(array, shouldRemove) {
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

// Assemble the new string where matches are wrapped in span tags with a new
// class attached to them
function assembleNewStringFromMatchArray(string, array) {
    var offset = 0;
    for (var i = 0; i < array.length; i++) {
        var match = array[i];
        var index = match.index;
        var classes = match.classes;
        var length = match.length;
        string = wrapTextWithSpan(string, index + offset, index + length + offset, classes);

        // Update the offset
        offset += ("<span class=''></span>" + classes).length;
    }
    return string;
}

// This function wraps some text at the start point to the end point
// with a span which has a class of syntaxType
function wrapTextWithSpan(text, start, end, classes) {

    // Get the text at different points
    var beginning = text.substring(0, start);
    var middle = text.substring(start, end);
    var ending = text.substring(end);

    // Wrap the match with a span
    return beginning + "<span class='" + classes + "'>" + middle + "</span>" + ending;
}

// This will make the AJAX call and make a call to callback. The bundle
// object is a package of data that will be sent to every callback without losing
// the meaning of what it contains due to async
function ajaxGET(url, callback, bundle) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText, bundle);
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

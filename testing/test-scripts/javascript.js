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

"Wrapping"
"Multi-line
wrapping wrong"
/*multi
line comment correct*/
/*multi
line comment with wrapping "hello" correct*/
"Wrapping with --comment inside"
"Wrapping which has been\" escaped "
"Number 1 inside wrapping"
// comment which "has a wrapping"

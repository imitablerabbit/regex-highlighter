// This will load the content of any element which has the include attribute
// that is also linking to a file. The bundle object that is passed to the
// callback provided just contains the node that the load function is currently
// operating on as well as the current index of the node being called.
// This allows for me to call the callback function on the last node
function loadIncludes(callback) {

    // Get all the elements with a 'include' attribute
    nodes = document.querySelectorAll("[include]");
    for (var i = 0; i < nodes.length; i++) {
        var file = nodes[i].getAttribute('include');

        // Create an object to pass to anon function
        bundle = {
            node: nodes[i],
            currentIndex: i
        }

        // Make function call with object passed
        ajaxGET(file, function(responseText, bundle) {
            bundle.node.innerHTML = responseText;

            // Make the callback only on the last node
            if (bundle.currentIndex == nodes.length - 1) {
                if (callback)
                    callback(bundle);
            }
        }, bundle);
    }
}

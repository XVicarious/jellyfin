define([], function() {
    "use strict";

    function replaceAll(str, find, replace) {
        return str.split(find).join(replace)
    }
    return function(options) {
        "string" == typeof options && (options = {
            text: options
        });
        var text = replaceAll(options.text || "", "<br/>", "\n");
        return alert(text), Promise.resolve()
    }
});
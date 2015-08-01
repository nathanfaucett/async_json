var asyncJSON = require("../..");


console.time("async");
asyncJSON.stringify({
    key: "value"
}, function(error, json) {
    if (error) {
        throw error;
    } else {
        asyncJSON.parse(json, function(error, json) {
            if (error) {
                throw error;
            } else {
                console.timeEnd("async");
            }
        });
    }
});


console.time("sync");
JSON.parse(JSON.stringify({
    key: "value"
}));
console.timeEnd("sync");
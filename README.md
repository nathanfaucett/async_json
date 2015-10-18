asyncJSON
=======

async JSON parse/stringify for the browser and node.js

# Install
```bash
$ npm install git://github.com/nathanfaucett/async_json --save
```

# Usage
```javascript
var asyncJSON = require("async_json");


asyncJSON.stringify({
        key: "value"
    },
    null, // optional replacer,
    2, // optional space,
    function onStringify(error, string) {
        var reviver;

        if (error) {
            // handle error
            console.log(error);
        } else {
            reviver = {
                key2: "value2"
            };

            asyncJSON.parse(
                string,
                reviver, // optional reviver
                function onParse(error, object) {
                    if (error) {
                        // handle error
                        console.log(error);
                    } else {
                        // object === { key: "value", key2: "value2" };
                        console.log(object);
                    }
                }
            );
        }
    }
)
```

# Docs

#### stringify(value[, replacer[, space]], callback)
    method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.

#### parse(text[, reviver], callback)
    method parses a string as JSON, optionally transforming the value produced by parsing.

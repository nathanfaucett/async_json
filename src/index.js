var isFunction = require("@nathanfaucett/is_function"),
    isObject = require("@nathanfaucett/is_object"),
    extend = require("@nathanfaucett/extend"),
    messenger = require("./messenger");


var asyncJSON = exports;


asyncJSON.parse = function parse(value, reviver, callback) {
    if (isFunction(reviver)) {
        callback = reviver;
        reviver = undefined;
    }

    if (isObject(reviver)) {
        messenger.emit("parse", value, function onParse(error, json) {
            if (error) {
                callback(error);
            } else {
                callback(undefined, extend(reviver, json));
            }
        });
    } else {
        messenger.emit("parse", value, callback);
    }
};

asyncJSON.stringify = function stringify(value, replacer, space, callback) {
    if (isFunction(space)) {
        callback = space;
        space = undefined;
    }
    if (isFunction(replacer)) {
        callback = replacer;
        replacer = undefined;
        space = undefined;
    }

    messenger.emit("stringify", {
        value: value,
        replacer: replacer,
        space: space
    }, callback);
};
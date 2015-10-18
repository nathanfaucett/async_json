(function(dependencies, undefined, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, global) {

global.asyncJSON = require(1);


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


},
function(require, exports, module, global) {

var isFunction = require(2),
    isObject = require(3),
    extend = require(7),
    messenger = require(15);


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


},
function(require, exports, module, global) {

var objectToString = Object.prototype.toString,
    isFunction;


if (objectToString.call(function() {}) === "[object Object]") {
    isFunction = function isFunction(value) {
        return value instanceof Function;
    };
} else if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(value) {
        return objectToString.call(value) === "[object Function]";
    };
} else {
    isFunction = function isFunction(value) {
        return typeof(value) === "function" || false;
    };
}


module.exports = isFunction;


},
function(require, exports, module, global) {

var isNullOrUndefined = require(4);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNullOrUndefined(value) && type === "object") || false;
}


},
function(require, exports, module, global) {

var isNull = require(5),
    isUndefined = require(6);


module.exports = isNullOrUndefined;

/**
  isNullOrUndefined accepts any value and returns true
  if the value is null or undefined. For all other values
  false is returned.
  
  @param {Any}        any value to test
  @returns {Boolean}  the boolean result of testing value

  @example
    isNullOrUndefined(null);   // returns true
    isNullOrUndefined(undefined);   // returns true
    isNullOrUndefined("string");    // returns false
**/
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}


},
function(require, exports, module, global) {

module.exports = isNull;


function isNull(value) {
    return value === null;
}


},
function(require, exports, module, global) {

module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}


},
function(require, exports, module, global) {

var keys = require(8);


module.exports = extend;


function extend(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseExtend(out, arguments[i]);
    }

    return out;
}

function baseExtend(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];
        a[key] = b[key];
    }
}


},
function(require, exports, module, global) {

var has = require(9),
    isNative = require(10),
    isNullOrUndefined = require(4),
    isObject = require(3);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}


},
function(require, exports, module, global) {

var isNative = require(10),
    getPrototypeOf = require(14),
    isNullOrUndefined = require(4);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        return nativeHasOwnProp.call(object, key);
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}


},
function(require, exports, module, global) {

var isFunction = require(2),
    isNullOrUndefined = require(4),
    escapeRegExp = require(11);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        escapeRegExp(Object.prototype.toString)
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject;


module.exports = isNative;


function isNative(value) {
    return !isNullOrUndefined(value) && (
        isFunction(value) ?
        reNative.test(functionToString.call(value)) : (
            typeof(value) === "object" && (
                (isHostObject(value) ? reNative : reHostCtor).test(value) || false
            )
        )
    ) || false;
}

try {
    String({
        "toString": 0
    } + "");
} catch (e) {
    isHostObject = function isHostObject() {
        return false;
    };
}

isHostObject = function isHostObject(value) {
    return !isFunction(value.toString) && typeof(value + "") === "string";
};


},
function(require, exports, module, global) {

var toString = require(12);


var reRegExpChars = /[.*+?\^${}()|\[\]\/\\]/g,
    reHasRegExpChars = new RegExp(reRegExpChars.source);


module.exports = escapeRegExp;


function escapeRegExp(string) {
    string = toString(string);
    return (
        (string && reHasRegExpChars.test(string)) ?
        string.replace(reRegExpChars, "\\$&") :
        string
    );
}


},
function(require, exports, module, global) {

var isString = require(13),
    isNullOrUndefined = require(4);


module.exports = toString;


function toString(value) {
    if (isString(value)) {
        return value;
    } else if (isNullOrUndefined(value)) {
        return "";
    } else {
        return value + "";
    }
}


},
function(require, exports, module, global) {

module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}


},
function(require, exports, module, global) {

var isObject = require(3),
    isNative = require(10),
    isNullOrUndefined = require(4);


var nativeGetPrototypeOf = Object.getPrototypeOf,
    baseGetPrototypeOf;


module.exports = getPrototypeOf;


function getPrototypeOf(value) {
    if (isNullOrUndefined(value)) {
        return null;
    } else {
        return baseGetPrototypeOf(value);
    }
}

if (isNative(nativeGetPrototypeOf)) {
    baseGetPrototypeOf = function baseGetPrototypeOf(value) {
        return nativeGetPrototypeOf(isObject(value) ? value : Object(value)) || null;
    };
} else {
    if ("".__proto__ === String.prototype) {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.__proto__ || null;
        };
    } else {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.constructor ? value.constructor.prototype : null;
        };
    }
}


},
function(require, exports, module, global) {

var environment = require(16),
    Messenger = require(17),
    MessengerWorkerAdapter = require(18),
    messengerAdapter;


var messenger;


if (typeof(Worker) === "undefined" || environment.node) {
    messengerAdapter = require(19);
    require(21);
    messenger = new Messenger(messengerAdapter.client);
} else {
    messenger = new Messenger(new MessengerWorkerAdapter(require(23)));
}


module.exports = messenger;


},
function(require, exports, module, global) {

var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.worker = typeof(importScripts) !== "undefined";

environment.browser = environment.worker || !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.worker && !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};


},
function(require, exports, module, global) {

var MESSENGER_ID = 0,
    MessengerPrototype;


module.exports = Messenger;


function Messenger(adapter) {
    var _this = this;

    this.__id = (MESSENGER_ID++).toString(36);
    this.__messageId = 0;
    this.__callbacks = {};
    this.__listeners = {};

    this.__adapter = adapter;

    adapter.addMessageListener(function onMessage(data) {
        _this.onMessage(data);
    });
}
MessengerPrototype = Messenger.prototype;

MessengerPrototype.onMessage = function(message) {
    var id = message.id,
        name = message.name,
        callbacks = this.__callbacks,
        callback = callbacks[id],
        listeners, adapter;

    if (name) {
        listeners = this.__listeners;
        adapter = this.__adapter;

        if (listeners[name]) {
            Messenger_emit(this, listeners[name], message.data, function emitCallback(error, data) {
                adapter.postMessage({
                    id: id,
                    error: error || undefined,
                    data: data
                });
            });
        }
    } else {
        if (callback && isMatch(id, this.__id)) {
            callback(message.error, message.data, this);
            delete callbacks[id];
        }
    }
};

MessengerPrototype.emit = function(name, data, callback) {
    var id = this.__id + "-" + (this.__messageId++).toString(36);

    if (callback) {
        this.__callbacks[id] = callback;
    }

    this.__adapter.postMessage({
        id: id,
        name: name,
        data: data
    });
};

MessengerPrototype.send = MessengerPrototype.emit;

MessengerPrototype.on = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name] || (listeners[name] = []);

    listener[listener.length] = callback;
};

MessengerPrototype.off = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name],
        i;

    if (listener) {
        i = listener.length;

        while (i--) {
            if (listener[i] === callback) {
                listener.splice(i, 1);
            }
        }

        if (listener.length === 0) {
            delete listeners[name];
        }
    }
};

function Messenger_emit(_this, listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function done(error, data) {
        if (called === false) {
            called = true;
            callback(error, data);
        }
    }

    function next(error, data) {
        if (error || index === length) {
            done(error, data);
        } else {
            listeners[index++](data, next, _this);
        }
    }

    next(undefined, data);
}

function isMatch(messageId, id) {
    return messageId.split("-")[0] === id;
}


},
function(require, exports, module, global) {

var isString = require(13),
    environment = require(16);


var MessengerWorkerAdapterPrototype,
    globalWorker;


if (environment.worker) {
    globalWorker = self;
}


module.exports = MessengerWorkerAdapter;


function MessengerWorkerAdapter(url) {
    this.__worker = environment.worker ? globalWorker : (isString(url) ? new Worker(url) : url);
}
MessengerWorkerAdapterPrototype = MessengerWorkerAdapter.prototype;

MessengerWorkerAdapterPrototype.addMessageListener = function(callback) {
    this.__worker.addEventListener("message", function onMessage(e) {
        callback(JSON.parse(e.data));
    });
};

MessengerWorkerAdapterPrototype.postMessage = function(data) {
    this.__worker.postMessage(JSON.stringify(data));
};


},
function(require, exports, module, global) {

var createMessengerAdapter = require(20);


module.exports = createMessengerAdapter();


},
function(require, exports, module, global) {

var MessengerAdapterPrototype;


module.exports = createMessengerAdapter;


function createMessengerAdapter() {
    var client = new MessengerAdapter(),
        server = new MessengerAdapter();

    client.socket = server;
    server.socket = client;

    return {
        client: client,
        server: server
    };
}

function MessengerAdapter() {
    this.socket = null;
    this.__messages = [];
}
MessengerAdapterPrototype = MessengerAdapter.prototype;

MessengerAdapterPrototype.addMessageListener = function(callback) {
    var messages = this.__messages;
    messages[messages.length] = callback;
};

MessengerAdapterPrototype.onMessage = function(data) {
    var messages = this.__messages,
        i = -1,
        il = messages.length - 1;

    while (i++ < il) {
        messages[i](data);
    }
};

MessengerAdapterPrototype.postMessage = function(data) {
    this.socket.onMessage(data);
};


},
function(require, exports, module, global) {

var process = require(22);
var Messenger = require(17),
    messengerAdapter = require(19);


var messenger = new Messenger(messengerAdapter.server);


messenger.on("parse", function(data, callback) {
    process.nextTick(function onNextTick() {
        var json;

        try {
            json = JSON.parse(data);
        } catch (e) {
            callback(e);
        }

        callback(undefined, json);
    });
});

messenger.on("stringify", function(data, callback) {
    process.nextTick(function onNextTick() {
        var string;

        try {
            string = JSON.stringify(data.value, data.replacer, data.space);
        } catch (e) {
            callback(e);
        }

        callback(undefined, string);
    });
});


},
function(require, exports, module, global) {

// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};


},
function(require, exports, module, global) {

var blob = new Blob([
    "var worker = this;",

    "worker.onmessage = function onMessage(e) {",
    "var jsonData = JSON.parse(e.data),",
    "data = jsonData.data,",
    "message = {",
    "id: jsonData.id,",
    "data: null,",
    "error: null",
    "};",

    "if (jsonData.name === \"parse\") {",
    "try {",
    "message.data = JSON.parse(data);",
    "} catch(e) {",
    "message.error = e;",
    "}",
    "} else {",
    "try {",
    "message.data = JSON.stringify(data.value, data.replacer, data.space);",
    "} catch(e) {",
    "message.error = e;",
    "}",
    "}",

    "worker.postMessage(JSON.stringify(message));",
    "};"
]);


module.exports = new Worker(window.URL.createObjectURL(blob));


}], void 0, (new Function("return this;"))()));

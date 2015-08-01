var Messenger = require("messenger"),
    messengerAdapter = require("./messengerAdapter");


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

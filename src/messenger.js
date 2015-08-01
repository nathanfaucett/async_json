var environment = require("environment"),
    Messenger = require("messenger"),
    MessengerWorkerAdapter = require("messenger_worker_adapter"),
    messengerAdapter;


var messenger;


if (typeof(Worker) === "undefined" || environment.node) {
    messengerAdapter = require("./messengerAdapter");
    require("./nextTick");
    messenger = new Messenger(messengerAdapter.client);
} else {
    messenger = new Messenger(new MessengerWorkerAdapter(require("./worker")));
}


module.exports = messenger;

var environment = require("@nathanfaucett/environment"),
    Messenger = require("@nathanfaucett/messenger"),
    MessengerWorkerAdapter = require("@nathanfaucett/messenger_worker_adapter"),
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

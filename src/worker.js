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
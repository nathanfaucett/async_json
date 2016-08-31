var tape = require("tape"),
    asyncJSON = require("../src/index");


tape("asyncJSON(object)", function(assert) {
    asyncJSON.stringify({
        key: "value"
    }, function onStringify(error, json) {
        if (error) {
            assert.end(error);
        } else {
            assert.equal(json, "{\"key\":\"value\"}");

            asyncJSON.parse(json, function onParse(error, json) {
                if (error) {
                    assert.end(error);
                } else {
                    assert.deepEqual(json, {
                        key: "value"
                    });
                    assert.end();
                }
            });
        }
    });
});
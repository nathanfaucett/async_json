var tape = require("tape"),
    asyncJSON = require("../src/index");


tape("asyncJSON(object)", function(assert) {
    asyncJSON.stringify({
        key: "value"
    }, function(error, json) {
        if (error) {
            throw error;
        } else {
            assert.equal(json, "{\"key\":\"value\"}");

            asyncJSON.parse(json, function(error, json) {
                if (error) {
                    throw error;
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

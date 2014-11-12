var logger      = require("eazy-logger").Logger({
    prefix: "{magenta:[WDIFU] ",
    useLevelPrefixes: true,
    custom: {
        "i": function (string) {
            return this.compile("{cyan:" + string + "}");
        }
    }
});

module.exports.logger = logger;
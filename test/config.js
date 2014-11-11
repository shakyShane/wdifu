

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: process.env["WDIFU_BASE"],
    specs: [
        '*.js'
    ]
};
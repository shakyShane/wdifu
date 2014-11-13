var index = require("../index");

var out = {
    cwd: '/Users/shakyshane/code/selco-static',
    outDir: 'screenshots',
    base: 'http://selco.static',
    tests: [{hash: '3b358a56e2ede7927cf'},
        {hash: 'e1e418dfa7c7e9640b'}],
    paths: ['/buy/homepage.php']
}

describe("getting image data", function () {
    it("", function () {
        index.getImageData(out)
    });
});
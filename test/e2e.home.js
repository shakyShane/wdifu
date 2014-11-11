/**
 *
 */
// abstract writing screen shot to a file
//var fs   = require('fs');
var path = require('path');
var fs = require('fs-extra');

function writeScreenShot(data, dir, filename) {
    fs.ensureDirSync(dir);
    var stream = fs.createWriteStream(path.join(dir, filename));
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

function createScreenshotName(filepath) {
    console.log(path.basename(filepath));
    return "screenshots/" + path.basename(filepath) + ".png"
}

function getScreens (height, increment) {
    console.log(Math.ceil(height / increment));
}

var urls = [
    "/buy/homepage.php"
];

describe('Section Navigation', function() {
    var ptor = protractor.getInstance();
    var height;
    var inc;
    var hash;
    beforeEach(function () {
        inc = 480;
        hash = process.env["WDIFU_HASH"];
        browser.ignoreSynchronization = true;
        browser.manage().window().setSize(500, 588);
    });
    it("should contain the BS script element", function () {
        browser.get(urls[0]);
        doone(inc, hash, "homepage");
        //browser.get(urls[1]);
        //doone(inc, "654321", "product-1");
        //browser.get(urls[2]);
        //doone(inc, "654321", "product-2");
    });
});

function doone(inc, dir, name) {

    var ptor = protractor.getInstance();

    // Get document height from browser
    ptor.executeScript('return document.body.clientHeight').then(function (out) {

        // Get amount of screens needed
        var count = Math.ceil(out/inc);
        var tasks = [];

        for (var i = 0, n = count; i < n; i += 1) {
            tasks.push(i * inc);
        }

        var flow = protractor.promise.controlFlow();

        // push tasks onto the web driver stack
        tasks.forEach(function (val, i) {
            flow.execute(function () {
                return doScreenGrab(i, val, dir, name);
            });
        });
    });
}


function doScreenGrab (i, inc, dir, name) {
    var ptor = protractor.getInstance();
    return ptor.executeScript('window.scrollTo(0,'+(inc)+');').then(function (out) {
        ptor.executeScript('return window.scrollY').then(function (out) {});
        return browser.takeScreenshot();
    }).then(function (png) {
        var filename = name + "-" + i + ".png";
        return writeScreenShot(png, "screenshots/" + dir.slice(0, 5), filename);
    });
}
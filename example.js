var config = {
    base: "http://grenade.static",
    outDir: "screenshots",
    cwd: "/Users/shakyshane/code/grenade-static",
    tests: [
        {
            hash: "51f8e10c758788fe20c"
        },
        {
            hash: "master"
        }
    ],
    paths: [
        "/store-home.php"
    ]
};


require("./index")(config, function (err, out) {

});
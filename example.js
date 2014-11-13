var config = {
    base: "http://selco.static",
    outDir: "screenshots",
    cwd: "/Users/shakyshane/code/selco-static",
    tests: [
        {
            hash: "3b358a56e2ede7927cf"
        },
        {
            hash: "e1e418dfa7c7e9640b"
        }
    ],
    paths: [
        "/buy/homepage.php"
    ]
}


require("./index")(config, function (err, out) {

});
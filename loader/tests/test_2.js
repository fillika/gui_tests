function run() {
    return new Promise((resolve, reject) => {
        console.debug("::Starting test_2.js::");
        const modules = ["utils/regExpParser", Loader.Type.requirejs, "json/regExpGeneratorRules", Loader.Type.json];

        loader.loadBulk(modules, () => {
            const regExp = loader.getAsset("json/regExpGeneratorRules");
            const Parser = loader.getModule("utils/regExpParser");
            if (regExp == undefined || Parser == undefined) {
                console.error("FAIL::test_2");
                reject(false);
            } else {
                console.log("PASS::test_2", Parser);
                resolve(true);
            }
        });
    });
}

module.exports = run;

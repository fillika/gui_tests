function run() {
    console.debug("::Starting test_1.js::");
    return new Promise((resolve, reject) => {
        loader.load("utils/properties/compareParams", () => {
            const compareParams = loader.getModule("utils/properties/compareParams");
            if (compareParams == undefined) {
                console.error("FAIL::CompareParams not loaded");
                reject("FAIL::CompareParams not loaded");
            } else {
                console.log("PASS::CompareParams loaded", compareParams, compareParams(1, 1));
                resolve(true);
            }
        });
    });
}

module.exports = run;

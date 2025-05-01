function run() {
    return new Promise((resolve, reject) => {
        console.debug("::Starting test_3.js::");
        const newModules = [
            "providers/tools/promise", Loader.Type.requirejs,
        ];

        const success = () => {
            const Tools = loader.getModule("providers/tools/promise");
            if (Tools !== undefined) {
                console.log("::PASS::test_3::Tools is loaded");
                resolve();
            } else {
                console.error("FAIL::test_3::Tools hasn't loaded", err);
                reject();
            }
        }

        const fail = err => {
            console.error("FAIL::test_3::Tools hasn't loaded", err);
            reject(false);
        };

        loader.loadBulk(newModules, success, fail);
    });
}

module.exports = run;

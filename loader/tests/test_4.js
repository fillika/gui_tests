function run() {
    return new Promise((resolve, reject) => {
        // load new modules
        const newModules = [
            "component/button",
            "utils/size",
        ];

        console.debug("::Starting test_4.js::");
        loader.loadBulk(newModules, () => {
            const Button = loader.getModule(newModules[0]);
            const Size = loader.getModule(newModules[1]);

            if (Button == undefined || Size == undefined) {
                console.error("FAIL::test_4::New modules haven't load (Button, Size)");
                reject();
            }
            else {
                console.log("PASS::test_4::New modules loaded (Button, Size)");
                resolve();
            }
        });
    })
}

module.exports = run;

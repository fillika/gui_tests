function run() {
    return new Promise((resolve, reject) => {
        // load new modules
        const deps = [
            "utils/fontManager/fontManager",
        ];

        console.debug("::Starting test_5.js::");
        loader.loadBulk(deps, () => {
            const fonts = [
                ["Roboto", "styles/fonts/Roboto-Medium.ttf"],
            ];
            const FM = loader.getModule("utils/fontManager/fontManager");
            const fm = new FM(14);

            try {
                for (let i = 0; i < fonts.length; ++i) {
                    fm.load(fonts[i][0], fonts[i][1]);
                }
            } catch (error) {
                console.error("FAIL::test_5::Fonts haven't load");
                reject();
            }
            if (fm.ready) {
                console.error("FAIL::test_5::Fonts loaded");
                resolve();
            } else {
                console.error("FAIL::test_5::Fonts loaded");
                fm.one("ready", resolve);
            }
        });
    })
}

module.exports = run;

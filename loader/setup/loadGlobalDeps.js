async function loadGlobalDeps() {
    // note: Loading globals deps
    const deps = [
        "managers/themes/manager", 
        "component/visual",
        "utils/fontManager/fontManager",
    ];
    await loadBulk(deps, 
        () => {
            const ThemeManager = loader.getModule("managers/themes/manager");
            const Visual = loader.getModule("component/visual");
            global.themeManager = global.window.themeManager = new ThemeManager(ThemeManager.getThemeName("darkName"));
            Visual.themeManager = global.themeManager;

            global.tr = global.window.tr = () => {}; // todo: implement translation
        }, 
        () => {
            console.error("Failed to load dependencies");
            throw new Error("Failed to load dependencies", deps);
        },
    );

    // todo: get correct v2 libs and tools
    await loadBulk(
        [
            "providers/v2/factory", Loader.Type.requirejs,
            "providers/v2/tools/print", Loader.Type.requirejs,
        ], 
        () => {
        }, 
        () => {
            console.error("Failed to load dependencies");
            throw new Error("Failed to load dependencies", [
                "providers/v2/factory", Loader.Type.requirejs,
                "providers/v2/tools/print", Loader.Type.requirejs,
            ]);
        },
    );

    const loadFonts = () => {
        return new Promise((resolve, reject) => {
            // todo: add real fonts array
            const fonts = [
                ["Roboto", "styles/fonts/Roboto-Medium.ttf"],
            ];
            const FM = loader.getModule("utils/fontManager/fontManager");
            global.fm = global.window.fm = new FM(14);

            for (let i = 0; i < fonts.length; ++i) {
                global.fm.load(fonts[i][0], fonts[i][1]);
            }
            if (global.fm.ready) {
                resolve();
            } else {
                global.fm.one("ready", resolve);
            }
        });
    }
    await loadFonts();
}

module.exports = loadGlobalDeps;

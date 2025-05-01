require("module-alias/register");
const { loader, Loader } = require("@loader");

global.loadBulk = function (dependencies, callback, error) {
    return new Promise((resolve, reject) => {
        const success = () => {
            if (callback instanceof Function) {
                callback();
            }
            resolve();
        };
        const fail = () => {
            if (error instanceof Function) {
                error();
            }
            reject(new Error("Failed to load dependencies", dependencies));
        };
        loader.loadBulk(dependencies, success, fail);
    });
};

// setup globals
(async () => {
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
})();

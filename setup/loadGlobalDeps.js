export default async function loadGlobalDeps() {
    await handleConfig();
    const r_config = requirejs.s.contexts._.config;
    await handlePrerequisiteModules();
    await handleProviderSystemModule();

    async function handleConfig() {
        await loadBulk(["core/configs/gui"]);
        const config = loader.getModule("core/configs/gui");
        if (config) {
            writeToGlobal("conf", { gui: config });
        } else {
            throw new Error("Failed to load core/configs/gui");
        }
    }

    async function handlePrerequisiteModules() {
        const prerequisiteModules = [
            "providers/std/levels", Loader.Type.requirejs,
            "utils/extractQuery",
            "themes/themes", Loader.Type.requirejs,

            "sys_ui/wrapper/prompt/prompt", Loader.Type.requirejs,
            "external/i18n", Loader.Type.requirejs,

            "providers/tools/algorithm", Loader.Type.requirejs,
            "core/configs/connector", Loader.Type.requirejs,

            "managers/themes/manager",
            "component/visual",
            "system", Loader.Type.requirejs,
            "loginHandler",
            "loginScreen/baseComponent",
            "utils/ping",
            "providers/tools/dispatcher", Loader.Type.requirejs,
            'providers/system/connection', Loader.Type.requirejs,
            "utils/fontManager/fontManager",
        ];

        await loadBulk(prerequisiteModules, 
            () => {},
            (err) => {
                throw new Error(err);
            },
        );

        const system = loader.getModule("system");
        writeToGlobal("system", system);

        const configConnector = loader.getModule("core/configs/connector");
        conf.connector = configConnector;

        // Themes
        let _d = localStorage.getItem("darkTheme");
        let dark = _d === null ? conf.gui.darkTheme : JSON.parse(_d);

        const ThemesManager = loader.getModule("managers/themes/manager");
        writeToGlobal("themeManager", new ThemesManager(ThemesManager.getThemeName(dark)))
        const Visual = loader.getModule("component/visual");
        Visual.themeManager = global.themeManager;

        // Translation
        writeToGlobal("gi18n", global.i18n);
        gi18n.init({
            resGetPath: r_config.baseUrl + "../json/locales/__lng__/__ns__.json",
            getAsync: false,
            fallbackLng: "en",
            lng: conf.gui.locale,
            untranslatedHandler: function (obj) {
            }
        });
        writeToGlobal("tr", gi18n.t);

        const fontsLoading = loadFonts(global);
        const themeLoading = new Promise((res) => {
            if (Visual.themeManager._ready) {
                res();
            } else {
                Visual.themeManager.on("ready", res);
            }
        });
        Promise.all([fontsLoading, themeLoading]).then(() => {
            const dispatcherTools = loader.getModule("providers/tools/dispatcher");
            writeToGlobal("dispatcher", new dispatcherTools.dispatcher());
            const connection = loader.getModule("providers/system/connection");
            writeToGlobal("connection", new connection(dispatcher, conf.connector.connection));
        });
    }

    function loadFonts(global) {
        writeToGlobal("defaultFontFamilies", ['Roboto', 'Koliko', 'Tahoma']);
        writeToGlobal("defaultFontSize", 14);

        const FM = loader.getModule("utils/fontManager/fontManager");
        const fonts = [
            ["Roboto", "styles/fonts/Roboto-Medium.ttf"],
        ];

        writeToGlobal("fm", new FM(14));
        for (let i = 0; i < fonts.length; ++i) {
            global.fm.load(fonts[i][0], fonts[i][1]);
        }

        return new Promise((res) => {
            if (global.fm.ready) {
                res();
            } else {
                global.fm.one("ready", res);
            }
        });
    }

    async function handleProviderSystemModule() {
        const providerSystemModules = [
            "providers/tools/dispatcher", Loader.Type.requirejs,
            "providers/system/main", Loader.Type.requirejs,
            "core/configs/managers", Loader.Type.requirejs,
            "utils/state_watcher", Loader.Type.requirejs,
            "utils/basicExtend/basicextend"
        ];

        await loadBulk(providerSystemModules,
            () => {},
            (err) => {
                throw new Error(err);
            },
        );

        if (!global.ps) {
            const providers_system = loader.getModule("providers/system/main");
            const ps = new providers_system({
                config: {
                    gui: {
                        version: conf.gui.version,
                        connector: conf.connector
                    },
                    managers: loader.getModule("core/configs/managers")
                },
                locale: gi18n.lng(),
                dispatcher: dispatcher,
                load: handleOtherModules.bind(null, global),
                connection: global.connection,
            });

            ps.init();
            writeToGlobal("ps", ps);
        }

        if (!global.sw) {
            const state_watcher = loader.getModule("utils/state_watcher");
            writeToGlobal("sw", new state_watcher());
        }
    }

    async function handleOtherModules() {
        const otherModules = [
            "core/configs/connector", Loader.Type.requirejs,
            "core/configs/editor", Loader.Type.requirejs,
            "core/configs/chart", Loader.Type.requirejs,
            "core/configs/widgets", Loader.Type.requirejs,
            "utils/fontManager/fontManager",
        ];

        await loadBulk(otherModules,
            () => {},
            (err) => {
                throw new Error(err);
            },
        );

        conf.widgets = loader.getModule("core/configs/widgets");
        conf.connector = loader.getModule("core/configs/connector");
        conf.editor = loader.getModule("core/configs/editor");
        conf.chart = loader.getModule("core/configs/chart");

        // Fonts
        {
            if (global.fm === undefined) {
                loadFonts(global).then(() => {
                    handleCoreGuiModules();
                });
                return;
            }

            if (global.fm.ready) {
                handleOtherModules();
            } else {
                global.fm.one("ready", handleOtherModules);
            }
        }
    }

    async function handleCoreGuiModules() {
        const coreGuiModules = [
            "animations/spinner.css", Loader.Type.css,
            "animations/roller.css", Loader.Type.css,
            "animations/progress.css", Loader.Type.css,

            "core/gui", Loader.Type.requirejs,
        ];

        await loadBulk(coreGuiModules,
            () => {},
            (err) => {
                throw new Error(err);
            },
        );

        const CGui = loader.getModule("core/gui");
        writeToGlobal("gui", CGui);
        gui.init();
    }

    function writeToGlobal(key, value) {
        global[key] = global.window[key] = value;
    }
}

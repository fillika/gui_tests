const fs = require("fs");
const vm = require("vm");
const requirejs = require("requirejs");
const { paths } = require("../config");

/**
 * Monkey-патчит requirejs для Node.js, чтобы модули с `(this)` внутри strict-режима
 * работали корректно — `this` будет равен `globalThis`.
 */
function patchRequirejsForNode(verbose = true) {
    const sandbox = {
        console,
        require: requirejs,
        process,
        setTimeout,
        clearTimeout,
        exports: {},
        module: { exports: {} },
        global: global,
        globalThis: global,
        v2: Object.create(null),
        std: Object.create(null),
        define: requirejs.define,
        requirejs,
    };
    vm.createContext(sandbox);

    requirejs.load = function (context, moduleName, url) {
        const fullPath = requirejs.toUrl(url);

        if (verbose) {
            console.log(`[requirejs.load] loading ${moduleName} from ${fullPath}`);
        }

        let code;
        try {
            code = fs.readFileSync(fullPath, "utf8");
        } catch (err) {
            context.onError({
                requireModules: [moduleName],
                src: fullPath,
                originalError: err,
            });
            return;
        }

        // Заменим `(this)` на `(globalThis)`
        let patchedCode = code
            // .replace(/\(\s*this\s*\)/g, '(globalThis)')
            .replace(/['"]use strict['"]/g, "");

        // Добавляем глобавльные переменные в контекст
        patchedCode = `
            v2 = this.v2;
            std = this.std;
            ${patchedCode}
        `;

        try {
            const wrappedCode = `(function() { ${patchedCode} })()`;
            const script = new vm.Script(wrappedCode, { filename: fullPath });
            script.runInContext(sandbox);

            if (verbose) {
                console.log(`[requirejs.load] executed ${moduleName}`);
            }

            context.completeLoad(moduleName);

            globalThis.v2 = sandbox.v2;
            globalThis.std = sandbox.std;
        } catch (err) {
            console.error(`[requirejs.load] ERROR in ${moduleName}:`, err);
            context.onError({
                requireModules: [moduleName],
                src: fullPath,
                originalError: err,
            });
        }
    };
}
patchRequirejsForNode(false);

requirejs.config({
    baseUrl: paths.guiCode,
});

module.exports = requirejs;

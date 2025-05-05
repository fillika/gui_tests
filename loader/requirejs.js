const fs = require("fs");
const vm = require("vm");
const requirejs = require("requirejs");
const { paths } = require("../loader_config");

/**
 * Monkey-patch requirejs for Node.js to make modules with `(this)` inside strict mode
 * work correctly — `this` will be equal to `globalThis`.
 */
function patchRequirejsForNode(verbose = true) {
    const sandbox = Object.assign(global.window, {
        process,
        exports: {},
        module: { exports: {} },
        global: global,
        globalThis: global,
        v2: Object.create(null),
        std: Object.create(null),
        define: requirejs.define,
        require: requirejs,
        requirejs,
    });
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

        // Deleting `use strict` to prevent `this` from being `undefined` in strict mode
        let patchedCode = code
            .replace(/['"]use strict['"]\n/g, "")

        if (fullPath.includes("base64js.min")) {
            // Patch base64js.min code to not use `exports` and `module`
            patchedCode = patchedCode
                .replace(`typeof exports==="object"&&typeof module!=="undefined"`, "false");
        }

        // Add global variables to the context
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

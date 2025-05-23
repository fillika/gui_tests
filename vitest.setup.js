import path from "path";
import { fileURLToPath } from "url";
import { init } from "initi-loader";
import loadGlobalDeps from "./setup/loadGlobalDeps.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, "../");
const guiPath = path.join(rootPath, "gui");
const guiCodePath = path.join(guiPath, "js");
const loaderPath = path.join(guiCodePath, "external/loader/loader.js");
const requirejsPath = path.join(guiCodePath, "require/main.js");

const options = {
    paths: {
        root: rootPath,
        gui: guiPath,
        guiCode: guiCodePath,
        loader: loaderPath,
        requirejs: requirejsPath,
    },
    loaderOptions: {
        maxParallelLoadings: 20,
        seed: "" + new Date().getTime(),
        baseUrl: guiPath,
    },
};

if (globalThis.v2 === undefined) {
    await init(options);
    await loadGlobalDeps();
}

const setupDom = require("./setup/setupDOM");
setupDom();
const { loader, Loader } = require("./loader/main");
const createGlobalLoaderMethods = require("./setup/loaderMethods");
const loadGlobalDeps = require("./setup/loadGlobalDeps");

export default async function init() {
    globalThis.Loader = Loader;
    globalThis.loader = loader;
    global.loader = loader;
    global.Loader = Loader;

    await createGlobalLoaderMethods();
    await loadGlobalDeps();
}

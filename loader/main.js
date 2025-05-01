const setupDom = require("./setupDOM");
setupDom();
const { loader, Loader } = require("./loader/main");

globalThis.Loader = Loader;
globalThis.loader = loader;
global.loader = loader;
global.Loader = Loader;

module.exports = {
    loader: loader,
    Loader: Loader,
}

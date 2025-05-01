const { loader, Loader } = require("./init/loader/main");

globalThis.Loader = Loader;
globalThis.loader = loader;
global.loader = loader;
global.Loader = Loader;
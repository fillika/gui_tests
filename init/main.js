const { loader, Loader } = require("./loader/main");

global.Loader = Loader;
global.loader = loader;
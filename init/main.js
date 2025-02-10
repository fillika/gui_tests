const { loader, Loader } = require("./loader");
const reqjs = require("./requirejs");

global.Loader = Loader;
global.loader = loader;
global.requirejs = reqjs;
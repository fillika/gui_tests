const { paths } = require("./config");

const Loader = require(paths.loader);

global.Loader = Loader;
global.loader = new Loader({
    maxParallelLoadings: 20,
    seed: '' + (new Date()).getTime(),
    baseUrl: paths.guiCode,
});
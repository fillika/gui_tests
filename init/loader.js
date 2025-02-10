const { paths } = require("../config");

const Loader = require(paths.loader);

const loader = new Loader({
    maxParallelLoadings: 20,
    seed: '' + (new Date()).getTime(),
    baseUrl: paths.gui,
});

loader.setTypePath(Loader.Type.js, "js");
loader.setTypePath(Loader.Type.css, "styles");

module.exports = {
    loader,
    Loader,
}
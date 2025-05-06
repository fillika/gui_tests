const fs = require("fs");
const compileCodeToModule = require("../utils/compileCodeToModule");
const { paths } = require("../../loader_config");
const loaderScript = fs.readFileSync(paths.loader, "utf8");

function getLoader() {
    const Loader = compileCodeToModule(loaderScript, { filename: paths.loader, exportName: "Loader" });
    return Loader;
}

module.exports = getLoader;

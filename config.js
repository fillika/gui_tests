const path = require("path");
const rootPath = path.join(__dirname, '../');
const guiPath = path.join(rootPath, 'gui');
const guiCodePath = path.join(guiPath, 'js');
const loaderPath = path.join(guiCodePath, "external/loader/loader");

module.exports = {
    paths: {
        root: rootPath,
        gui: guiPath,
        guiCode: guiCodePath,
        loader: loaderPath,
    }
}
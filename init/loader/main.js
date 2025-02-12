
const { paths } = require("../../config");
const Loader = require(paths.loader);
const { refinePath, refineDependencies, loadedFileForBulk, load } = require("./utils");

class NewLoader extends Loader {
    load(path, callback, error, contentType) {
        if (!(error instanceof Function) && contentType === undefined) {
            contentType = error;
            error = undefined;
        }
        if (!(callback instanceof Function) && contentType === undefined) {
            contentType = callback;
            callback = undefined;
        }
        if (!contentType) {
            contentType = Type.js;
        }
        load.call(this,
            refinePath(path, contentType, this._baseUrl, this._typePaths, this._libs),
            callback, error, contentType, path);
    }

    loadBulk(dependencies, callback, error) {
        const deps = refineDependencies(dependencies);
        const callbacks = [];
        let progress = {
            count: deps.length,
            callback: callback
        };

        for (let i = 0; i < deps.length; ++i) {
            let element = deps[i];
            let elName = element.name;

            this._depsGraph.addNode(elName);

            let contentType = element.contentType;
            const depCallback = loadedFileForBulk.bind(this, elName, progress);
            callbacks.push(depCallback);

            this.load(elName, depCallback, error, contentType);
        }
    }
}

global.window = global;
global.addEventListener = function () { };

const loader = new NewLoader({
    maxParallelLoadings: 20,
    seed: '' + (new Date()).getTime(),
    baseUrl: paths.gui,
});

loader.setTypePath(Loader.Type.js, "js");
loader.setTypePath(Loader.Type.css, "styles");

module.exports = {
    loader: loader,
    Loader: NewLoader,
}
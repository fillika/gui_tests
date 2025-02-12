const requirejs = require("../requirejs");

const Type = {
    none: 0,
    js: 1,
    css: 2,
    json: 3,
    binary: 4,
    text: 5,
    requirejs: 6,
    blob: 7
};
const ReverseType = [
    "None",
    "JavaScript",
    "CSS",
    "JSON",
    "Binary",
    "Text",
    "RequireJS",
    "Blob"
];
const suffixes = [
    "",
    ".js",
    ".css",
    ".json",
    "",
    "",
    "",
    ""
];

function refinePath(path, type, baseUrl, types, libs) {
    const suffix = suffixes[type];
    const typePath = types[type] || "";
    if (!path.endsWith(suffix)) {
        path += suffix;
    }
    switch (type) {
        case Type.js:
            if (path[0] === "@") {
                const hops = path.split("/");
                const libName = hops[0].slice(1);
                let libPath = libs[libName];
                if (libPath === undefined) {
                    libPath = libName;
                }
                path = libPath + path.slice(libName.length + 1);
            }
            path = baseUrl + typePath + path;
            break;
        case Type.requirejs:
            path = requirejs.toUrl(path).split("?")[0] + ".js";
            break;
        default:
            path = baseUrl + typePath + path;
            break;
    }

    return path;
}

function refineDependencies(/*Array*/deps) {
    const result = [];
    const collection = Object.create(null);
    for (let i = 0; i < deps.length; ++i) {
        let element = deps[i];
        if (!collection[element] && typeof element === "string") {
            result.push({ name: element });
            collection[element] = true;
        } else if (result.length > 0 && typeof element === "number" && ReverseType[element] !== undefined) {
            let prevResult = result[result.length - 1];
            if (deps[i - 1] === prevResult.name) {
                prevResult.contentType = element;
            }
        }
    }
    return result
}

function loadedFileForBulk(/*String*/fileName, progress) {
    //console.log(fileName);
    progress.count -= 1;
    if (progress.count < 1) progress.callback.call(null, window);
}

function load(path, callback, error, contentType, originalName) {
    if (this._loadedFiles.has(path))
        return callCallback.call(this, path, callback, originalName);

    let loadingFile = this._loadingFiles[path];
    if (loadingFile === undefined)
        loadingFile = this._plannedFiles[path];

    if (loadingFile) {
        checkContentType(loadingFile.contentType, contentType, path);
        loadingFile.addSuccessHandler(callback);
        loadingFile.addErrorHandler(error);
        return;
    }

    loadingFile = new LoadingFile(contentType, originalName, callback, error);
    if (this._loadingCount < this._config.maxParallelLoadings) {
        executeLoad.call(this, path, loadingFile);
    } else {
        this._queue.push(path);
        this._plannedFiles[path] = loadingFile;
    }

    notifyProgressSubscribers.call(this);
}

class LoadingFile {
    /**
     * @param {Loader.Type} contentType
     * @param {String}      originalName
     * @param {Function}    callback
     * @param {Function}    error
     * */
    constructor(contentType, originalName, callback, error) {
        this.contentType = contentType;
        this.originalName = originalName;
        this.success = [];
        this.error = [];

        this.addSuccessHandler(callback);
        this.addErrorHandler(error);
    }
    destructor() {
        delete this.contentType;
        delete this.originalName;
        delete this.success;
        delete this.error;
    }
    addSuccessHandler(/*Function*/callback) {
        if (callback instanceof Function)
            this.success.push(callback);
    }
    addErrorHandler(/*Function*/callback) {
        if (callback instanceof Function)
            this.error.push(callback);
    }
    /**
     * @param {Function}    callback - a wrapper caller function, to call the actual callback (callCallback function in this file)
     * @param {Object}      context  - a context for the wrapper caller function (loader instance in this file)
     * @param {String}      path     - path to the file
     * */
    callSuccessHandlers(callback, context, path) {
        for (let i = 0; i < this.success.length; ++i)
            callback.call(context, path, this.success[i], this.originalName);
    }
    /**
     * @param {BasicError}  error   - error
     * */
    callErrorHandlers(error) {
        for (let i = 0; i < this.error.length; ++i)
            this.error[i](error);
    }
}

function callCallback(/*String*/path, /*Function*/callback, /*String*/originalName) {
    if (callback instanceof Function) {
        const module = this._modules[originalName];
        if (module) {
            if (module.executed) {
                callback(window, module.value);
            } else {
                module.callbacks.push(callback);
            }
        } else {
            const asset = this._loadedAssets[originalName];
            if (asset) {
                callback(asset);
            } else {
                callback(window);
            }
        }
    }
}

function executeLoad(/*String*/path, /*LoadingFile*/loadingFile) {
    this._loadingFiles[path] = loadingFile;
    ++this._loadingCount;

    const boundLoad = onLoaded.bind(this, path);
    const boundError = onError.bind(this, path);
    const boundRequireScriptCheck = requireScriptCheck.bind(this, path);
    switch (loadingFile.contentType) {
        case Type.js:
        case Type.json:
        case Type.binary:
        case Type.text:
        case Type.blob:
        case Type.css:
            getByNodeJSRequire(path, boundLoad, boundError);
            break;
        case Type.requirejs:
            requirejs([loadingFile.originalName], boundLoad, boundError, null, boundRequireScriptCheck);
            break;
    }
}

function getByNodeJSRequire(/*String*/path, /*Function*/callback, /*Function*/error) {
    try {
        const module = require(path);
        const event = {
            target: {
                response: module,
            }
        };
        callback(event);
    } catch (err) {
        error();
        console.error("Error loading module: " + err.message);
    }
}

function requireScriptCheck(path) {
    if (!this._requireLoadedFiles[path]) {
        this._requireLoadedFiles[path] = true;
        --this._loadingCount;
        if (this._loadingCount < this._config.maxParallelLoadings) {
            checkNextElement.call(this);
        }
    }
}

function onLoaded(/*String*/path, /*HTMLScriptElement*/event) {
    if (this._moduleErrors.length)
        return onModuleError.call(this, path, event);

    if (this._errors[path])
        return onError.call(this, path, event);

    if (!this._requireLoadedFiles[path]) {
        --this._loadingCount;
    }

    const loading = this._loadingFiles[path];
    this._loadedFiles.add(path);
    switch (loading.contentType) {
        case Type.json:
        case Type.binary:
        case Type.text:
        case Type.blob:
            this._loadedAssets[loading.originalName] = event.target.response;
            break;
        case Type.requirejs:
            if (!this._requireLoadedFiles[path]) {
                this._requireLoadedFiles[path] = true;
            }
            if (event) {
                this._modules[loading.originalName] = {
                    value: event,
                    executed: true
                };
            }
            break;
    }
    loading.callSuccessHandlers(callCallback, this, path);
    cleanUp.call(this, path, event);
    checkNextElement.call(this);
    notifyProgressSubscribers.call(this);
}

function onError(/*String*/path, /*HTMLScriptElement*/element) {
    if (!this._requireLoadedFiles[path]) {
        --this._loadingCount;
    }
    const loading = this._loadingFiles[path];
    const error = makeError.call(this, path, element);
    loading.callErrorHandlers(error);
    for (let i = 0; i < this._errorHandlers.length; ++i)
        this._errorHandlers[i](error)

    cleanUp.call(this, path, element);
    checkNextElement.call(this);
    notifyProgressSubscribers.call(this);
}

function makeError(/*String*/path, /*HTMLScriptElement*/element) {
    let error = this._errors[path];
    if (error instanceof BasicError)
        return error;

    let loading = this._loadingFiles[path];
    return new LoadError(path, loading.originalName);
}

function onModuleError(/*String*/path, /*HTMLScriptElement*/element) {
    if (!this._requireLoadedFiles[path]) {
        --this._loadingCount;
    }
    for (let i = 0; i < this._moduleErrors.length; ++i) {
        const error = this._moduleErrors[i];
        error.path = path;

        console.error(error.message);

        for (let i = 0; i < this._errorHandlers.length; ++i)
            this._errorHandlers[i](error)
    }
    this._moduleErrors = [];
    cleanUp.call(this, path, element);
    checkNextElement.call(this);
    notifyProgressSubscribers.call(this);
}

function cleanUp(/*String*/path, /*HTMLScriptElement*/element) {
    const loading = this._loadingFiles[path];
    delete this._loadingFiles[path];
    delete this._errors[path];
    switch (loading.contentType) {
        case Type.js:
            delete element.target.onload;
            delete element.target.onerror;
            break;
        case Type.css:
            delete element.target.onload;
            delete element.target.onerror;
            break;
        case Type.json:
        case Type.binary:
        case Type.text:
        case Type.blob:
            delete element.onload;
            delete element.onerror;
            break
    }
    loading.destructor();
}

function checkNextElement() {
    while (!this._queue.empty && (this._loadingCount < this._config.maxParallelLoadings)) {
        const path = this._queue.pop();
        const loadingFile = this._plannedFiles[path];
        delete this._plannedFiles[path];
        executeLoad.call(this, path, loadingFile);
    }
}

function notifyProgressSubscribers() {
    const pending = this.pendingFilesAmount;
    const loaded = this.loadedFilesAmount;
    for (let i = 0; i < this._progressHandlers.length; ++i) {
        const handler = this._progressHandlers[i];
        handler(loaded, pending, loaded + pending);
    }
}

class BasicError {
    /**
     * @param {String}  path         - path to the file that caused an error
     * @param {String}  originalName - original name of the loading file
     * */
    constructor(path, originalName) {
        this.path = path;
        this.originalName = originalName;
    }

    get message() { return "Unknown error about file " + this.originalName + " (" + this.path + ")" };
}

class LoadError extends BasicError {
    get message() {
        return "Couldn't load file " + this.originalName +
            " (" + this.path + ")";
    }
}

module.exports = {
    refinePath,
    refineDependencies,
    loadedFileForBulk,
    load,
};
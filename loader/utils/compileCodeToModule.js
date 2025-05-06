const path = require('path');
const Module = require('module');

function compileCodeToModule(code, { filename, exportName = "" }) {
    const module = new Module(filename);
    module.filename = filename;
    module.paths = Module._nodeModulePaths(path.dirname(filename));
    const finalCode = `${code}\n\nmodule.exports = ${exportName};`;
    module._compile(finalCode, filename);
    return module.exports;
}

module.exports = compileCodeToModule;

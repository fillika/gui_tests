const reqjs = require("requirejs");
const { paths } = require("../config");

reqjs.config({
    baseUrl: paths.guiCode,
});

module.exports = reqjs;

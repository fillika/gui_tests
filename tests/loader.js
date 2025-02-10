require("../init/main");

loader.load("test/mock", () => {
    console.log("PASS::Mock loaded");
});

const modules = [
    "utils/regExpParser", Loader.Type.requirejs,
    "json/regExpGeneratorRules", Loader.Type.json,
];

loader.loadBulk(modules, () => {
    const regExp = loader.getAsset("json/regExpGeneratorRules");
    const Parser = loader.getModule("utils/regExpParser");
    if (regExp == undefined || Parser == undefined)
        console.error("FAIL::RegExp rules not loaded");
    else
        console.log("PASS::Mock loaded", Parser);
});
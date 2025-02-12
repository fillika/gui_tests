require("../init/main");

loader.load("utils/properties/compareParams", () => {
    const compareParams = loader.getModule("utils/properties/compareParams");
    if (compareParams == undefined)
        console.error("FAIL::CompareParams not loaded");
    else
        console.log("PASS::CompareParams loaded", compareParams, compareParams(1, 1));
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
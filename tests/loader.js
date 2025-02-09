require("../initLoader");

loader.load("test/mock", () => {
    
});

// const modules = [
//     // "utils/regExpParser", Loader.Type.requirejs,
//     "json/regExpGeneratorRules", Loader.Type.json,
// ];

// loader.load("json/regExpGeneratorRules", Loader.Type.json, () => {
//     const regExpRules = loader.getModule("json/regExpGeneratorRules");

//     test('regExpRules is defined', () => {
//         expect(regExpRules).not.toBe(undefined);
//     });
// });
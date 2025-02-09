"use strict";

const modules = [
    // "utils/regExpParser", Loader.Type.requirejs,
    "jsonFiles/regExpGeneratorRules", Loader.Type.json,
];

loader.loadBulk(modules, () => {
    const regExpRules = loader.getModule("jsonFiles/regExpGeneratorRules");

    test('regExpRules is defined', () => {
        expect(regExpRules).not.toBe(undefined);
    });
});
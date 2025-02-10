function createParser(ctor, regExps, defaultChars) {
    const createPattern = (str, flags = "gm") => new RegExp(str, flags);

    return new ctor(
        regExps.map(({ name, pattern, regExpReplacer }) => ({
            name,
            pattern: createPattern(pattern),
            regExpReplacer,
        })),
        defaultChars,
    );
}

let parser;
beforeAll((done) => {
    const modules = [
        "utils/regExpParser", Loader.Type.requirejs,
        "json/regExpGeneratorRules", Loader.Type.json,
    ];

    loader.loadBulk(modules, () => {
        const { regExps, defaultChars } = loader.getAsset("json/regExpGeneratorRules");
        const Parser = loader.getModule("utils/regExpParser");
        parser = createParser(Parser, regExps, defaultChars);

        done();
    });
});

test("String 'He\\nllo' with rules 'Word', 'Multiple characters'", () => {
    const text = "He\nllo",
        regExpText = "[A-zА-я]+\\n[\\wА-я]+";
    // Word, Multiple characters
    parser.setValue(text);
    parser.extractRulesFromString(regExpText);

    const pickedRegExps = [...parser._pickedRegExps.values()];

    const word = pickedRegExps.find(el => el.from === 0);
    const multipleChars = pickedRegExps.find(el => el.from === 3);

    expect(pickedRegExps.length).toBe(2);
    expect(word).not.toBeUndefined();
    expect(multipleChars).not.toBeUndefined();
});

test(
    `String "Initi[Solo] 42" with rules 'Any single character', 'Any square brackets content', 'Multiple integers'`,
    () => {
        const text = "Initi[Solo] 42",
            regExpText = "Init[\\wА-я]\\[[^\\]]*\\] \\d+";

        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        const pickedRegExps = [...parser._pickedRegExps.values()];

        // Any single character, Any square brackets content, Multiple integers
        const singleChars = pickedRegExps.find(el => el.from === 4),
            squareBracket = pickedRegExps.find(el => el.from === 5),
            multipleInt = pickedRegExps.find(el => el.from === 12);

        expect(pickedRegExps.length).toBe(3);
        expect(singleChars).not.toBeUndefined();
        expect(squareBracket).not.toBeUndefined();
        expect(multipleInt).not.toBeUndefined();
    },
);
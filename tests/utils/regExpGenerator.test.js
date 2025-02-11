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

test(
    `Inside 1.2' with rules 'Any curly braces content', 'Decimal number', 'Any single character' and other`,
    () => {
        const text = "Simple \n\"string\" (with) {content}\ninside 1.2",
            regExpText = "Simple \\n\\\"[^\\\"]*\\\" \\([^\\)]*\\) \\{[^\\}]*\\}\\ninsid[\\wА-я] -?\\d*\\.\\d+";
        // Any curly braces content, Decimal number, Any single character
        // Any quotation content, Any parentheses content,
        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        const pickedRegExps = [...parser._pickedRegExps.values()];

        const quotation = pickedRegExps.find(el => el.from === 8), // 8
            parentheses = pickedRegExps.find(el => el.from === 17), // 17
            curlyBraces = pickedRegExps.find(el => el.from === 24), // 24
            singleChar = pickedRegExps.find(el => el.from === 39), // 39
            decimalNumber = pickedRegExps.find(el => el.from === 41); // 41

        expect(pickedRegExps.length).toBe(5)
        expect(quotation).not.toBeUndefined();
        expect(parentheses).not.toBeUndefined();
        expect(curlyBraces).not.toBeUndefined();
        expect(singleChar).not.toBeUndefined();
        expect(decimalNumber).not.toBeUndefined();
    },
);

test(
    `String "Break \\nlines\\nand go!" with rules 'Multiple Whitespaces', 'Any single character'`,
    () => {
        const text = "Break \nlines\nand go!",
            regExpText = "Break\\s+lin[\\wА-я]s\\nan[\\wА-я] go!";
        // Multiple Whitespaces, Any single character
        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        const pickedRegExps = [...parser._pickedRegExps.values()];

        const multipleWhitespaces = pickedRegExps.find(el => el.from === 5),
            singleCharFirst = pickedRegExps.find(el => el.from === 10),
            singleCharSecond = pickedRegExps.find(el => el.from === 15);

        expect(pickedRegExps.length).toBe(3);
        expect(multipleWhitespaces).not.toBeUndefined();
        expect(singleCharFirst).not.toBeUndefined();
        expect(singleCharSecond).not.toBeUndefined();
    },
);

test(
    `String "Simple \\nstring" do not valid input "Simpl[\\wА-я] \\nst[bro][\\wА-я]ng"`,
    () => {
        const text = "Simple \nstring",
            regExpText = "Simpl[\\wА-я] \\nst[bro][\\wА-я]ng";

        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        expect(parser.isValid()).toBeFalsy();
    },
)

test(
    `String "2020-03-12T13:34:56.123Z \\nINFO" with rules 'Any single character', 'single int'`,
    () => {
        const text = "2020-03-12T13:34:56.123Z \nINFO",
            regExpText = "2020-03-12[\\wА-я]13:34:5\\d\\.12\\d[\\wА-я] \\nINFO";
        // Any single character, single int
        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        const pickedRegExps = [...parser._pickedRegExps.values()];

        const singleCharT = pickedRegExps.find(el => el.from === 10),
            singleIntBeforeDot = pickedRegExps.find(el => el.from === 18),
            singleInt = pickedRegExps.find(el => el.from === 22),
            singleChar = pickedRegExps.find(el => el.from === 23);

        expect(pickedRegExps.length).toBe(4);
        expect(singleCharT).not.toBeUndefined();
        expect(singleIntBeforeDot).not.toBeUndefined();
        expect(singleInt).not.toBeUndefined();
        expect(singleChar).not.toBeUndefined();
    },
)

test(
    `Testing text: "255.255.255.255" with regExp [\\wА-я]+\\.\\d+\\.2[\\wА-я]5\\.25\\d and rules:\
         [Multiple characters, Multiple integers, Any single character, Single integer]`,
    () => {
        const text = "255.255.255.255",
            regExpText = "[\\wА-я]+\\.\\d+\\.2[\\wА-я]5\\.25\\d";

        // Any single character, single int
        parser.setValue(text);
        parser.extractRulesFromString(regExpText);

        const pickedRegExps = [...parser._pickedRegExps.values()];

        const mChars = pickedRegExps.find(el => el.from === 0),
            mInt = pickedRegExps.find(el => el.from === 4),
            singleChar = pickedRegExps.find(el => el.from === 9),
            singleInt = pickedRegExps.find(el => el.from === 14);

        expect(pickedRegExps.length).toBe(4);
        expect(mChars).not.toBeUndefined();
        expect(mInt).not.toBeUndefined();
        expect(singleChar).not.toBeUndefined();
        expect(singleInt).not.toBeUndefined();
    },
)

test(`String "1/1/1 solo-platform"`, () => {
    const text = "1/1/1 solo-platform",
        regExpText = "1\\/1\\/1 solo-[A-zА-я]+";

    // Any single character, single int
    parser.setValue(text);
    parser.extractRulesFromString(regExpText);

    const pickedRegExps = [...parser._pickedRegExps.values()];

    const mChars = pickedRegExps.find(el => el.from === 11);

    expect(pickedRegExps.length).toBe(1);
    expect(mChars).not.toBeUndefined();
})

test("String " + "19/09/2022 19:36:47 935792 solo-platform 110832:020  <CORE>     INFO    [PLATFORM CONNECTION] Address[\"cl1\",\"mainPlatform\"] Command 'message' handler: instance::message", () => {
    const text = "19/09/2022 19:36:47 935792 solo-platform 110832:020  <CORE>     INFO    [PLATFORM CONNECTION] Address[\"cl1\",\"mainPlatform\"] Command 'message' handler: instance::message",
        regExpText = "19\\/09\\/2022 19:36:47 935792 solo-[A-zА-я]+ 110832:020  <CORE>     INFO    \\[PLATFORM CONNECTION\\] Address\\[\"cl1\",\"mainPlatform\"\\] Command 'message' handler: instance::message";

    // Any single character, single int
    parser.setValue(text);
    parser.extractRulesFromString(regExpText);

    const pickedRegExps = [...parser._pickedRegExps.values()];

    const mChars = pickedRegExps.find(el => el.from === 32);

    expect(pickedRegExps.length).toBe(1);
    expect(mChars).not.toBeUndefined();
})
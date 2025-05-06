let Validator, InputText;
beforeAll(async () => {
    await loadBulk([
        "applications/webForms/tools/validator",
        "component/inputs/inputText",
    ]);

    Validator = loader.getModule("applications/webForms/tools/validator");
    InputText = loader.getModule("component/inputs/inputText");
});

describe("All deps is defined", () => {
    it("Validator is defined", () => {
        expect(Validator).toBeDefined();
    });
    it("InputText is defined", () => {
        expect(InputText).toBeDefined();
    });
});

describe("Test 'notMatch' rule", () => {
    let validatorRules, inputText, validator;
    beforeEach(() => {
        validatorRules = new Validator.Rules();
        inputText = new InputText({
            value: "",
        });
        validator = new Validator({
            inspects: [
                {
                    ui: inputText,
                    event: ["change"],
                    parameterName: "value",
                    rules: [],
                    colorize: [1],
                    popupMessages: false,
                    triggerEvents: [1],
                    uiAlert: inputText,
                }
            ],
            rules: validatorRules,
        });
    });

    describe("Test case 'string'", () => {
        it("Correct notMatch with email", () => {
            let ruleName = "email";
            validatorRules.setRules(ruleName, 
                [
                    createRule("notMatch",  "hello@initi.ru"),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid("hello@initi.com", [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid("hello@initi.ru", [ruleName]);
            expect(result.valid).toBe(false);
        });

        it("Not match string admin with min length is 4", () => {
            let ruleName = "name";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", "admin"),
                    createRule("minLength", 4),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            inputText.value = "user123";
            let result = validator.checkValid(inputText.value, [ruleName]);
            expect(result.valid).toBe(true);

            inputText.value = "admin";
            result = validator.checkValid(inputText.value, [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'number'", () => {
        it("Not match number 1234 with min length is 4", () => {
            let ruleName = "pin_code";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", 1234),
                    createRule("minLength", 3),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid(1235, [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(1234, [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'arrayOfstring'", () => {
        it("2 same arrays", () => {
            let ruleName = "array";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", ["h", "e"]),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid(["h", "e"], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("2 different arrays", () => {
            let ruleName = "array";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", ["h", "e"]),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid(["h", "e", "l"], [ruleName]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test case 'arrayOfnumber'", () => {
        it("2 same arrays", () => {
            let ruleName = "array";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", [1, 2]),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid([1, 2], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("2 different arrays", () => {
            let ruleName = "array";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("notMatch", [1, 2]),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
            let result = validator.checkValid([1, 2, 3], [ruleName]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test case 'undefined'", () => {
        const ruleName = "undef";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("notMatch", undefined)]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
        });
        it("Incorrect notMatch with 'undefined'", () => {
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Correct notMatch with 'null'", () => {
            let result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Correct notMatch with 0", () => {
            let result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Correct notMatch with string 'undefined'", () => {
            let result = validator.checkValid("undefined", [ruleName]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test case 'boolean'", () => {
        const ruleName = "bool";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("notMatch", false)]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
        });
        it("Incorrect notMatch with 'false'", () => {
            let result = validator.checkValid(false, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Correct notMatch with 'null'", () => {
            let result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Correct notMatch with 'undefined'", () => {
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Correct notMatch with 0", () => {
            let result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Correct notMatch with string 'false'", () => {
            let result = validator.checkValid("false", [ruleName]);
            expect(result.valid).toBe(true);
        });
    });
});

function createRule(type, argument, argName, msg) {
    return new Validator.Rule({
        type,
        argument,
        argumentName: argName,
        message: msg,
    });
}

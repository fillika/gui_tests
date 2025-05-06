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

describe("Test 'in' rule", () => {
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
        let ruleName = "in";
        beforeEach(() => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("in",  "Some text about some numbers (1, 213, 1234, 3.14)"),
                ],
            );
            validator.rules = validatorRules;
        });
        it("Correct", () => {
            let result = validator.checkValid("3.14", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("1234", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("Some text ab", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("(1, 213, 1234, 3.", [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect", () => {
            let result = validator.checkValid("12345", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("Somes", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("numberes", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("1234)", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("3.15", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'array'", () => {
        let ruleName = "in";
        beforeEach(() => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("in",  [1, 2, 3, "hello", "bro", 4, 5]),
                ],
            );
            validator.rules = validatorRules;
        });
        it("Correct", () => {
            let result = validator.checkValid(1, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid(2, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid(3, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("hello", [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect", () => {
            let result = validator.checkValid(6, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(7, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("bra", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Incorrect data types with no 'includes' method", () => {
        let ruleName = "in";
        beforeEach(() => {
            validatorRules = new Validator.Rules();
        });
        it("undefined", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("in",  undefined),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("daf", [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("boolean", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("in",  false),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(false, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(true, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("number", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("in",  123),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(123, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
        });
    });
});

describe("Test 'notIn' rule", () => {
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
        let ruleName = "notIn";
        beforeEach(() => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("notIn",  "Some text about some numbers (1, 213, 1234, 3.14)"),
                ],
            );
            validator.rules = validatorRules;
        });
        it("Correct", () => {
            let result = validator.checkValid("12345", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("Somes", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("numberes", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("1234)", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("3.15", [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect", () => {
            let result = validator.checkValid("3.14", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("1234", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("Some text ab", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("(1, 213, 1234, 3.", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'array'", () => {
        let ruleName = "notIn";
        beforeEach(() => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("notIn",  [1, 2, 3, "hello", "bro", 4, 5]),
                ],
            );
            validator.rules = validatorRules;
        });
        it("Correct", () => {
            let result = validator.checkValid(6, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid(7, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("bra", [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect", () => {
            let result = validator.checkValid(1, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(2, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(3, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("hello", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Incorrect data types with no 'includes' method", () => {
        let ruleName = "notIn";
        beforeEach(() => {
            validatorRules = new Validator.Rules();
        });
        it("undefined", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("notIn",  undefined),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("daf", [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("boolean", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("notIn",  false),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(false, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(true, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("number", () => {
            validatorRules.setRules(ruleName, 
                [
                    createRule("notIn",  123),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(123, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
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

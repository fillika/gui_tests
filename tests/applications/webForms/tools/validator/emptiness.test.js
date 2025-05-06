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

describe("Test case 'empty'", () => {
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

    let ruleName = "empty";
    it("Test different strings", () => {
        validatorRules.setRules(ruleName, [createRule("empty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid("", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid("123456", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(" ", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid("\n", [ruleName]);
        expect(result.valid).toBe(false);
    });
    it("Test different arrays", () => {
        validatorRules.setRules(ruleName, [createRule("empty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid([], [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid([1], [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(["234"], [ruleName]);
        expect(result.valid).toBe(false);
    });
    it("Test other wrong types", () => {
        validatorRules.setRules(ruleName, [createRule("empty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid(0, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(true, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(null, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid({}, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(NaN, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(undefined, [ruleName]);
        expect(result.valid).toBe(false);
    });
});

describe("Test case 'notEmpty'", () => {
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

    let ruleName = "notEmpty";
    it("Test different strings", () => {
        validatorRules.setRules(ruleName, [createRule("notEmpty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid("", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid("123456", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(" ", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid("\n", [ruleName]);
        expect(result.valid).toBe(true);
    });
    it("Test different arrays", () => {
        validatorRules.setRules(ruleName, [createRule("notEmpty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid([], [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid([1], [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(["234"], [ruleName]);
        expect(result.valid).toBe(true);
    });
    it("Test other wrong types", () => {
        validatorRules.setRules(ruleName, [createRule("notEmpty",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid(0, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(true, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(null, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid({}, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(NaN, [ruleName]);
        expect(result.valid).toBe(false);
    });
});

describe("Test case 'undefined'", () => {
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

    let ruleName = "undefined";
    it("Test every type include undefined", () => {
        validatorRules.setRules(ruleName, [createRule("undefined",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid("", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid("123456", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(" ", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid("\n", [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid({}, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid([], [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(123, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(null, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(NaN, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(new Set, [ruleName]);
        expect(result.valid).toBe(false);
        result = validator.checkValid(undefined, [ruleName]);
        expect(result.valid).toBe(true);
    });
});

describe("Test case 'notUndefined'", () => {
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

    let ruleName = "notUndefined";
    it("Test every type include undefined", () => {
        validatorRules.setRules(ruleName, [createRule("notUndefined",  "")]);
        validator.rules = validatorRules;
        let result = validator.checkValid("", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid("123456", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(" ", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid("\n", [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid({}, [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid([], [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(123, [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(null, [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(NaN, [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(new Set, [ruleName]);
        expect(result.valid).toBe(true);
        result = validator.checkValid(undefined, [ruleName]);
        expect(result.valid).toBe(false);
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

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

describe("Test simple regexp rule", () => {
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
        it("Correct regexp", () => {
            let ruleName = "rgxp";
            validatorRules.setRules(ruleName, 
                [
                    createRule("regex",  "/test/gi"),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid("123456", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("12345", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("test me", [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("testing", [ruleName]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test numbers", () => {
        it("Correct regexp", () => {
            let ruleName = "rgxp";
            validatorRules.setRules(ruleName, 
                [
                    createRule("regex",  "/[0-9]/"),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(123456, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid(12345, [ruleName]);
            expect(result.valid).toBe(true);
            result = validator.checkValid("test me", [ruleName]);
            expect(result.valid).toBe(false);
            result = validator.checkValid("testing", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });
});

describe("Test wrong regexps", () => {
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

    it("Incorrect regexp", () => {
        let ruleName = "rgxp";
        validatorRules.setRules(ruleName, 
            [
                createRule("regex",  "//test/"),
            ],
        );
        validator.rules = validatorRules;
        let result = validator.checkValid("test", [ruleName]);
        expect(result.valid).toBe(false);
        expect(result.messages[0].includes("Invalid")).toBeFalsy();
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

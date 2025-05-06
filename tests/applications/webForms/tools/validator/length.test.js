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

describe("Test minLength rule", () => {
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
        it("Correct and incorrect minLength", () => {
            let ruleName = "minLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("minLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid("123456", [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid("1234", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'array'", () => {
        it("Array of numbers", () => {
            let ruleName = "minLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("minLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid([1, 2, 3, 4, 5], [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid([1, 2, 3], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Array of strings", () => {
            let ruleName = "minLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("minLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(["1", "2", "3", "4", "5"], [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(["1", "2", "3"], [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'number'", () => {
        it("Number", () => {
            let ruleName = "minLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("minLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(123456, [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(1234, [ruleName]);
            expect(result.valid).toBe(false);
        });
    });
});

describe("Test maxLength rule", () => {
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
        it("Correct and incorrect maxLength", () => {
            let ruleName = "maxLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("maxLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid("12345", [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid("123456", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'array'", () => {
        it("Array of numbers", () => {
            let ruleName = "maxLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("maxLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid([1, 2, 3, 4, 5], [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid([1, 2, 3, 4, 5, 6], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Array of strings", () => {
            let ruleName = "maxLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("maxLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(["1", "2", "3", "4", "5"], [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(["1", "2", "3", "4", "5", "6"], [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'number'", () => {
        it("Number", () => {
            let ruleName = "maxLength";
            validatorRules.setRules(ruleName, 
                [
                    createRule("maxLength", 5),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(12345, [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(123456, [ruleName]);
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

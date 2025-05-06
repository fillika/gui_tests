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

describe("Test simple comparison", () => {
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
        it("Check value and message", () => {
            let ruleName = "stringComparison";
            validatorRules.setRules(ruleName, 
                [
                    createRule("JS", `
if (value !== "123456") { 
    message = "Incorrect value";
    return false; 
}
return true;`),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid("123456", [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid("1234", [ruleName]);
            expect(result.valid).toBe(false);
            expect(result.messages[0]).toBe("Incorrect value");
        });
    });

    describe("Test case number", () => {
        it("Check value and message", () => {
            let ruleName = "numberComparison";
            validatorRules.setRules(ruleName, 
                [
                    createRule("JS", `
if (value !== 123456) {
    message = "Wrong!";
    return false; 
}
return true;`),
                ],
            );
            validator.rules = validatorRules;
            let result = validator.checkValid(123456, [ruleName]);
            expect(result.valid).toBe(true);

            result = validator.checkValid(1234, [ruleName]);
            expect(result.valid).toBe(false);
            expect(result.messages[0]).toBe("Wrong!");
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

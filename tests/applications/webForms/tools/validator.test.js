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

describe("Test type 'match'", () => {
    it("100% match with email 'hello@initi.ru'", () => {
        const validatorRules = new Validator.Rules();
        validatorRules.setRules("email", 
            [
                new Validator.Rule({
                    type: "match",
                    argument: "hello@initi.ru",
                }),
            ],
        );
        const inputText = new InputText({
            value: "hello@initi.ru",
        });
        const validator = new Validator({
            inspects: [
                {
                    ui: inputText,
                    event: ["change"],
                    parameterName: "value",
                    rules: ["email"],
                    colorize: [1],
                    popupMessages: false,
                    triggerEvents: [1],
                    uiAlert: inputText,
                }
            ],
            rules: validatorRules,
        });

        let result = validator.checkValid(inputText.value, ["email"]);
        expect(result.valid).toBe(true);

        inputText.value = "bye@initi.ru";
        result = validator.checkValid(inputText.value, ["email"]);
        expect(result.valid).toBe(false);
    });
});

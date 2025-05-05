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

describe("Test 'match' rule", () => {
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
        it("100% match with email 'hello@initi.ru'", () => {
            validatorRules.setRules("email", 
                [
                    createRule("match",  "hello@initi.ru"),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = ["email"];
            inputText.value = "hello@initi.ru";

            let result = validator.checkValid(inputText.value, ["email"]);
            expect(result.valid).toBe(true);

            inputText.value = "bye@initi.ru";
            result = validator.checkValid(inputText.value, ["email"]);
            expect(result.valid).toBe(false);
        });

        it("Match string admin with min length is 4", () => {
            validatorRules.setRules(
                "name",
                [
                    createRule("match", "admin"),
                    createRule("minLength", 4),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = ["name"];
            inputText.value = "admin";
            let result = validator.checkValid(inputText.value, ["name"]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test case 'number'", () => {
        it("Match number 1234 with min length is 4", () => {
            validatorRules.setRules(
                "year",
                [
                    createRule("match", 2023),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = ["year"];
            inputText.value = 2023;
            let result = validator.checkValid(inputText.value, ["year"]);
            expect(result.valid).toBe(true);
        });
        it("Match number with min length is 5", () => {
            const ruleName = "password as a number";
            validatorRules.setRules(
                ruleName,
                [
                    createRule("match", 12345678),
                    createRule("minLength", 5),
                ],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            inputText.value = 1212;
            let result = validator.checkValid(inputText.value, [ruleName]);
            expect(result.valid).toBe(false);

            inputText.value = 12345678;
            result = validator.checkValid(inputText.value, [ruleName]);
            expect(result.valid).toBe(true);
        });
    });

    describe("Test case 'array of string'", () => {
        it("Match array value ['Hello', 'World'] as correct match", () => {
            const ruleName = "greeting array";
            validatorRules.setRules(ruleName, [createRule("match", ["Hello", "World"])]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid(["Hello", "World"], [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect match array value with ['master', 'gui']", () => {
            const ruleName = "address in array";
            validatorRules.setRules(ruleName, [createRule("match", ["Hello", "World"])]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid(["master", "gui"], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match string and number with ['master', 'gui']", () => {
            const ruleName = "address in array";
            validatorRules.setRules(
                ruleName, 
                [createRule("match", "hello"), createRule("match", 1234)],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid(["master", "gui"], [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'array of number'", () => {
        it("Correct match with array [1, 2, 3, 4]", () => {
            const ruleName = "numArray";
            validatorRules.setRules(ruleName, [createRule("match", [1, 2, 3, 4])]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid([1, 2, 3, 4], [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect match with another arr of nums", () => {
            const ruleName = "numArray";
            validatorRules.setRules(ruleName, [createRule("match", [1, 2, 3, 4])]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid([1, 2], [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with string and numbers", () => {
            const ruleName = "str_and_num";
            validatorRules.setRules(
                ruleName, 
                [createRule("match", "hello"), createRule("match", 1234)],
            );
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];

            let result = validator.checkValid([1, 2, 3], [ruleName]);
            expect(result.valid).toBe(false);
        });
    });
    
    describe("Test case 'undefined'", () => {
        const ruleName = "undef";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("match", undefined)]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
        });
        it("Correct match with 'undefined'", () => {
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect match with 'null'", () => {
            let result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with 0", () => {
            let result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with string 'undefined'", () => {
            let result = validator.checkValid("undefined", [ruleName]);
            expect(result.valid).toBe(false);
        });
    });

    describe("Test case 'boolean'", () => {
        const ruleName = "bool";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("match", false)]);
            validator.rules = validatorRules;
            validator.inspects[0].rules = [ruleName];
        });
        it("Correct match with 'false'", () => {
            let result = validator.checkValid(false, [ruleName]);
            expect(result.valid).toBe(true);
        });
        it("Incorrect match with 'null'", () => {
            let result = validator.checkValid(null, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with 'undefined'", () => {
            let result = validator.checkValid(undefined, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with 0", () => {
            let result = validator.checkValid(0, [ruleName]);
            expect(result.valid).toBe(false);
        });
        it("Incorrect match with string 'false'", () => {
            let result = validator.checkValid("false", [ruleName]);
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

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

describe("Test 'greater' and 'greaterOrEqual' rule", () => {
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

    describe("Case 'greater'", () => {
        let ruleName = "gt";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("greater",  5)]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for greater", () => {
            it("All numbers are greater", () => {
                let result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("15", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("11.21", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("5.0001", [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are less", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("0", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are greater", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(15, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(11.21, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(5.0001, [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are less", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(5, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(0, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s123", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("123s", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });
    });

    describe("Case 'greaterOrEqual'", () => {
        let ruleName = "gte";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("greaterOrEqual", 5)]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for greaterOrEqual", () => {
            it("All numbers are greater", () => {
                let result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("15", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("11.21", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("5.0001", [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are less", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("0", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are greater", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(5, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(15, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(11.21, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(5.0001, [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are less", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(0, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s123", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("123s", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });
    });

    describe("Case 'less'", () => {
        let ruleName = "lt";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("less", 5)]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for less", () => {
            it("All numbers are less", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("0", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are greater", () => {
                let result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("15", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("11.21", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("5.0001", [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are less", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(0, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are greater", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(15, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(11.21, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(5.0, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(5.0001, [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s3", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("3s", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });
    });

    describe("Case 'lessOrEqual'", () => {
        let ruleName = "lte";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("lessOrEqual", 5)]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for lessOrEqual", () => {
            it("All numbers are less", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("0", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are greater", () => {
                let result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("15", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("11.21", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("5.0001", [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are less", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(5.0, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(0, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are greater", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(15, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(11.21, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(5.0001, [ruleName]);
                expect(result.valid).toBe(false);
            });
        });
        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s3", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("3s", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });
    });

    describe("Case 'between'", () => {
        let ruleName = "bt";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("between", [5, 10])]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for between", () => {
            it("All numbers are in range", () => {
                let result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("10", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("7.5", [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are out of range", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("11", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are in range", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(5, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(10, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(7.5, [ruleName]);
                expect(result.valid).toBe(true);
            });
            it("All numbers are out of range", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(11, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(false);
            });
        });

        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s3", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("3s", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("7s", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });
    });

    describe("Case 'notBetween'", () => {
        let ruleName = "nbt";
        beforeEach(() => {
            validatorRules.setRules(ruleName, [createRule("notBetween", [5, 10])]);
            validator.rules = validatorRules;
        });
        describe("Compare numbers as strings for notBetween", () => {
            it("All numbers are in range", () => {
                let result = validator.checkValid("6", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("5", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("10", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("7.5", [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("All numbers are out of range", () => {
                let result = validator.checkValid("4", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("11", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-1", [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid("-5.0001", [ruleName]);
                expect(result.valid).toBe(true);
            });
        });

        describe("Compare real numbers", () => {
            it("All numbers are in range", () => {
                let result = validator.checkValid(6, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(5, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(10, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(7.5, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("All numbers are out of range", () => {
                let result = validator.checkValid(4, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(11, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-1, [ruleName]);
                expect(result.valid).toBe(true);
                result = validator.checkValid(-5.0001, [ruleName]);
                expect(result.valid).toBe(true);
            });
        });

        describe("Incorrect data types", () => {
            it("Pass NaN, undefined, null", () => {
                let result = validator.checkValid(NaN, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(undefined, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid(null, [ruleName]);
                expect(result.valid).toBe(false);
            });
            it("Pass array, object, string", () => {
                let result = validator.checkValid([], [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid({}, [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("s3", [ruleName]);
                expect(result.valid).toBe(false);
                result = validator.checkValid("3s", [ruleName]);
                expect(result.valid).toBe(true);
            });
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

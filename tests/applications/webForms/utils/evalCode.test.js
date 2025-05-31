let evalCode;
beforeAll(async () => {
    await loadBulk([
        "applications/webForms/utils/evalCode",
    ]);

    const evalCodeModule = loader.getModule("applications/webForms/utils/evalCode");
    evalCode = evalCodeModule.evalCode;
});

describe("Main test for eval code", () => {
    test("Get message from simple if condition", () => {
        const code = `
let message = "Before if";
if (value == 42) {
    message = "After if";
    return message;
} else {
    return message;
}
`;
        const trueMsg = evalCode(code, { context: { value: 42 } });
        expect(trueMsg).toBe("After if");
        const falseMsg = evalCode(code, { context: { value: 41 } });
        expect(falseMsg).toBe("Before if");
    });
});

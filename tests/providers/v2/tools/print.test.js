describe("Print loaded", () => {
    it("Print module loaded", () => {
        expect(v2).toBeDefined();
        expect(v2.tools).toBeDefined();
        expect(v2.tools.print).toBeDefined();
    });
});

describe("Print address", () => {
    it("Print default address", () => {
        const addr = v2.address.from_array(["gui", "test", "address", "1234"]);
        const printed = addr.print();
        expect(printed).toBe(`Address ["gui", "test", "address", "1234"]`);
    });
});

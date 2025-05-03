beforeAll(async () => {
    const modules = [
        "providers/v2/factory", Loader.Type.requirejs,
        "providers/v2/tools/print", Loader.Type.requirejs,
    ];

    await loadBulk(modules, () => {
    });
});

describe("Print loaded", () => {
    it("Print module loaded", () => {
        expect(global.v2).toBeDefined();
        expect(global.v2.tools).toBeDefined();
        expect(global.v2.tools.print).toBeDefined();
    });
});

describe("Print address", () => {
    it("Print default address", () => {
        const addr = v2.address.from_array(["gui", "test", "address", "1234"]);
        const printed = addr.print();
        expect(printed).toBe(`Address ["gui", "test", "address", "1234"]`);
    });
});

test("Loader is available in global scope", () => {
    expect(global.Loader).toBeDefined();
    expect(global.loader).toBeDefined();
});
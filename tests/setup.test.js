test("RequireJS is available in global scope", () => {
    expect(global.requirejs).toBeDefined();
});
test("Loader is available in global scope", () => {
    expect(global.Loader).toBeDefined();
    expect(global.loader).toBeDefined();
});
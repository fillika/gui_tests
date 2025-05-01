let Button;
beforeAll((done) => {
    const modules = [
        "component/button",
        "utils/size",
    ];

    loader.loadBulk(modules, () => {
        Button = loader.getModule("component/button");
        Size = loader.getModule("utils/size");

        done();
    });
});

test("Button initialization with text 'Print'", () => {
    const btn = new Button({ text: "Print" });
    expect(btn.text).toBe("Print");
});
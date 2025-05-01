let Button, Size;
beforeAll(async () => {
    const modules = [
        "component/button",
        "utils/size",
    ];

    await loadBulk(modules, () => {
        Button = loader.getModule("component/button");
        Size = loader.getModule("utils/size");
    });
});

test("Button initialization with text 'Print'", () => {
    const btn = new Button({ text: "Print" });
    expect(btn.text).toBe("Print");
});

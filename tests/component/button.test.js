let Button;
beforeAll(async () => {
    const modules = [
        "component/button",
    ];

    await loadBulk(modules, () => {
        Button = loader.getModule("component/button");
    });
});

test("Button initialization with text 'Print'", () => {
    const btn = new Button({ text: "Print" });
    expect(btn.text).toBe("Print");
});

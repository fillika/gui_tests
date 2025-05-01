let Size;
beforeAll(async () => {
    const modules = [
        "utils/size",
    ];

    await loadBulk(modules, () => {
        Size = loader.getModule("utils/size");
    });
});

test("Size created and has 40x60", () => {
    const size = new Size(40, 60);
    expect(size.width).toBe(40);
    expect(size.height).toBe(60);
});

let _path;
beforeAll(async () => {
    const modules = ["utils/path"];

    await loadBulk(modules, () => {
        _path = loader.getModule("utils/path");
    });
});

describe("Testing methods", () => {
    test("resolve", () => {
        expect(_path.resolve("/", "/")).toBe("/");
        expect(_path.resolve("/", "//")).toBe("/");
        expect(_path.resolve(".", "/")).toBe("/");
        expect(_path.resolve("/", ".")).toBe("/");
        expect(_path.resolve("abc", "qwe")).toBe("abc/qwe");
        expect(_path.resolve("some/path", "a/b/test")).toBe("some/path/a/b/test");
        expect(_path.resolve("some/path", "/a/b/test")).toBe("/a/b/test");
        expect(_path.resolve("/usr/local", "../bin")).toBe("/usr/bin");
        expect(_path.resolve("some/path", "../../up")).toBe("up");
    });

    test("basename", () => {
        expect(_path.basename("/some/path/a/b/test.jpg")).toBe("test.jpg");
    });

    test("dirname", () => {
        expect(_path.dirname("/some/path/a/b/test.jpg")).toBe("/some/path/a/b");
    });
});

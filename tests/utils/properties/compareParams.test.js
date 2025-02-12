
let compareParams;

beforeAll((done) => {
    const modules = [
        "utils/properties/compareParams",
    ];

    loader.loadBulk(modules, () => {
        compareParams = loader.getModule("utils/properties/compareParams");
        done();
    });
});

test("Compare simple values", () => {
    expect(compareParams(1, 1)).toBe(true);
    expect(compareParams(1, 2)).toBe(false);
    expect(compareParams('a', 'a')).toBe(true);
    expect(compareParams('a', 'b')).toBe(false);
    expect(compareParams(true, true)).toBe(true);
    expect(compareParams(true, false)).toBe(false);
    expect(compareParams(null, null)).toBe(true);
    expect(compareParams(null, undefined)).toBe(false);
    expect(compareParams(1, undefined)).toBe(false);
});

test("Compare arrays with number literals", () => {
    expect(compareParams([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(compareParams([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(compareParams([1, 2, 3], [1, 2])).toBe(false);
    expect(compareParams([1, 2, 3], [1, 2, 3, 4])).toBe(false);
});

test("Compare arrays with string literals", () => {
    expect(compareParams(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
    expect(compareParams(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
    expect(compareParams(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
    expect(compareParams(['a', 'b', 'c'], ['a', 'b', 'c', 'd'])).toBe(false);
});

test("Compare arrays with mixed literals", () => {
    expect(compareParams([1, 'a', true], [1, 'a', true])).toBe(true);
    expect(compareParams([1, 'a', true], [1, 'a', false])).toBe(false);
    expect(compareParams([1, 'a', true], [1, 'a'])).toBe(false);
    expect(compareParams([1, 'a', true], [1, 'a', true, false])).toBe(false);
});

test("Compare objects with mixed literals", () => {
    expect(compareParams({ a: 1, b: 'a', c: true }, { a: 1, b: 'a', c: true })).toBe(true);
    expect(compareParams({ a: 1, b: 'a', c: true }, { a: 1, b: 'a', c: false })).toBe(false);
    expect(compareParams({ a: 1, b: 'a', c: true }, { a: 1, b: 'a' })).toBe(false);
    expect(compareParams({ a: 1, b: 'a', c: true }, { a: 1, b: 'a', c: true, d: false })).toBe(false);
});
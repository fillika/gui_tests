let ParametersSerializator,
    ParameterSerializator,
    ParameterDeserializatorAsync,
    ParametersDeserializatorAsync,
    DeserializationError,
    ExtractTypesFromUnormDeclaration,
    ArrayT,
    ObjectT,
    Point,
    Color,
    Style,
    Dummy,
    Color4,
    Vec4,
    Range,
    EnumMap,
    EnumEntity,
    BoxShadow,
    ListLayout,
    UI,
    AbsoluteLayout,
    UUIDS,
    REGISTRY;
let testCases;

beforeAll(async () => {
    await loadBulk([
        "utils/parametersSerializator",
        "utils/typedData",
        "utils/point",
        "utils/color",
        "managers/themes/style",
        "component/dummy",
        "utils/color4",
        "gl/types/vec4",
        "utils/range",
        "utils/enum/enum",
        "utils/enum/entity",
        "utils/boxShadow",
        "layout/list",
        "component/ui",
        "layout/absoluteLayout",
        "utils/parameters/registry",
    ]);
    const paramSerModule = loader.getModule("utils/parametersSerializator");
    ParametersSerializator = paramSerModule.ParametersSerializator;
    ParameterSerializator = paramSerModule.ParameterSerializator;
    ParameterDeserializatorAsync = paramSerModule.ParameterDeserializatorAsync;
    ParametersDeserializatorAsync = paramSerModule.ParametersDeserializatorAsync;
    DeserializationError = paramSerModule.DeserializationError;
    ExtractTypesFromUnormDeclaration = paramSerModule.ExtractTypesFromUnormDeclaration;

    const typedData = loader.getModule("utils/typedData");
    ArrayT = typedData.ArrayT;
    ObjectT = typedData.ObjectT;
    Point = loader.getModule("utils/point");
    Color = loader.getModule("utils/color");
    Style = loader.getModule("managers/themes/style");
    Dummy = loader.getModule("component/dummy");
    Color4 = loader.getModule("utils/color4");
    Vec4 = loader.getModule("gl/types/vec4");
    Range = loader.getModule("utils/range");
    EnumMap = loader.getModule("utils/enum/enum");
    EnumEntity = loader.getModule("utils/enum/entity");
    BoxShadow = loader.getModule("utils/boxShadow");
    ListLayout = loader.getModule("layout/list");
    UI = loader.getModule("component/ui");
    AbsoluteLayout = loader.getModule("layout/absoluteLayout");
    const registry = loader.getModule("utils/parameters/registry");
    UUIDS = registry.UUIDS;
    REGISTRY = registry.REGISTRY;

    class T1 extends ArrayT {
        static elementType = Number; // String, Number, Boolean, bigint, Symbol, undefined, null, // Object, Function,
    }
    class T2 extends ArrayT {
        static elementType = [Number];
    }
    class T3 extends ArrayT {
        static elementType = { type: Number };
    }
    class T4 extends ArrayT {
        static elementType = { type: [Number] };
    }

    class T5 extends ArrayT {
        static elementType = [undefined, Number, String];
    }
    class T6 extends ArrayT {
        static elementType = { type: [Number, String] }; // TODO: find "static elementType = { type: [" and replace!
    }
    class T7 extends ArrayT {
        static elementType = { type: [{ type: [Number, String] }, { type: [Boolean, undefined] }] };
    }

    class T8 extends ArrayT {
        static elementType = [Boolean, T7];
    }
    class T9 extends ArrayT {
        static elementType = [String, T8, T4, undefined];
    }

    class T10 extends ArrayT {
        static elementType = Point;
    }

    class T11 extends ArrayT {
        static elementType = [Point];
    }

    class T12 extends ArrayT {
        static elementType = { type: Point };
    }

    class T13 extends ArrayT {
        static elementType = { type: [Point] };
    }

    class T14 extends ArrayT {
        static elementType = [Point, Color, Style.StyleProperty];
    }

    class T15 extends ArrayT {
        static elementType = [String, T8, T4, undefined, T14];
    }

    class T16 extends ObjectT {
        static k1 = String;
        static k2 = [String];
        static k3 = { type: String };
        static k4 = { type: [String] };
        static k5 = [String, Number];
        static k6 = { type: [String, Number, undefined] };
        static k7 = Point;
        static k8 = [Point, Color, Style.StyleProperty];
        static k9 = [
            Boolean,
            { type: [String] },
            { type: [undefined, Number] },
            { type: [Point, Color, Style.StyleProperty] },
        ];
        static k15 = T15;
    }

    class T17 extends ObjectT {
        static name = String;
        static primaryColor = [undefined, { type: Color, copyMethod: "copy", equalMethod: "equals" }];
        static secondaryColor = [undefined, { type: Color, copyMethod: "copy", equalMethod: "equals" }];
        static background = [undefined, { type: Color, copyMethod: "copy", equalMethod: "equals" }];
    }

    class T18 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = Number;
    }

    class T19 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = [Number];
    }

    class T20 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = { type: Number };
    }

    class T21 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = { type: [Number] };
    }

    class T22 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = [Boolean, Point, undefined, Color, String, Style.StyleProperty];
    }

    class T23 extends ObjectT {
        static indexSignature = true;
        static key = String;
        static value = [undefined, T15, T16];
    }

    class T24 extends ArrayT {
        static elementType = { type: Number, v2Type: new v2.vt.base(v2.vt.types.UInteger) };
    }

    class T25 extends ArrayT {
        static elementType = [
            { type: Number, v2Type: new v2.vt.base(v2.vt.types.UInteger) },
            { type: String, defVal: "", v2Type: new v2.vt.base(v2.vt.types.UUID) },
        ];
    }

    class T26 extends ArrayT {
        static elementType = null;
    }

    class T27 extends ArrayT {
        static elementType = Dummy;
    }

    class EnumViewerT {
        static parameters = {
            color: { type: [Color] },
            icon: { type: [String] },
            title: { type: [String] },
            typeiption: { type: [String] },
        };
    }
    class T28 extends ObjectT {
        static k1 = v2.vc;
        static k2 = v2.address;
        static k3 = v2.uuid;
        static k4 = Color;
        static k5 = Color4;
        static k6 = Style.StyleProperty;
        static k7 = Vec4;
        static k8 = Range;
        static k9 = { type: EnumMap, itemType: EnumViewerT };
        static k10 = BoxShadow;
        static k11 = Dummy;
    }

    testCases = [
        { name: "T1", type: { type: [T1] }, value: [123, 456], instanceOf: v2.vector },
        { name: "T2", type: { type: [T2] }, value: [123, 456], instanceOf: v2.vector },
        { name: "T3", type: { type: [T3] }, value: [123, 456] },
        { name: "T4", type: { type: [T4] }, value: [123, 456] },

        { name: "T5", type: { type: [T5] }, value: ["qwe", 123] },
        { name: "T6", type: { type: [T6] }, value: [123, "asd"] },
        { name: "T7", type: { type: [T7] }, value: ["qwe", undefined, 123, true] },

        { name: "T8", type: { type: [T8] }, value: [true, ["qwe", undefined, 123]] },
        { name: "T9", type: { type: [T9] }, value: ["T9", [true, ["qwe", undefined, 789]], undefined, [123, 456]] },

        { name: "T10", type: { type: [T10] }, value: [new Point(1,2), new Point(3,4)] },
        { name: "T11", type: { type: [T11] }, value: [new Point(1,2), new Point(3,4)] },
        { name: "T12", type: { type: [T12] }, value: [new Point(1,2), new Point(3,4)] },
        { name: "T13", type: { type: [T13] }, value: [new Point(1,2), new Point(3,4)] },
        { name: "T14", type: { type: [T14] }, value: [new Point(1,2), new Color(255,0,0), Style.Property.SystemPalette.c8] },
        { name: "T15", type: { type: [T15] }, value: [
                undefined,
                "asd",
                [new Point(1,2), new Color(255,0,0), Style.Property.SystemPalette.c8 ],
                [true, ["qwe", undefined, 123]],
                [123, 456]
            ]
        },

        { name: "T16", type: { type: [T16] }, value: {
            k1: "qwe",
            k2: "asd",
            k3: "zxc",
            k4: "rty",
            k5: 123,
            k6: undefined,
            k7: new Point(1,2),
            k8: Style.Property.SystemPalette.c8,
            k9: Style.Property.SystemPalette.c8,
            k15: [
                undefined,
                "asd",
                [new Point(1,2), new Color(255,0,0), Style.Property.SystemPalette.c8 ],
                [true, ["qwe", undefined, 123]],
                [123, 456]
            ]
        } },

        { name: "T17", type: { type: [T17] }, value: { name: "device", primaryColor: new Color(255,0,0), secondaryColor: undefined, background: undefined } },

        { name: "T18", type: { type: [T18] }, value: { "qwe": 123, "zxc": 456 } },
        { name: "T19", type: { type: [T19] }, value: { "qwe": 123, "zxc": 456 } },
        { name: "T20", type: { type: [T20] }, value: { "qwe": 123, "zxc": 456 } },
        { name: "T21", type: { type: [T21] }, value: { "qwe": 123, "zxc": 456 } },

        { name: "T22", type: { type: [T22] }, value: {
            k1: true,
            k2: new Point(1,2),
            k3: undefined,
            k4: new Color(255,0,0),
            k5: "qwe",
            k6: Style.Property.SystemPalette.c8
        } },

        { name: "T23", type: { type: [T23] }, value: {
            k1: undefined,
            k2: [
                undefined,
                "asd",
                [new Point(1,2), new Color(255,0,0), Style.Property.SystemPalette.c8 ],
                [true, ["qwe", undefined, 123]],
                [123, 456]
            ],
            k3: {
                k1: "qwe",
                k2: "asd",
                k3: "zxc",
                k4: "rty",
                k5: 123,
                k6: undefined,
                k7: new Point(1,2),
                k8: Style.Property.SystemPalette.c8,
                k9: Style.Property.SystemPalette.c8,
                k15: [
                    undefined,
                    "asd",
                    [new Point(1,2), new Color(255,0,0), Style.Property.SystemPalette.c8 ],
                    [true, ["qwe", undefined, 123]],
                    [123, 456]
                ]
            }
        } },

        { name: "T24", type: { type: [T24] }, value: [123, 456.5] },
        { name: "T25", type: { type: [T25] }, value: [123, 456.5, "8765202b-64fa-4a78-b872-6eca332027ee", "cd8066f8-eb81-40fa-9acd-060a94ed748a"] },

        { name: "T26", type: { type: [T26] }, value: [null] },

        { name: "T27", type: { type: [T27] }, value: [new Dummy()] },

        { name: "T28", type: { type: [T28] }, value: {
            k1: v2.vc.from_object({ treeTag: new v2.string("st"), nodeId: v2.integer.from_number(123.456) }),
            k2: v2.address.from_array(["qwe", "asd"]),
            k3: v2.uuid.from_string("10000000-2000-3000-4000-500000000000"),
            k4: new Color(255,0,0),
            k5: new Color4(new Color(255,0,0), new Color(0,255,0), new Color(0,0,255), new Color(255,255,0)),
            k6: Style.Property.SystemPalette.c8,
            k7: new Vec4(1,2,3,4),
            k8: new Range(1,9),
            k9: new EnumMap([
                {index: 1, entity: new EnumEntity({ icon: "3D", any: "any", color: new Color(255,0,0), title: "qwe" })},
                {index: 5, entity: new EnumEntity({ icon: "diver", any: "any", color: new Color(0,255,0), title: "asd" })},
                {index: 6, entity: new EnumEntity({ icon: "info", any: "any", color: new Color(0,0,255), title: "zxc" })},
            ]),
            k10: new BoxShadow({spread: 1, inset: true}),
            k11: new Dummy(),
        } },
    ];
});

describe("Run all test in each block", () => {
    it("Should serialize/deserialize correctly", async () => {
        for (const { name, type, value, instanceOf } of testCases) {
            const serialized = ParameterSerializator(type, value);
            if (instanceOf) {
                expect(serialized).toBeInstanceOf(instanceOf);
            }

            const deserialized = await ParameterDeserializatorAsync(type, serialized, name);
            expect(deserialized).not.toBeInstanceOf(DeserializationError);
        }
    });
});

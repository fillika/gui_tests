let AbstractLayout, List, Button, Component, Container, InputText;
beforeAll(async () => {
    await loadBulk([
        "layout/abstractLayout",
        "layout/list",
        "component/button",
        "component/component",
        "component/container",
        "component/inputs/inputText",
    ]);

    AbstractLayout = loader.getModule("layout/abstractLayout");
    List = loader.getModule("layout/list");
    Button = loader.getModule("component/button");
    Component = loader.getModule("component/component")
    Container = loader.getModule("component/container");
    InputText = loader.getModule("component/inputs/inputText");
});

describe("All deps is defined", () => {
    it("AbstractLayout is defined", () => {
        expect(AbstractLayout).toBeDefined();
    });
    it("List is defined", () => {
        expect(List).toBeDefined();
    });
    it("Button is defined", () => {
        expect(Button).toBeDefined();
    });
    it("Component is defined", () => {
        expect(Component).toBeDefined();
    });
    it("Container is defined", () => {
        expect(Container).toBeDefined();
    });
    it("InputText is defined", () => {
        expect(InputText).toBeDefined();
    });
});

describe("flattenElements", () => {
    describe("Flatten Component", () => {
        let form, innerComponent;
        beforeAll(() => {
            form = new Component;
            form.layout = new List;

            const formList = new List;
            formList.add(new InputText({ value: "Name" }));
            formList.add(new InputText({ value: "Password" }));
            const buttonList = new List;
            buttonList.add(new Button({ text: "First btn in list" }))
            buttonList.add(new Button({ text: "Second btn in list" }))
            formList.add(buttonList);

            innerComponent = new Component;
            innerComponent.layout = new List;
            innerComponent.layout.add(formList);
            form.layout.add(innerComponent);
        });

        it("Get elements using flatten without layouts", () => {
            const elements = form.layout.flattenElements(undefined, false);
            expect(elements.length).toBe(1);

            const innerCompElems = innerComponent.layout.flattenElements(undefined, false);
            expect(innerCompElems.length).toBe(4);
        });
        it("Get elements using flatten with layouts", () => {
            const elements = form.layout.flattenElements(undefined, true);
            expect(elements.length).toBe(1);

            const innerCompElems = innerComponent.layout.flattenElements(undefined, true);
            expect(innerCompElems.length).toBe(6);
        });
    });

    describe("Flatten Container", () => {
        let form, innerComponent;
        beforeAll(() => {
            form = new Component;
            form.layout = new List;

            const formList = new List;
            formList.add(new InputText({ value: "Name" }));
            formList.add(new InputText({ value: "Password" }));
            const buttonList = new List;
            buttonList.add(new Button({ text: "First btn in list" }))
            buttonList.add(new Button({ text: "Second btn in list" }))
            formList.add(buttonList);

            innerComponent = new Container;
            innerComponent.layout = new List;
            innerComponent.layout.add(formList);
            form.layout.add(innerComponent);
        });

        it("Get elements using flatten without layouts", () => {
            const elements = form.layout.flattenElements(undefined, false);
            expect(elements.length).toBe(5);
        });
        it("Get elements using flatten with layouts", () => {
            const elements = form.layout.flattenElements(undefined, true);
            expect(elements.length).toBe(8);
        });
    });
});

describe("managingDeep", () => {
    let form, button, buttonList, container, containerLayout;
    beforeAll(() => {
        form = new Component;
        form.layout = new List;

        const formList = new List;
        formList.add(new InputText({ value: "Name" }));
        formList.add(new InputText({ value: "Password" }));
        buttonList = new List;
        button = new Button({ text: "First btn in list" });
        buttonList.add(button);
        buttonList.add(new Button({ text: "Second btn in list" }));
        formList.add(buttonList);

        container = new Container;
        containerLayout = new List;
        container.layout = containerLayout;
        container.layout.add(formList);
        form.layout.add(container);
    });

    it("Find existing elements", () => {
        let isExist = form.layout.managingDeep(container);
        expect(isExist).toBeTruthy();
        isExist = form.layout.managingDeep(containerLayout);
        expect(isExist).toBeTruthy();
        isExist = form.layout.managingDeep(buttonList);
        expect(isExist).toBeTruthy();
        isExist = form.layout.managingDeep(button);
        expect(isExist).toBeTruthy();
    });

    it("Trying to find unexisting elements", () => {
        let isExist = form.layout.managingDeep(new Container);
        expect(isExist).toBeFalsy();
        isExist = form.layout.managingDeep(new Button({ text: "First btn in list" }));
        expect(isExist).toBeFalsy();
        isExist = form.layout.managingDeep(new List);
        expect(isExist).toBeFalsy();
    });
});

describe("find", () => {
    let list, container, containerList, button, input;
    beforeAll(() => {
        list = new List;
        container = new Container;
        containerList = new List;
        container.layout = containerList;
        button = new Button({ text: "Hello" });
        input = new InputText({ value: "World" });
        containerList.add(button);
        containerList.add(input);
        list.add(container);
    });

    it("Find element inside container", () => {
        let isExist = list.find(el => el === button) !== null;
        expect(isExist).toBeTruthy();
        isExist = list.find(el => el === container) !== null;
        expect(isExist).toBeTruthy();
        isExist = list.find(el => el === containerList) !== null;
        expect(isExist).toBeTruthy();
        isExist = list.find(el => el === input) !== null;
        expect(isExist).toBeTruthy();
    });

    it("Find unexisting element", () => {
        const mockBtn = new Button({ text: "Hello" });
        let isExist = list.find(el => el === mockBtn) === null;
        expect(isExist).toBeTruthy();
        const mockContainer = new Container;
        isExist = list.find(el => el === mockContainer) === null;
        expect(isExist).toBeTruthy();
        const mockList = new List;
        isExist = list.find(el => el === mockList) === null;
        expect(isExist).toBeTruthy();
        const mockInText = new InputText({ value: "World" });
        isExist = list.find(el => el === mockInText) === null;
        expect(isExist).toBeTruthy();
    });
});

describe("findAll", () => {
    let list, container, containerList, button, input;
    beforeAll(() => {
        list = new List;
        container = new Container;
        containerList = new List;
        container.layout = containerList;
        button = new Button({ text: "Hello" });
        input = new InputText({ value: "World" });
        containerList.add(button);
        containerList.add(input);
        list.add(container);
    });

    it("Find container and his layout", () => {
        const elements = list.findAll(el => el === container || el === containerList);
        expect(elements.length).toBe(2);
        expect(elements[0]).toBe(container);
    });

    it("Find all components inside container", () => {
        const elements = list.findAll(el => el === button || el === input);
        expect(elements.length).toBe(2);
        expect(elements[0]).toBe(button);
    });

    it("Find no elements", () => {
        const elements = list.findAll(el => el === new Button({ text: "Hello" }));
        expect(elements.length).toBe(0);
    });
});

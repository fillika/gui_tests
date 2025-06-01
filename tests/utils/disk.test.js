import getCoreConnection from "./coreConnection";

let CoreConnection, Disk, disk;
beforeAll(async () => {
    const deps = ["utils/disk"];
    await loadBulk(deps);
    Disk = loader.getModule("utils/disk");
    disk = new Disk();

    CoreConnection = await getCoreConnection();
    let coreConnection = new CoreConnection();
    await coreConnection.connect("root", "root");
});

describe("Core connection is available", () => {
    it("loaded", () => {
        expect(CoreConnection !== undefined).toBeTruthy();
    });
});

describe("Testing 'ls' command", () => {
    it("Get files in root", async () => {
        const files = await disk.ls("/");
        expect(files.length > 0).toBeTruthy();
    });
});

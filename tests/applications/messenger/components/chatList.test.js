let ChatList;
beforeAll(async () => {
    await loadBulk(["component/messenger/components/chatList/chatsList"]);

    ChatList = loader.getModule("component/messenger/components/chatList/chatsList");
});

const CHAT_IDS = {
    VIKTOR: "afb04623-5136-6bd0-1580-7ed02dc64423",
    BENDER: "f2c939ea-65b8-5549-4c64-5749ebc83dea",
    INITI_SUPPORT: "ecd1b0af-9a46-9dd9-07ac-86d96f2eafaf",
    USER_1: "6e13aa87-c7a8-6610-8dc0-6910a691bd87",
    USER_2: "56b2cbcc-9cf6-b2bb-cb79-acbbf169dfcc",
    USER_3: "5f4e7268-55b9-15cb-87d4-0bcbc57d7d68",
};
const initialItems = [
    {
        id: CHAT_IDS.VIKTOR,
        title: "Viktor",
        text: "Notifications and other messages",
        unreadMessages: 0,
        timestamp: 1753797960104,
        pinned: true,
    },
    {
        id: CHAT_IDS.BENDER,
        title: "Bender",
        text: "Hello from Bender! We glad to see you today! :)",
        unreadMessages: 0,
        timestamp: 1753797941787,
        pinned: true,
    },
    {
        id: CHAT_IDS.USER_1,
        title: "User_1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: 1753797641787,
        pinned: false,
    },
    {
        id: CHAT_IDS.USER_2,
        title: "User_2",
        text: "Hi! My name is...",
        timestamp: 1753797341787,
        pinned: false,
    },
    {
        id: CHAT_IDS.USER_3,
        title: "User_3",
        text: "Did you know that 42 is the best number in the Universe?",
        timestamp: 1753797221787,
        pinned: false,
    },
];

describe("Test correct sorting chat items", () => {
    let chatList;
    function getChatItems() {
        return chatList._list.elements;
    }
    beforeAll(() => {
        chatList = new ChatList();
    });
    describe("Pin and unpin. Correct order", () => {
        beforeEach(() => {
            chatList.setItems(initialItems);
        });
        it("Has correct order after initialize", () => {
            const items = getChatItems();
            expect(items.length).toBe(5);
            const [viktorItem, benderItem, user1, user2, user3] = items;
            expect(viktorItem.getId()).toBe(CHAT_IDS.VIKTOR);
            expect(benderItem.getId()).toBe(CHAT_IDS.BENDER);
            expect(user2.getId()).toBe(CHAT_IDS.USER_2);
        });
        it("Change pin/unpin for user 2", () => {
            let items = getChatItems();
            items[3].pinned = true;
            items = getChatItems();
            expect(items[0].getId()).toBe(CHAT_IDS.USER_2);
            expect(items[1].getId()).toBe(CHAT_IDS.VIKTOR);
            expect(items[2].getId()).toBe(CHAT_IDS.BENDER);

            items[0].pinned = false;
            items = getChatItems();
            expect(items[0].getId()).toBe(CHAT_IDS.VIKTOR);
            expect(items[1].getId()).toBe(CHAT_IDS.BENDER);
            expect(items[3].getId()).toBe(CHAT_IDS.USER_2);
        });
    });

    describe("Add new chat. Update existing chat", () => {
        beforeEach(() => {
            chatList.setItems(initialItems);
        });
        it("Add new chat using update.", () => {
            chatList.updateChat({
                id: CHAT_IDS.INITI_SUPPORT,
                title: "INITI SUPPORT",
                text: "Your ticket was registred",
                unreadMessages: 100,
                timestamp: Date.now(),
            });
            const [viktorItem, benderItem, supportItem, user1, user2, user3] = getChatItems();
            expect(viktorItem.getId()).toBe(CHAT_IDS.VIKTOR);
            expect(benderItem.getId()).toBe(CHAT_IDS.BENDER);
            expect(supportItem.getId()).toBe(CHAT_IDS.INITI_SUPPORT);
            expect(user2.getId()).toBe(CHAT_IDS.USER_2);
        });

        it("Update existing chat.", () => {
            chatList.updateChat({
                id: CHAT_IDS.USER_3,
                text: "Your ticket was registred",
                timestamp: Date.now(),
            });
            const [viktorItem, benderItem, user3, user1, user2] = getChatItems();
            expect(viktorItem.getId()).toBe(CHAT_IDS.VIKTOR);
            expect(benderItem.getId()).toBe(CHAT_IDS.BENDER);
            expect(user3.getId()).toBe(CHAT_IDS.USER_3);
            expect(user2.getId()).toBe(CHAT_IDS.USER_2);
        })
    });
});

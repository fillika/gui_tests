module.exports = {
    rootDir: __dirname,
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    globalSetup: "./jest.globalSetup.js",
    setupFiles: ["<rootDir>/jest.setup.js"],
    testTimeout: 5000,
    testEnvironment: "jsdom",
    cache: false,
};